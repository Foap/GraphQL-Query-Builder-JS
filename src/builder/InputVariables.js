export default class InputVariables {

    constructor(schema, rootSchema, variables, nameAs = '') {
        this.schema = schema;
        this.rootSchema = rootSchema;
        this.variables = variables;
        this.nameAs = nameAs.toString();
    }

    findInputObject = name => {
        return this.schema.inputObjects.filter(inputObject => inputObject.appName === name)[0];
    }

    getValues = (variables = this.variables) => {
        let values = {};
        Object.keys(variables).forEach(variableName => {
            if (typeof variables[variableName] === 'object') {
                Object.keys(variables).forEach(variable => {
                    values = { ...values, ...this.getValues(variables[variable]) };
                });
            } else {
                values[`${this.nameAs ? `${this.nameAs}__` : ``}${this.getFieldName(variables, variableName)}`] = this.getFieldValue(variables, variableName);
            }
        });

        return values;
    }

    getMapForObject = (object = this.rootSchema, variables = this.variables, stringArgsDefinitions = '') => {
        Object.keys(variables).forEach(variableName => {
            if (typeof variables[variableName] === 'object') {
                object.args.forEach(arg => {
                    const childObject = this.findInputObject(arg.object.typeName);
                    stringArgsDefinitions += ` ${arg.name}: { ${this.getMapForObject(childObject, variables[variableName])} }`;
                });
            } else {
                const argSchema = this.getVariableSchema(object, variables, variableName);
                if (argSchema) {
                    stringArgsDefinitions += ` ${argSchema.name}: $${this.nameAs ? `${this.nameAs}__` : ``}${variableName}`;
                } else {
                    throw `[QueryBuilder] Cant't find variable "${variableName}" in "${object.appName}" query`;
                }
            }
        });

        return stringArgsDefinitions;
    }

    getMapForRoot = (object = this.rootSchema, variables = this.variables, stringArgsDefinitions = '') => {
        Object.keys(variables).forEach(variableName => {
            if (typeof variables[variableName] === 'object') {
                object.args.forEach(arg => {
                    const childObject = this.findInputObject(arg.object.typeName);
                    stringArgsDefinitions += this.getMapForRoot(childObject, variables[variableName]);
                });
            } else {
                const argSchema = this.getVariableSchema(object, variables, variableName);
                if (argSchema) {
                    stringArgsDefinitions += ` $${this.nameAs ? `${this.nameAs}__` : ``}${variableName}: ${this.getFieldType(argSchema)}`;
                } else {
                    throw `[QueryBuilder] Cant't find variable "${variableName}" in "${object.appName}" query`;
                }
            }
        });

        return stringArgsDefinitions;
    }

    getFieldType = field => {
        let stringType = field.object.typeName;

        if (field.object.isArray) stringType = `[${stringType}]`;
        if (field.object.isRequired) stringType = `${stringType}!`;

        return stringType;
    }

    getVariableSchema = (object, variables, variableName) => {
        return object.args.filter(arg => arg.appName === this.getFieldName(variables, variableName))[0];
    }

    getFieldName = (variables, variableName) => {
        return this.isObjectTypeParam(variables[variableName]) ? variables[variableName].name : variableName;
    }

    getFieldValue = (variables, variableName) => {
        return this.isObjectTypeParam(variables[variableName]) ? variables[variableName].value : variables[variableName];
    }

    isObjectTypeParam = field => {
        return field && typeof field === 'object' && field.hasOwnProperty('value');
    }
}

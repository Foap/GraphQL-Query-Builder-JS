
export default class Variables {

    constructor(rootSchema, variables, nameAs = '') {
        this.rootSchema = rootSchema;
        this.variables = variables;
        this.nameAs = nameAs.toString();
    }

    getValues = () => {
        let values = {};
        Object.keys(this.variables).forEach(variableName => {
            values[`${this.nameAs ? `${this.nameAs}__` : ``}${this.getFieldName(variableName)}`] = this.getFieldValue(variableName);
        });

        return values;
    }

    getMapForObject = () => {
        if (!this.rootSchema.args.length) {
            return ``;
        }

        let stringArgsDefinitions = ``;
        Object.keys(this.variables).forEach(variableName => {
            const argSchema = this.getVariableSchema(variableName);
            if (argSchema) {
                stringArgsDefinitions = `${stringArgsDefinitions} ${argSchema.name}: $${this.nameAs ? `${this.nameAs}__` : ``}${variableName}`;
            } else {
                throw `[QueryBuilder] Cant't find variable "${variableName}" in "${this.rootSchema.appName}" query`;
            }
        });

        return stringArgsDefinitions ? `( ${stringArgsDefinitions} )` : ``;
    }

    getMapForRoot = () => {
        let stringArgsDefinitions = ``;

        if (!this.rootSchema.args.length) {
            return stringArgsDefinitions;
        }

        Object.keys(this.variables).forEach(variableName => {
            const argSchema = this.getVariableSchema(variableName);
            if (argSchema) {
                stringArgsDefinitions = `${stringArgsDefinitions} $${this.nameAs ? `${this.nameAs}__` : ``}${variableName}: ${this.getFieldType(argSchema)}`;
            } else {
                throw `[QueryBuilder] Cant't find variable "${variableName}" in "${this.rootSchema.appName}" query`;
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


    getVariableSchema = variableName => {
        return this.rootSchema.args.filter(arg => arg.appName === this.getFieldName(variableName))[0];
    }

    getFieldName = variableName => {
        return this.isObjectTypeParam(this.variables[variableName]) ? this.variables[variableName].name : variableName;
    }

    getFieldValue = variableName => {
        return this.isObjectTypeParam(this.variables[variableName]) ? this.variables[variableName].value : this.variables[variableName];
    }

    isObjectTypeParam = field => {
        return field && typeof field === 'object' && field.hasOwnProperty('value');
    }
}

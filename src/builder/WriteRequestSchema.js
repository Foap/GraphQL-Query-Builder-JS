export default class WriteRequestSchema {

    constructor(schema, name = '', objects = []) {
        this.name = name.toString();
        this.objects = objects;
    }

    toString = () => {
        let requestSchemaHead = '';
        let requestSchemaBody = '';

        this.objects.forEach(object => {
            requestSchemaBody = `${requestSchemaBody}${object.toString()}`;
            requestSchemaHead = `${requestSchemaHead} ${object.variables.getMapForRoot()}`;
        });

        return `mutation ${this.name} ${requestSchemaHead ? `( ${requestSchemaHead} )` : ``} { ${requestSchemaBody} }`;
    }

    getVariables = () => {
        let variables = {};
        this.objects.forEach(object => {
            variables = { ...variables, ...object.variables.getValues() };
        });

        return variables;
    }
}

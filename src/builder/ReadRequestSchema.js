
export default class ReadRequestSchema {

    constructor(schema, name = '', objects = []) {
        this.name = name.toString();
        this.objects = objects;
    }

    toString = () => {
        let requestSchemaHead = '';
        let requestSchemaBody = '';

        this.objects.forEach(object => {
            requestSchemaHead = `${requestSchemaHead}${object.variables.getMapForRoot()}`;
            requestSchemaBody = `${requestSchemaBody} ${object.toString()}`;
        });

        return `query ${this.name} ${requestSchemaHead ? `( ${requestSchemaHead} )` : ``} { ${requestSchemaBody} }`;
    }

    getVariables = () => {
        let variables = {};
        this.objects.forEach(object => {
            variables = { ...variables, ...object.variables.getValues() };
        });

        return variables;
    }
}

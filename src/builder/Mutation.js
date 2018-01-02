import InputVariables from './InputVariables';
import SchemaObject from './SchemaObject';

export default class Mutation {

    constructor(schema, name = '', variables = {}, fields = [], nameAs = '') {
        this.schema = schema;
        this.name = name.toString();
        this.fields = fields;
        this.nameAs = nameAs.toString();

        this.rootSchema = this.getRootSchema();
        this.rootObject = new SchemaObject(this.schema, this.rootSchema.object.name);
        this.variables = new InputVariables(this.schema, this.rootSchema, variables, this.nameAs);
    }

    getRootSchema = () => {
        const querySchema = this.schema.mutations.filter(querySchema => querySchema.appName === this.name)[0];
        if (!querySchema) {
            throw `[QueryBuilder] Can't find "${name}" mutation object`;
        }

        return querySchema;
    }

    getName = () => {
        return this.nameAs ? `${this.nameAs}: ${this.rootSchema.name}` : `${this.rootSchema.name}`;
    }

    toString = () => {
        const fields = this.rootObject.getFields(this.fields);
        const variables = this.variables.getMapForObject();
        const queryString = `${this.getName()} ${variables ? `( ${variables} )` : ``} ${fields}`;

        return queryString;
    }
}

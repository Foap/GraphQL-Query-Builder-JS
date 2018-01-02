import Variables from './Variables';
import SchemaObject from './SchemaObject';

export default class Query {

    constructor(schema, name = '', variables = {}, fields = [], nameAs = '') {
        this.schema = schema;
        this.name = name.toString();
        this.fields = fields;
        this.nameAs = nameAs.toString();

        this.rootSchema = this.getRootSchema();
        this.rootObject = new SchemaObject(this.schema, this.rootSchema.object.typeName);
        this.variables = new Variables(this.rootSchema, variables, this.nameAs);
    }

    getRootSchema = () => {
        const querySchema = this.schema.queries.filter(querySchema => querySchema.appName === this.name)[0];
        if (!querySchema) {
            throw `[QueryBuilder] Can't find "${name}" query object`;
        }

        return querySchema;
    }

    getName = () => {
        return this.nameAs ? `${this.nameAs}: ${this.rootSchema.name}` : `${this.rootSchema.name}`;
    }

    toString = () => {
        const fields = this.rootObject.getFields(this.fields);
        const queryString = `${this.getName()} ${this.variables.getMapForObject()} ${fields}`;

        return queryString;
    }
}

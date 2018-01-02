import Variables from 'Builder/Variables';

export default class SchemaObject {

    constructor(schema, name = '') {
        this.schema = schema;
        this.name = name.toString();
        this.instance = this.findObject(this.name);

        if (!this.instance) {
            throw `[QueryBuilder] Can't find object "${this.name}"`;
        }
    }

    findObject = name => {
        return this.schema.objects.filter(object => object.appName === name)[0];
    }

    findField = (object, fieldName) => {
        return object.fields.filter(field => field.appName === fieldName)[0];
    }

    getFields = (fields, object = this.instance) => {
        let stringFields = '';

        fields.forEach(field => {
            if (typeof field === 'string') {
                const schemaField = this.findField(object, field);
                stringFields = `${stringFields} ${schemaField.name}`;
            } else if (typeof field === 'object') {

                Object.keys(field).forEach(fieldName => {
                    //Append object field name
                    const schemaField = this.findField(object, fieldName);
                    if (!schemaField) {
                        throw `[QueryBuilder] Cant't find field ${fieldName} in ${object.name} object`;
                    }
                    stringFields = `${stringFields} ${schemaField.name}`;

                    //Find object fields
                    const childObject = this.findObject(schemaField.object.typeName);
                    if (!childObject) {
                        throw `[QueryBuilder] Cant't find ${childObject.typeName} object`;
                    }
                    stringFields = `${stringFields} ${this.getFields(field[fieldName], childObject)}`;
                });
            }
        });

        return `{ ${stringFields} }`;
    }
}

import util from 'util';
import fs from 'fs';
import { introspectionQuery } from 'graphql/utilities/introspectionQuery';
import axios from 'axios';

import { parseQueryObject, getObjects, parseObject, getInputObjects, parseInputObject } from 'Parser/objects';

let schema;

export function fetchSchema(path) {
    return importSchema(path)
        .then(response => {
            return parseSchema(response);
        });
}

export function readSchema(schemaPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(schemaPath, "utf8", function (err, data) {
            if (err) reject(err);
            resolve(JSON.parse(data.toString()));
        });
    });
}

export function saveSchema(schema, savePath) {
    return new Promise((resolve, reject) => {
        fs.writeFile(savePath, JSON.stringify(schema), function (err) {
            if (err) reject(err);

            resolve(savePath);
        });
    });
}

export function compareSchema(schema1, schema2) {
    return generateStats(schema2, schema1);
}

function importSchema(path) {
    return axios({
        method: "POST",
        url: path,
        data: {
            query: introspectionQuery
        },
        responseType: 'json'
    })
        .then(response => {
            schema = response.data.data;
            return schema;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}


function parseSchema(savePath) {
    return {
        queries: parseRootSchema('Query'),
        mutations: parseRootSchema('Mutation'),
        objects: parseObjectsSchema('OBJECT'),
        inputObjects: parseObjectsSchema('INPUT_OBJECT')
    };
}

function parseRootSchema(rootQueryName) {
    const rootQueries = [];
    schema.__schema.types.forEach(rootQuery => {
        if (rootQuery.name === rootQueryName) {
            const rootQueryFields = rootQuery.fields;
            rootQueryFields.map(rootQueryField => {
                rootQueries.push(parseQueryObject(schema, rootQueryField));
            });
        }
    });

    return rootQueries;
}

function parseObjectsSchema(kind = 'OBJECT') {
    let objects = getObjects(schema, kind).filter(object =>
        !object.name.startsWith('__') &&
        object.name !== 'Query' &&
        object.name !== 'Mutation'
    );

    objects = objects.map(object => {
        return parseObject(schema, object, true);
    });

    return objects;
}

function generateStats(schema, previousSchema = null) {
    let lengths = {
        queries: schema.queries.length,
        mutations: schema.mutations.length,
        objects: schema.objects.length,
        inputObjects: schema.inputObjects.length
    };

    if (previousSchema) {
        lengths = {
            ...lengths,
            previousQueries: previousSchema.queries.length,
            previousMutations: previousSchema.mutations.length,
            previousObjects: previousSchema.objects.length,
            previousInputObjects: previousSchema.inputObjects.length
        };

        return {
            queries: generateStatText(lengths.queries, (lengths.queries - lengths.previousQueries)),
            mutations: generateStatText(lengths.mutations, (lengths.mutations - lengths.previousMutations)),
            objects: generateStatText(lengths.objects, (lengths.objects - lengths.previousObjects)),
            inputObjects: generateStatText(lengths.inputObjects, (lengths.inputObjects - lengths.previousInputObjects))
        };
    } else {
        return {
            queries: generateStatText(lengths.queries, lengths.queries),
            mutations: generateStatText(lengths.mutations, lengths.mutations),
            objects: generateStatText(lengths.objects, lengths.objects),
            inputObjects: generateStatText(lengths.inputObjects, lengths.inputObjects)
        };
    }
}


function generateStatText(length, difference) {
    let text = ``;
    if (difference >= 0) {
        text = `${length} (+${difference})`;
    } else if (difference < 0) {
        text = `${length} (-${difference})`;
    }

    return text;
}

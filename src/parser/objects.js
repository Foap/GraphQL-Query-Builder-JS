import util from 'util';

import { toCamelCase } from '../helpers/String';
import { parseArg, parseArgs, parseArgType } from './types';

export function parseQueryObject(schema, object) {
    const type = getObjectByName(schema, object.type.name);
    let queryObject = {
        name: object.name,
        appName: toCamelCase(object.name),
        args: object.hasOwnProperty('args') ? parseArgs(schema, object.args) : [],
        object: type ? parseObject(schema, type) : parseArgType(schema, object.type)
    };

    return queryObject;
}

export function getObjectByName(schema, name) {
    let objects = getObjects(schema).filter(object => object.name === name);
    return objects.length ? objects[0] : null;
}

export function parseObject(schema, object, includeFields = false) {
    if (!object) return null;

    let parsedObject = {
        name: object.name,
        appName: toCamelCase(object.name),
        args: object.hasOwnProperty('args') ? parseArgs(schema, object.args) : []
    };

    if (includeFields) {
        parsedObject.fields = object.hasOwnProperty('fields') && object.fields ? object.fields.map(field => parseArg(schema, field)) : [];
        parsedObject.args = object.hasOwnProperty('inputFields') && object.inputFields ? object.inputFields.map(inputField => parseArg(schema, inputField)) : [];
    }

    return parsedObject;
}

export function getObjects(schema, kind = null) {
    return kind ? schema.__schema.types.filter(type => type.kind === kind) : schema.__schema.types;
}



import util from 'util';

import { toCamelCase } from 'Helpers/String';

export function parseArgs(schema, argumentsArray) {
    if(Object.prototype.toString.call( argumentsArray ) !== '[object Array]') {
        return [];
    }

    return argumentsArray.map(argumentObject => parseArg(schema, argumentObject));
}

export function parseArg(schema, argumentObject) {
    if(typeof argumentObject !== 'object') {
        return null;
    }   

    return {
        name: argumentObject.name,
        appName: toCamelCase(argumentObject.name),
        object: parseArgType(schema, argumentObject.type)
    };
}

export function parseArgType(schema, argumentTypeObject, typeSchema = null) {
    typeSchema =  {
        isRequired: false,
        isArray: false,
        isObject: false,
        typeName: '',
        ...typeSchema
    };

    switch (argumentTypeObject.kind) {
        case 'NON_NULL':
            typeSchema.isRequired = true;
            break;
        case 'LIST':
            typeSchema.isArray = true;
            break;
        case 'OBJECT':
            typeSchema.isObject = true;
            typeSchema.typeName = argumentTypeObject.name;
            break;
        default:
            typeSchema.typeName = argumentTypeObject.name;
            break;
    }

    if (argumentTypeObject.hasOwnProperty('ofType') && argumentTypeObject.ofType) {
        typeSchema = parseArgType(schema, argumentTypeObject.ofType, typeSchema);
    }

    return typeSchema;
}

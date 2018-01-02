
export function toCamelCase(input) {
    return input.replace(/(\_\w)/g, function (m) {
        return m[1].toUpperCase();
    });
}

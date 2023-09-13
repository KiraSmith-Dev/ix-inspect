"use strict";
// Most of this could be handled by a validation library, but I didn't think this little bit of validation warranted a dependency
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptions = exports.defaultOptions = void 0;
;
const inspectOptionsTypeMap = {
    depth: ['number'],
    color: ['boolean'],
    breakLength: ['number'],
    indentation: ['string', 'number'],
    showHidden: ['boolean']
};
// Unknown since a consumer could change it to anything
exports.defaultOptions = {
    depth: 5,
    color: true,
    breakLength: 80,
    indentation: 2,
    showHidden: false
};
function verifyOptionsType(options, message) {
    if (typeof options !== 'object' || options === null)
        throw new TypeError(message);
}
function applyDefaults(partialOptions) {
    verifyOptionsType(partialOptions, 'Type of inspect options must be object');
    verifyOptionsType(exports.defaultOptions, 'Type of inspect defaultOptions must be object');
    return Object.assign(exports.defaultOptions, partialOptions);
}
function validateOptionKeys(maybeValidOptions) {
    for (const [key, expectedTypes] of Object.entries(inspectOptionsTypeMap)) {
        if (!(key in maybeValidOptions))
            throw new TypeError(`Inspect option '${key}' must exist. Did you remove it from the defaultOptions?`);
        if (!expectedTypes.includes(typeof maybeValidOptions[key]))
            throw new TypeError(`Type of inspect option '${key}' (of type ${typeof maybeValidOptions[key]}) must be of type (${expectedTypes.join(' | ')})`);
    }
}
function validateOptions(suppliedOptions) {
    const maybeValidOptions = applyDefaults(suppliedOptions);
    validateOptionKeys(maybeValidOptions);
    return maybeValidOptions;
}
exports.validateOptions = validateOptions;
//# sourceMappingURL=options.js.map
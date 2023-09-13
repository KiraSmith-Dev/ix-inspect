"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const primordials_1 = __importDefault(require("../primordials"));
const { ObjectGetPrototypeOf, ObjectPrototypeHasOwnProperty, FunctionPrototypeToString, } = primordials_1.default;
const stripCommentsRegExp = /(\/\/.*?\n)|(\/\*(.|\n)*?\*\/)/g;
const classRegExp = /^(\s+[^(]*?)\s*{/;
function getClassBase(vd) {
    var _a;
    const hasName = ObjectPrototypeHasOwnProperty(vd, 'name');
    const name = (hasName && vd.name) || '(anonymous)';
    const base = `class ${name}`;
    const maybeConstructorTag = (vd.typeName !== 'Function' && vd.typeName !== null) ? ` [${vd.typeName}]` : '';
    const maybeTag = (vd.toStringTagValue !== '' && vd.typeName !== vd.toStringTagValue) ? ` [${vd.toStringTagValue}]` : '';
    const extendsTag = `extends ${vd.typeName !== null ? (_a = ObjectGetPrototypeOf(vd).name) !== null && _a !== void 0 ? _a : '' : '[null prototype]'}`;
    return `[${base}${maybeConstructorTag}${maybeTag}${extendsTag}]`;
}
function isGeneratorFunction(value) {
    return (typeof value === 'function') && Function.prototype.toString.call(value).match(/^(async\s+)?function *\*/);
}
function isAsyncFunction(value) {
    return (typeof value === 'function') && Function.prototype.toString.call(value).startsWith('async');
}
function getFunctionPrefix(value, vd) {
    const stringified = FunctionPrototypeToString(value);
    if (stringified.startsWith('class') && stringified.endsWith('}')) {
        const slice = stringified.slice(5, -1);
        const bracketIndex = slice.indexOf('{');
        if (bracketIndex !== -1 && (!slice.slice(0, bracketIndex).includes('(') || classRegExp.test(slice.replace(stripCommentsRegExp, ''))))
            return getClassBase(vd);
    }
    const type = `${isAsyncFunction(value) ? `Async` : isGeneratorFunction(value) ? `Generator` : ''}Function`;
    const maybeNullProtoTag = (vd.typeName === null) ? ' (null prototype)' : '';
    const functionNameTag = (value.name === '') ? ' (anonymous)' : `: ${value.name}`;
    const maybeTypeNameTag = (vd.typeName !== type && vd.typeName !== null) ? ` ${vd.typeName}` : '';
    const maybeToStringTagValue = (vd.toStringTagValue !== '' && vd.typeName !== vd.toStringTagValue) ? ` [${vd.toStringTagValue}]` : '';
    return `[${type}${maybeNullProtoTag}${functionNameTag}]${maybeTypeNameTag}${maybeToStringTagValue}`;
}
exports.default = getFunctionPrefix;
//# sourceMappingURL=functionPrefix.js.map
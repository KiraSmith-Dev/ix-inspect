"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonPrimitiveTypeName = exports.getPrimitiveTypeName = exports.isNonPrimitive = exports.isPrimitive = void 0;
const assert_1 = __importDefault(require("../assert"));
function isPrimitive(value) {
    return !isObject(value) && typeof value !== 'function';
}
exports.isPrimitive = isPrimitive;
function isNonPrimitive(value) {
    return !isPrimitive(value);
}
exports.isNonPrimitive = isNonPrimitive;
function getPrimitiveTypeName(value) {
    (0, assert_1.default)(isPrimitive(value), `value passed to getPrimitiveTypeName wasn't primitive`);
    if (value === null)
        return 'null';
    return typeof value;
}
exports.getPrimitiveTypeName = getPrimitiveTypeName;
function getNonPrimitiveTypeName(value) {
    (0, assert_1.default)(!isPrimitive(value), `value passed to getNonPrimitiveTypeName was primitive`);
    return getConstructorName(value);
}
exports.getNonPrimitiveTypeName = getNonPrimitiveTypeName;
function getConstructorName(value) {
    var _a;
    (0, assert_1.default)(isNonPrimitive(value), 'Primitive passed to getConstructorName');
    if ((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name)
        return value.constructor.name;
    const objectString = Object.prototype.toString.call(value);
    const match = objectString.match(/^\[object ([^\]]+)\]/);
    if (match && match[1])
        return match[1];
    return 'Object';
}
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
//# sourceMappingURL=index.js.map
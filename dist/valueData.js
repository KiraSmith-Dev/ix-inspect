"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValueData = void 0;
const typeDetection_1 = require("./typeDetection");
const primordials_1 = __importDefault(require("./primordials"));
const { SymbolToStringTag, ObjectPrototypeHasOwnProperty, ObjectPrototypePropertyIsEnumerable } = primordials_1.default;
function createValueData(value, ctx) {
    const isPrim = (0, typeDetection_1.isPrimitive)(value);
    const typeName = isPrim ? (0, typeDetection_1.getPrimitiveTypeName)(value) : (0, typeDetection_1.getNonPrimitiveTypeName)(value);
    let toStringTagValue = value ? value[SymbolToStringTag] : '';
    if (typeof toStringTagValue !== 'string' || (toStringTagValue !== '' && (ctx.showHidden ? ObjectPrototypeHasOwnProperty : ObjectPrototypePropertyIsEnumerable)(value, SymbolToStringTag)))
        toStringTagValue = '';
    function getPrefix(size = '') {
        if (typeName === null) {
            if (toStringTagValue !== '' && typeName !== toStringTagValue)
                return `[${typeName}${size}: null prototype] [${toStringTagValue}] `;
            return `[${typeName}${size}: null prototype] `;
        }
        if (toStringTagValue !== '' && typeName !== toStringTagValue)
            return `${typeName}${size} [${toStringTagValue}] `;
        if (typeName === 'Object' && !size.length)
            return '';
        return `${typeName}${size} `;
    }
    return {
        isPrim: isPrim,
        typeName: typeName,
        toStringTagValue: toStringTagValue,
        getPrefix
    };
}
exports.createValueData = createValueData;
//# sourceMappingURL=valueData.js.map
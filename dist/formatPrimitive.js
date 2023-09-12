"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.primitiveFormatMap = void 0;
const colors_1 = __importDefault(require("./colors"));
exports.primitiveFormatMap = new Map();
exports.primitiveFormatMap.set('string', (value, vd, ctx) => {
    return colors_1.default.string(`'${value}'`);
});
exports.primitiveFormatMap.set('number', (value, vd, ctx) => {
    // Format -0 as '-0'. Checking `number === -0` won't distinguish 0 from -0. https://github.com/nodejs/node/blob/f9322f37a595e7f692ecda927121bee0beca16a4/lib/internal/util/inspect.js#L1487
    if (Object.is(value, -0))
        return colors_1.default.number('-0');
    return colors_1.default.number(String(value));
});
exports.primitiveFormatMap.set('bigint', (value, vd, ctx) => {
    return colors_1.default.bigint(`${String(value)}n`);
});
exports.primitiveFormatMap.set('boolean', (value, vd, ctx) => {
    return colors_1.default.boolean(value ? 'true' : 'false');
});
exports.primitiveFormatMap.set('symbol', (value, vd, ctx) => {
    return colors_1.default.symbol(String(value));
});
exports.primitiveFormatMap.set('undefined', colors_1.default.undefined('undefined'));
exports.primitiveFormatMap.set('null', colors_1.default.null('null'));
/*
export default function formatPrimitive(value: unknown, ctx: IxInspectContext) {
    assert(isPrimitive(value), 'Non-primitive passed to formatPrimitive');
    
    const typeName = getPrimitiveTypeName(value);
    const formatter = primitiveFormatMap.get(typeName);
    assert(formatter, `No formatter exists for primitive type "${typeName}"`);
    
    // Some properties are functions that require the value, some are constant
    return typeof formatter === 'function' ? formatter(value, ctx) : formatter;
}
*/ 
//# sourceMappingURL=formatPrimitive.js.map
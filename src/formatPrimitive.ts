import { IxInspectContext } from './context';
import { Formatter, getPrimitiveTypeName, isPrimitive, PrimitiveTypeString } from './typeDetection';
import { ValueDataPrim } from './valueData';

export const primitiveFormatMap = new Map<PrimitiveTypeString, Formatter<any, any> | string>();

primitiveFormatMap.set('string', (value: string, vd: ValueDataPrim, ctx: IxInspectContext) => {
    return ctx.colorMap.string(`'${value}'`);
});

primitiveFormatMap.set('number', (value: number, vd: ValueDataPrim, ctx: IxInspectContext) => {
    // Format -0 as '-0'. Checking `number === -0` won't distinguish 0 from -0. https://github.com/nodejs/node/blob/f9322f37a595e7f692ecda927121bee0beca16a4/lib/internal/util/inspect.js#L1487
    if (Object.is(value, -0))
        return ctx.colorMap.number('-0');
    
    return ctx.colorMap.number(String(value));
});

primitiveFormatMap.set('bigint', (value: number, vd: ValueDataPrim, ctx: IxInspectContext) => {
    return ctx.colorMap.bigint(`${String(value)}n`);
});

primitiveFormatMap.set('boolean', (value: number, vd: ValueDataPrim, ctx: IxInspectContext) => {
    return ctx.colorMap.boolean(value ? 'true' : 'false');
});

primitiveFormatMap.set('symbol', (value: number, vd: ValueDataPrim, ctx: IxInspectContext) => {
    return ctx.colorMap.symbol(String(value));
});

primitiveFormatMap.set('undefined', (value: number, vd: ValueDataPrim, ctx: IxInspectContext) => {
    return ctx.colorMap.undefined('undefined');
});

primitiveFormatMap.set('null', (value: number, vd: ValueDataPrim, ctx: IxInspectContext) => {
    return ctx.colorMap.null('null');
});

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
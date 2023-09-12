import { IxInspectContext } from './context';
import { isPrimitive, NonPrimitive, PrimitiveTypeString } from './typeDetection';
import { primitiveFormatMap } from './formatPrimitive';
import { nonPrimitiveFallbackFormatter, nonPrimitiveFormatMap } from './formatNonPrimitive';
import assert from './assert';
import { createValueData, ValueData } from './valueData';
import inspect from './ixInspect';
import primordials from './primordials';
import colors from './colors';
import { customInspectShim, ixOptionsToUtilOptions } from './customInspectShim';

const { FunctionPrototypeCall } = primordials;

const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

function checkCircular(value: unknown, vd: ValueData, ctx: IxInspectContext): { shouldReturn: boolean, prefix: string } {
    const returnValue = { shouldReturn: false, prefix: '' };
    if (vd.isPrim)
        return returnValue;
    
    const valueIsParent = ctx.parentValues.includes(value);
    
    if (valueIsParent || ctx.circularRefIndexMap.has(value)) {
        const index = ctx.circularRefIndexMap.has(value) ? ctx.circularRefIndexMap.get(value) : ctx.circularRefIndexMap.add(value);
        
        returnValue.shouldReturn = valueIsParent;
        returnValue.prefix = valueIsParent ? colors.circular(`[Circular *${index}]`) : colors.ref(`<ref *${index}> `);
    }
    
    return returnValue;
}

/*
// Provide a hook for user-specified inspect functions.
// Check that value is an object with an inspect function on it.
if (ctx.customInspect) {
    const maybeCustom = value[customInspectSymbol];
    if (typeof maybeCustom === 'function' &&
            // Filter out the util module, its inspect function is special.
            maybeCustom !== inspect &&
            // Also filter out any prototype objects using the circular check.
            !(value.constructor && value.constructor.prototype === value)) {
        // This makes sure the recurseTimes are reported as before while using
        // a counter internally.
        const depth = ctx.depth === null ? null : ctx.depth - recurseTimes;
        const isCrossContext = proxy !== undefined || !(context instanceof Object);
        const ret = FunctionPrototypeCall(
            maybeCustom,
            context,
            depth,
            getUserOptions(ctx, isCrossContext),
            inspect
        );
        // If the custom inspection method returned `this`, don't go into
        // infinite recursion.
        if (ret !== context) {
            if (typeof ret !== 'string') {
                return formatValue(ctx, ret, recurseTimes);
            }
            return ret.replace(/\n/g, `\n${' '.repeat(ctx.indentationLvl)}`);
        }
    }
}
*/

function formatValue(value: unknown, vd: ValueData, ctx: IxInspectContext): string {
    if (!vd.isPrim && ctx.currentDepth >= ctx.maxDepth)
        return nonPrimitiveFallbackFormatter(value as NonPrimitive, vd, ctx);
    
    const maybeCustomInspect: unknown = value && (value as any)[customInspectSymbol];
    if (!vd.isPrim && maybeCustomInspect && typeof maybeCustomInspect === 'function' && maybeCustomInspect !== inspect && maybeCustomInspect !== customInspectShim) {
        const returnValue = FunctionPrototypeCall(maybeCustomInspect, value, ctx.maxDepth - ctx.currentDepth, ixOptionsToUtilOptions(ctx.originalOptions), customInspectShim);
        
        if (returnValue !== value) {
            if (typeof returnValue !== 'string')
                return inspectValue(returnValue, ctx);
            
            return returnValue.replace(/\n/g, `\n${ctx.totalIndentation}`);
        }
    }
    
    const formatter = vd.isPrim ? primitiveFormatMap.get(vd.typeName) : nonPrimitiveFormatMap.get(vd.typeName);
    
    assert(!vd.isPrim || formatter, `No formatter exists for primitive type "${vd.typeName}"`)
    
    if (!vd.isPrim && !formatter)
        return nonPrimitiveFallbackFormatter(value as NonPrimitive, vd, ctx);
    
    return typeof formatter === 'function' ? formatter(value, vd, ctx) : (formatter as string);
}

export default function inspectValue(value: unknown, ctx: IxInspectContext): string {
    const vd = createValueData(value, ctx);
    const circularData = checkCircular(value, vd, ctx);
    
    if (circularData.shouldReturn)
        return circularData.prefix;
    
    return colors.default(`${circularData.prefix}${formatValue(value, vd, ctx)}`);
}

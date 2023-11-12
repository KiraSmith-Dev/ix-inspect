import chalk from 'chalk';
import { IxInspectContext } from './context';
import inspectValue from './inspectValue';
import { Formatter, getNonPrimitiveTypeName, isNonPrimitive, NonPrimitive } from './typeDetection';
import getFunctionPrefix from './typeDetection/functionPrefix';
import { ValueData, ValueDataNonPrim } from './valueData';
import primordials from './primordials';
import colors from './colors';
import stripAnsi from 'strip-ansi';

const { ObjectGetOwnPropertyDescriptor } = primordials;

export const nonPrimitiveFormatMap = new Map<string | symbol, Formatter<any, any> | string>();

type InspectEntry = { 
    key: string | symbol, 
    value: unknown, 
    needsFormatting: boolean
};

function getEntries(value: NonPrimitive, vd: ValueDataNonPrim): InspectEntry[] {
    let keys: (string | symbol)[] = [];
    
    try {
        keys = primordials.ObjectKeys(value);
    } catch (err) {
        keys = primordials.ObjectGetOwnPropertyNames(value);
    }
    
    keys.push(...Object.getOwnPropertySymbols(value).filter(symbol => value.propertyIsEnumerable(symbol)));
    
    if (vd.typeName === 'Map')
        keys.push(...(value as Map<any, any>).keys());
    
    // Casting to any is OK - we've just checked that these properties exist
    return keys.map(key => {
        const desc = ObjectGetOwnPropertyDescriptor(value, key);
        
        const labels = [];
        if (desc?.get)
            labels.push('Getter');
        
        if (desc?.set)
            labels.push('Setter');
        
        const valueOfKey = labels.length ? `[${labels.join('/')}]` : (vd.typeName === 'Map') ? (value as Map<any, any>).get(key) : (value as any)[key];
        
        return { key: key, value: valueOfKey, needsFormatting: labels.length ? false : true };
    });
}

// TODO: Possibly instead format all values for circular/ref, so that the topmost value (which isn't under a key, since it's topmost) will also have this applied
function formatPair(ctx: IxInspectContext, entry: InspectEntry, separator = colors.colon(': '), inspectBoth = false): string {
    return `${colors.key(`${inspectBoth ? inspectValue(entry.key, ctx) : typeof entry.key === 'string' ? entry.key : `[${String(entry.key)}]`}`)}${separator}${entry.needsFormatting ? inspectValue(entry.value, ctx) : entry.value}`;
}

// Mostly just a wrapper for changing the ctx properties
function formatEntries(value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext, formatOptions?: { brackets?: [string, string], isAppendingToTag?: boolean, separator?: string }) {
    formatOptions ??= {};
    formatOptions.brackets ??= ['{', '}'];
    formatOptions.isAppendingToTag ??= false;
    
    const entries = getEntries(value, vd);
    
    // Skip a lot of work & better formatting if it's empty
    if (!entries.length)
        return formatOptions.isAppendingToTag ? '' : formatOptions.brackets.join('');
    
    ctx.parentValues.push(value);
    ++ctx.currentDepth;
    const oldIndent = ctx.totalIndentation;
    ctx.totalIndentation += ctx.indentation;
    let formattedEntries = entries.map(entry => formatPair(ctx, entry, formatOptions?.separator, vd.typeName === 'Map'));
    ctx.parentValues.pop();
    --ctx.currentDepth;
    ctx.totalIndentation = oldIndent;
    
    // TODO: Support total indenting
    const isPastBreakLength = formattedEntries.reduce((totalLen, curEntry) => totalLen + stripAnsi(curEntry).length, 0) >= ctx.breakLength;
    const lineBreakOrSpace = isPastBreakLength ? `\n${ctx.totalIndentation}` : ' ';
    //const lineBreakOrSpace = isPastBreakLength ? maybeLineBreak : ' ';
    const maybeRelativeIndent = isPastBreakLength ? ctx.indentation : '';
    
    if (isPastBreakLength)
        formattedEntries = formattedEntries.map(entry => `${maybeRelativeIndent}${entry}`)
    
    const maybePrefix = ctx.circularRefIndexMap.has(value) ? colors.ref(`<ref *${ctx.circularRefIndexMap.get(value)}> `) : '';
    return `${formatOptions.isAppendingToTag ? ' ' : ''}${maybePrefix}${formatOptions.brackets[0]}${lineBreakOrSpace}${formattedEntries.join(`,${lineBreakOrSpace}`)}${lineBreakOrSpace}${formatOptions.brackets[1]}`;
}

nonPrimitiveFormatMap.set('Object', (value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext) => {
    return nonPrimitiveFallbackFormatter(value, vd, ctx);
});

nonPrimitiveFormatMap.set('Function', (value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext) => {
    const functionTag = getFunctionPrefix(value, vd);
    if (ctx.currentDepth >= ctx.maxDepth)
        return functionTag;
    
    return `${functionTag}${formatEntries(value, vd, ctx, { isAppendingToTag: true })}`;
});

nonPrimitiveFormatMap.set('Array', (value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext) => {
    if (!primordials.ArrayIsArray(value))
        return nonPrimitiveFallbackFormatter(value, vd, ctx);
    
    if (!value.length)
        return `[]`;
    
    ctx.parentValues.push(value);
    ++ctx.currentDepth;
    const oldIndent = ctx.totalIndentation;
    ctx.totalIndentation += ctx.indentation;
    let formattedEntries = value.map(entry => inspectValue(entry, ctx));
    ctx.parentValues.pop();
    --ctx.currentDepth;
    ctx.totalIndentation = oldIndent;
    
    const isPastBreakLength = formattedEntries.reduce((totalLen, curEntry) => totalLen + stripAnsi(curEntry).length, 0) >= ctx.breakLength;
    const lineBreakOrSpace = isPastBreakLength ? `\n${ctx.totalIndentation}` : ' ';
    //const lineBreakOrSpace = isPastBreakLength ? maybeLineBreak : ' ';
    const maybeRelativeIndent = isPastBreakLength ? ctx.indentation : '';
    
    if (isPastBreakLength)
        formattedEntries = formattedEntries.map(entry => `${maybeRelativeIndent}${entry}`)
    
    const maybePrefix = ctx.circularRefIndexMap.has(value) ? chalk.red(`<ref *${ctx.circularRefIndexMap.get(value)}> `) : '';
    return `${maybePrefix}[${lineBreakOrSpace}${formattedEntries.join(`,${lineBreakOrSpace}`)}${lineBreakOrSpace}]`;
});

nonPrimitiveFormatMap.set('Map', (value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext) => {
    return `${vd.getPrefix(`(${primordials.MapPrototypeGetSize(value)})`)}${formatEntries(value, vd, ctx, { separator: colors.arrow(' => ') })}`
});

export function nonPrimitiveFallbackFormatter(value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext) {
    if (ctx.currentDepth >= ctx.maxDepth)
        return colors.objectfallback(`[object ${vd.typeName}]`);
    
    return `${vd.getPrefix()}${formatEntries(value, vd, ctx)}`
}

/*
export default function formatNonPrimitive(value: unknown, ctx: IxInspectContext) {
    assert(isNonPrimitive(value), 'Primitive passed to formatNonPrimitive');
    
    const typeName = getNonPrimitiveTypeName(value);
    const formatter = nonPrimitiveFormatMap.get(typeName);
    assert(formatter, `No formatter exists for primitive type "${typeName}"`);
    
    // Some properties are functions that require the value, some are constant
    return typeof formatter === 'function' ? formatter(value, ctx) : formatter;
}
*/
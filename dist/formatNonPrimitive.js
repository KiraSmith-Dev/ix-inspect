"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonPrimitiveFallbackFormatter = exports.nonPrimitiveFormatMap = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inspectValue_1 = __importDefault(require("./inspectValue"));
const functionPrefix_1 = __importDefault(require("./typeDetection/functionPrefix"));
const primordials_1 = __importDefault(require("./primordials"));
const colors_1 = __importDefault(require("./colors"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const { ObjectGetOwnPropertyDescriptor } = primordials_1.default;
exports.nonPrimitiveFormatMap = new Map();
function getEntries(value, vd) {
    let keys = [];
    try {
        keys = primordials_1.default.ObjectKeys(value);
    }
    catch (err) {
        keys = primordials_1.default.ObjectGetOwnPropertyNames(value);
    }
    keys.push(...Object.getOwnPropertySymbols(value).filter(symbol => value.propertyIsEnumerable(symbol)));
    if (vd.typeName === 'Map')
        keys.push(...value.keys());
    // Casting to any is OK - we've just checked that these properties exist
    return keys.map(key => {
        const desc = ObjectGetOwnPropertyDescriptor(value, key);
        const labels = [];
        if (desc === null || desc === void 0 ? void 0 : desc.get)
            labels.push('Getter');
        if (desc === null || desc === void 0 ? void 0 : desc.set)
            labels.push('Setter');
        const valueOfKey = labels.length ? `[${labels.join('/')}]` : (vd.typeName === 'Map') ? value.get(key) : value[key];
        return { key: key, value: valueOfKey, needsFormatting: labels.length ? false : true };
    });
}
// TODO: Possibly instead format all values for circular/ref, so that the topmost value (which isn't under a key, since it's topmost) will also have this applied
function formatPair(ctx, entry, seperator = colors_1.default.colon(': '), inspectBoth = false) {
    return `${colors_1.default.key(`${inspectBoth ? (0, inspectValue_1.default)(entry.key, ctx) : typeof entry.key === 'string' ? entry.key : `[${String(entry.key)}]`}`)}${seperator}${entry.needsFormatting ? (0, inspectValue_1.default)(entry.value, ctx) : entry.value}`;
}
// Mostly just a wrapper for changing the ctx properties
function formatEntries(value, vd, ctx, formatOptions) {
    var _a, _b;
    formatOptions !== null && formatOptions !== void 0 ? formatOptions : (formatOptions = {});
    (_a = formatOptions.brackets) !== null && _a !== void 0 ? _a : (formatOptions.brackets = ['{', '}']);
    (_b = formatOptions.isAppendingToTag) !== null && _b !== void 0 ? _b : (formatOptions.isAppendingToTag = false);
    const entries = getEntries(value, vd);
    // Skip a lot of work & better formatting if it's empty
    if (!entries.length)
        return formatOptions.isAppendingToTag ? '' : formatOptions.brackets.join('');
    ctx.parentValues.push(value);
    ++ctx.currentDepth;
    const oldIndent = ctx.totalIndentation;
    ctx.totalIndentation += ctx.indentation;
    let formattedEntries = entries.map(entry => formatPair(ctx, entry, formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.seperator, vd.typeName === 'Map'));
    ctx.parentValues.pop();
    --ctx.currentDepth;
    ctx.totalIndentation = oldIndent;
    // TODO: Support total indenting
    const isPastBreakLength = formattedEntries.reduce((totalLen, curEntry) => totalLen + (0, strip_ansi_1.default)(curEntry).length, 0) >= ctx.breakLength;
    const lineBreakOrSpace = isPastBreakLength ? `\n${ctx.totalIndentation}` : ' ';
    //const lineBreakOrSpace = isPastBreakLength ? maybeLineBreak : ' ';
    const maybeRelativeIndent = isPastBreakLength ? ctx.indentation : '';
    if (isPastBreakLength)
        formattedEntries = formattedEntries.map(entry => `${maybeRelativeIndent}${entry}`);
    const maybePrefix = ctx.circularRefIndexMap.has(value) ? colors_1.default.ref(`<ref *${ctx.circularRefIndexMap.get(value)}> `) : '';
    return `${formatOptions.isAppendingToTag ? ' ' : ''}${maybePrefix}${formatOptions.brackets[0]}${lineBreakOrSpace}${formattedEntries.join(`,${lineBreakOrSpace}`)}${lineBreakOrSpace}${formatOptions.brackets[1]}`;
}
exports.nonPrimitiveFormatMap.set('Object', (value, vd, ctx) => {
    return nonPrimitiveFallbackFormatter(value, vd, ctx);
});
exports.nonPrimitiveFormatMap.set('Function', (value, vd, ctx) => {
    const functionTag = (0, functionPrefix_1.default)(value, vd);
    if (ctx.currentDepth >= ctx.maxDepth)
        return functionTag;
    return `${functionTag}${formatEntries(value, vd, ctx, { isAppendingToTag: true })}`;
});
exports.nonPrimitiveFormatMap.set('Array', (value, vd, ctx) => {
    if (!primordials_1.default.ArrayIsArray(value))
        return nonPrimitiveFallbackFormatter(value, vd, ctx);
    if (!value.length)
        return `[]`;
    ctx.parentValues.push(value);
    ++ctx.currentDepth;
    const oldIndent = ctx.totalIndentation;
    ctx.totalIndentation += ctx.indentation;
    let formattedEntries = value.map(entry => (0, inspectValue_1.default)(entry, ctx));
    ctx.parentValues.pop();
    --ctx.currentDepth;
    ctx.totalIndentation = oldIndent;
    const isPastBreakLength = formattedEntries.reduce((totalLen, curEntry) => totalLen + (0, strip_ansi_1.default)(curEntry).length, 0) >= ctx.breakLength;
    const lineBreakOrSpace = isPastBreakLength ? `\n${ctx.totalIndentation}` : ' ';
    //const lineBreakOrSpace = isPastBreakLength ? maybeLineBreak : ' ';
    const maybeRelativeIndent = isPastBreakLength ? ctx.indentation : '';
    if (isPastBreakLength)
        formattedEntries = formattedEntries.map(entry => `${maybeRelativeIndent}${entry}`);
    const maybePrefix = ctx.circularRefIndexMap.has(value) ? chalk_1.default.red(`<ref *${ctx.circularRefIndexMap.get(value)}> `) : '';
    return `${maybePrefix}[${lineBreakOrSpace}${formattedEntries.join(`,${lineBreakOrSpace}`)}${lineBreakOrSpace}]`;
});
exports.nonPrimitiveFormatMap.set('Map', (value, vd, ctx) => {
    return `${vd.getPrefix(`(${primordials_1.default.MapPrototypeGetSize(value)})`)}${formatEntries(value, vd, ctx, { seperator: colors_1.default.arrow(' => ') })}`;
});
function nonPrimitiveFallbackFormatter(value, vd, ctx) {
    if (ctx.currentDepth >= ctx.maxDepth)
        return colors_1.default.objectfallback(`[object ${vd.typeName}]`);
    return `${vd.getPrefix()}${formatEntries(value, vd, ctx)}`;
}
exports.nonPrimitiveFallbackFormatter = nonPrimitiveFallbackFormatter;
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
//# sourceMappingURL=formatNonPrimitive.js.map
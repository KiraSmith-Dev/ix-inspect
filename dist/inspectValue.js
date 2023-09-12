"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatPrimitive_1 = require("./formatPrimitive");
const formatNonPrimitive_1 = require("./formatNonPrimitive");
const assert_1 = __importDefault(require("./assert"));
const valueData_1 = require("./valueData");
const ixInspect_1 = __importDefault(require("./ixInspect"));
const primordials_1 = __importDefault(require("./primordials"));
const colors_1 = __importDefault(require("./colors"));
const customInspectShim_1 = require("./customInspectShim");
const { FunctionPrototypeCall } = primordials_1.default;
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
function checkCircular(value, vd, ctx) {
    const returnValue = { shouldReturn: false, prefix: '' };
    if (vd.isPrim)
        return returnValue;
    const valueIsParent = ctx.parentValues.includes(value);
    if (valueIsParent || ctx.circularRefIndexMap.has(value)) {
        const index = ctx.circularRefIndexMap.has(value) ? ctx.circularRefIndexMap.get(value) : ctx.circularRefIndexMap.add(value);
        returnValue.shouldReturn = valueIsParent;
        returnValue.prefix = valueIsParent ? colors_1.default.circular(`[Circular *${index}]`) : colors_1.default.ref(`<ref *${index}> `);
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
function formatValue(value, vd, ctx) {
    if (!vd.isPrim && ctx.currentDepth >= ctx.maxDepth)
        return (0, formatNonPrimitive_1.nonPrimitiveFallbackFormatter)(value, vd, ctx);
    const maybeCustomInspect = value && value[customInspectSymbol];
    if (!vd.isPrim && maybeCustomInspect && typeof maybeCustomInspect === 'function' && maybeCustomInspect !== ixInspect_1.default && maybeCustomInspect !== customInspectShim_1.customInspectShim) {
        const returnValue = FunctionPrototypeCall(maybeCustomInspect, value, ctx.maxDepth - ctx.currentDepth, (0, customInspectShim_1.ixOptionsToUtilOptions)(ctx.originalOptions), customInspectShim_1.customInspectShim);
        if (returnValue !== value) {
            if (typeof returnValue !== 'string')
                return inspectValue(returnValue, ctx);
            return returnValue.replace(/\n/g, `\n${ctx.totalIndentation}`);
        }
    }
    const formatter = vd.isPrim ? formatPrimitive_1.primitiveFormatMap.get(vd.typeName) : formatNonPrimitive_1.nonPrimitiveFormatMap.get(vd.typeName);
    (0, assert_1.default)(!vd.isPrim || formatter, `No formatter exists for primitive type "${vd.typeName}"`);
    if (!vd.isPrim && !formatter)
        return (0, formatNonPrimitive_1.nonPrimitiveFallbackFormatter)(value, vd, ctx);
    return typeof formatter === 'function' ? formatter(value, vd, ctx) : formatter;
}
function inspectValue(value, ctx) {
    const vd = (0, valueData_1.createValueData)(value, ctx);
    const circularData = checkCircular(value, vd, ctx);
    if (circularData.shouldReturn)
        return circularData.prefix;
    return colors_1.default.default(`${circularData.prefix}${formatValue(value, vd, ctx)}`);
}
exports.default = inspectValue;
//# sourceMappingURL=inspectValue.js.map
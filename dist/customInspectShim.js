"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customInspectShim = exports.utilOptionsToIxOptions = exports.ixOptionsToUtilOptions = void 0;
const ixInspect_1 = __importDefault(require("./ixInspect"));
const inspectDefaultOptions = {
    showHidden: false,
    depth: 2,
    colors: false,
    customInspect: true,
    showProxy: false,
    maxArrayLength: 100,
    maxStringLength: 10000,
    breakLength: 80,
    compact: 3,
    sorted: false,
    getters: false,
    numericSeparator: false
};
function ixOptionsToUtilOptions(ixOptions) {
    const moddedOptions = {
        depth: ixOptions === null || ixOptions === void 0 ? void 0 : ixOptions.depth,
        colors: ixOptions === null || ixOptions === void 0 ? void 0 : ixOptions.color,
        breakLength: ixOptions === null || ixOptions === void 0 ? void 0 : ixOptions.breakLength,
        showHidden: ixOptions === null || ixOptions === void 0 ? void 0 : ixOptions.showHidden,
    };
    return Object.assign(inspectDefaultOptions, moddedOptions);
}
exports.ixOptionsToUtilOptions = ixOptionsToUtilOptions;
function utilOptionsToIxOptions(utilInspectOptions) {
    var _a;
    return {
        depth: (_a = utilInspectOptions === null || utilInspectOptions === void 0 ? void 0 : utilInspectOptions.depth) !== null && _a !== void 0 ? _a : undefined,
        color: utilInspectOptions === null || utilInspectOptions === void 0 ? void 0 : utilInspectOptions.colors,
        breakLength: utilInspectOptions === null || utilInspectOptions === void 0 ? void 0 : utilInspectOptions.breakLength,
        showHidden: utilInspectOptions === null || utilInspectOptions === void 0 ? void 0 : utilInspectOptions.showHidden,
    };
}
exports.utilOptionsToIxOptions = utilOptionsToIxOptions;
function customInspectShim(value, options) {
    return (0, ixInspect_1.default)(value, utilOptionsToIxOptions(options));
}
exports.customInspectShim = customInspectShim;
//# sourceMappingURL=customInspectShim.js.map
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CircularRefIndexMap_map;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const assert_1 = __importDefault(require("./assert"));
const colors_1 = require("./colors");
class CircularRefIndexMap {
    constructor() {
        _CircularRefIndexMap_map.set(this, new Map());
    }
    add(value) {
        const index = __classPrivateFieldGet(this, _CircularRefIndexMap_map, "f").size + 1;
        __classPrivateFieldGet(this, _CircularRefIndexMap_map, "f").set(value, index);
        return index;
    }
    get(value) {
        const index = __classPrivateFieldGet(this, _CircularRefIndexMap_map, "f").get(value);
        (0, assert_1.default)(index, `Value didn't exist in CircularRefIndexMap when calling get`);
        return index;
    }
    has(value) {
        return __classPrivateFieldGet(this, _CircularRefIndexMap_map, "f").has(value);
    }
}
_CircularRefIndexMap_map = new WeakMap();
function createContext(options) {
    return {
        currentDepth: 0,
        maxDepth: options.depth,
        colorEnabled: options.color,
        breakLength: options.breakLength,
        indentation: typeof options.indentation === 'number' ? ' '.repeat(options.indentation) : options.indentation,
        showHidden: options.showHidden,
        totalIndentation: '',
        parentValues: [],
        circularRefIndexMap: new CircularRefIndexMap(),
        originalOptions: options,
        colorMap: options.color ? colors_1.colorMap : colors_1.noopMap
    };
}
exports.createContext = createContext;
//# sourceMappingURL=context.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("./assert"));
const ixInspect_1 = __importStar(require("./ixInspect"));
const util_1 = __importDefault(require("util"));
const node_inspect_extracted_1 = __importDefault(require("node-inspect-extracted"));
const chalk_1 = __importDefault(require("chalk"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const options = { showHidden: false, depth: 5, breakLength: 0, colors: true };
Object.assign(ixInspect_1.defaultOptions, options);
Object.assign(util_1.default.inspect.defaultOptions, options);
function makeWhitespaceVisible(string) {
    return chalk_1.default.whiteBright(string.replace(/ /g, chalk_1.default.gray('·')));
}
function assertValue(value, expectedResult) {
    const result = (0, ixInspect_1.default)(value);
    expectedResult = (0, strip_ansi_1.default)(expectedResult);
    (0, assert_1.default)((0, strip_ansi_1.default)(result) === expectedResult, `Expected: '${makeWhitespaceVisible(expectedResult)}'\nGot: '${makeWhitespaceVisible((0, strip_ansi_1.default)(result))}'`);
    console.log(result);
}
function tryValue(value) {
    console.log((0, ixInspect_1.default)(value));
}
console.log((0, ixInspect_1.default)(global, { depth: 5, breakLength: 0 }));
// Test Primitives
assertValue('Hello, world!', `'Hello, world!'`);
assertValue(5, '5');
assertValue(0, '0');
assertValue(-0, '-0');
assertValue(-5, '-5');
assertValue(NaN, 'NaN');
assertValue(Infinity, 'Infinity');
assertValue(BigInt(5), '5n');
assertValue(BigInt(0), '0n');
assertValue(BigInt(-0), '0n'); // 0 and -0 are the same for BigInt
assertValue(BigInt(-5), '-5n');
assertValue(true, 'true');
assertValue(false, 'false');
assertValue(Symbol.for('ix.inspect.test'), 'Symbol(ix.inspect.test)');
assertValue(undefined, 'undefined');
assertValue(null, 'null');
// Test non-Primitives
assertValue({ key: 'value' }, `{
  key: 'value'
}`);
assertValue({ key: 'value', nested: { foo: 'bar', baz: { hello: { world: '1' } } } }, `{
  key: 'value',
  nested: {
    foo: 'bar',
    baz: {
      hello: {
        world: '1'
      }
    }
  }
}`);
const circular = {};
circular.self = circular;
assertValue(circular, `<ref *1> {
  self: [Circular *1]
}`);
const deepCircular = { a: { b: { c: {} } } };
deepCircular.a.b.c.self = deepCircular;
assertValue(deepCircular, `<ref *1> {
  a: {
    b: {
      c: {
        self: [Circular *1]
      }
    }
  }
}`);
// Test custom inspect function
assertValue({ foo: { [Symbol.for('nodejs.util.inspect.custom')]: (depth) => { return 'Custom Return\nValue ' + depth; } } }, `{
  foo: Custom Return
  Value 4
}`);
function compareGlobal() {
    console.log(chalk_1.default.red('Util'));
    console.log(util_1.default.inspect(global, { showHidden: false, depth: 99, breakLength: 0 }));
    console.log(chalk_1.default.green('Extracted'));
    console.log(node_inspect_extracted_1.default.inspect(global));
    console.log(chalk_1.default.blue('Ours'));
    console.log((0, ixInspect_1.default)(global, { depth: 5, breakLength: 0 }));
}
compareGlobal();
const foo = { abc: 123 };
delete foo.constructor;
tryValue(foo);
let backref = { foo: 'aaa', oop: null };
let inner = { yeet: backref };
backref.oop = inner;
let bar = { abc: 123, inner: inner };
tryValue(bar);
console.log(util_1.default.inspect(bar, { showHidden: false, depth: 99, breakLength: 0 }));
let map = new Map();
map.set('foo', 'bar');
map.set([1, 2, 3], 5);
tryValue(map);
tryValue([5, 6, 7]);
//# sourceMappingURL=test.js.map
import assert from './assert';
import inspect, { defaultOptions } from './ixInspect';
import util from 'util';
import inspectExtracted from 'node-inspect-extracted';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

const options = { showHidden: false, depth: 5, breakLength: 0, colors: true };
Object.assign(defaultOptions as any, options);
Object.assign(util.inspect.defaultOptions, options);

function makeWhitespaceVisible(string: string) {
    return chalk.whiteBright(string.replace(/ /g, chalk.gray('·')));
}

function assertValue(value: unknown, expectedResult: string) {
    const result = inspect(value);
    expectedResult = stripAnsi(expectedResult);
    assert(stripAnsi(result) === expectedResult, `Expected: '${makeWhitespaceVisible(expectedResult)}'\nGot: '${makeWhitespaceVisible(stripAnsi(result))}'`);
    console.log(result);
}

function tryValue(value: unknown) {
    console.log(inspect(value));
}
console.log(inspect(global, { depth: 5, breakLength: 0 }));
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

const circular: any = {};
circular.self = circular;
assertValue(circular, `<ref *1> {
  self: [Circular *1]
}`);

const deepCircular: any = { a: { b: { c: {} } } };
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
assertValue({ foo: { [Symbol.for('nodejs.util.inspect.custom')]: (depth: number) => { return 'Custom Return\nValue ' + depth }} }, `{
  foo: Custom Return
  Value 4
}`);

function compareGlobal() {
    console.log(chalk.red('Util'))
    console.log(util.inspect(global, { showHidden: false, depth: 99, breakLength: 0 }));
    console.log(chalk.green('Extracted'));
    console.log(inspectExtracted.inspect(global));
    console.log(chalk.blue('Ours'));
    console.log(inspect(global, { depth: 5, breakLength: 0 }));
}

compareGlobal();

const foo = { abc: 123 };
delete (foo as any).constructor;
tryValue(foo);

let backref = { foo: 'aaa', oop: null };
let inner = { yeet: backref };
(backref.oop as any) = inner;
let bar = { abc: 123, inner: inner };
tryValue(bar);
console.log(util.inspect(bar, { showHidden: false, depth: 99, breakLength: 0 }));
let map = new Map();
map.set('foo', 'bar');
map.set([1, 2, 3], 5);
tryValue(map);
tryValue([5, 6, 7]);

console.log(inspect(global, { depth: 5, breakLength: 0 }));

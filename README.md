# ixInspect

ixInspect is a library designed for seamless object inspection in constrained environments, such as browsers or V8 isolates, offering similar functionality to Node.js's `util.inspect` but without relying on Node.js internals.

## Installation

You can install ixInspect via npm:

```bash
npm install ix-inspect
```

## Usage

### Basic Usage

```typescript
import inspect from 'ix-inspect';

const obj = { a: 1, b: 2, c: 3 };
const result = inspect(obj);
console.log(result);
/* Output:
{
  a: 1,
  b: 2,
  c: 3
}
*/
```

### Available Options

- `depth` (Type: `number`): Maximum depth for inspection (Default: `5`)
- `color` (Type: `boolean`): Enable color highlighting (Default: `true`)
- `breakLength` (Type: `number`): Maximum line length before breaking (Default: `80`)
- `indentation` (Type: `string | number`): Indentation string or number of spaces (Default: `2`)
- `showHidden` (Type: `boolean`): Show non-enumerable properties (Default: `false`)

## Advanced Example

```typescript
import inspect from 'ix-inspect';

const complexObj = {
    a: 1,
    b: 'hello',
    c: [1, 2, 3],
    d: { x: 10, y: 20, nested: { deep: 1 } },
    e: () => console.log('Function'),
};
const result = inspect(complexObj, {
    depth: 2,
    color: true,
    breakLength: 60,
    indentation: 4,
    showHidden: false
});
console.log(result);
/* Output:
{
    a: 1,
    b: 'hello',
    c: [ 1, 2, 3 ],
    d: { x: 10, y: 20, nested: [object Object] },
    e: [Function: e]
}
*/
```

## Why?

I needed a way to log/inspect values from inside a V8 isolate - I can not pass values to the outside world, and I can not use Node.js's `util.inspect` because it relies on Node.js internals.

The advantage of this library is more customizable output, while staying almost entirely compatible with anything that `util.inspect` can handle.

## Contributing

Feel free to open an issue or submit a pull request.

## License

This package is distributed under the ISC License.

---

<sub><sup>This README partially written by GPT 3.5</sup></sub>

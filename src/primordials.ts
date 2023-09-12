// @ts-nocheck
// back-patch in primordials in user-land

class SafeIterator {
  constructor(iterable: any) {
    (this as any)._iterator = factory(iterable);
  }
  next() {
    return next((this as any)._iterator);
  }
  [Symbol.iterator]() {
    return this;
  }
}

type SafeIterator<T> = {
    new(iterable: any): {
        _iterator: Iterator<T>,
        next: () => IteratorResult<T>,
        [Symbol.iterator]: () => SafeIterator<T>
    };
};
type FactoryFunction = <T>(iterable: Iterable<T>) => Iterator<T>;
type NextFunction = <T>(iterator: Iterator<T>) => IteratorResult<T>;
type SafeIteratorType = (factory: FactoryFunction, next: NextFunction) => SafeIterator<any>;
const createSafeIterator: SafeIteratorType = (factory, next) => {
  class SafeIterator {
    constructor(iterable: any) {
      (this as any)._iterator = factory(iterable);
    }
    next() {
      return next((this as any)._iterator);
    }
    [Symbol.iterator]() {
      return this;
    }
  }
  Object.setPrototypeOf(SafeIterator.prototype, null);
  Object.freeze(SafeIterator.prototype);
  Object.freeze(SafeIterator);
  return SafeIterator;
};

function getGetter(cls: Function, getter: string) {
  // TODO: __lookupGetter__ is deprecated, but Object.getOwnPropertyDescriptor
  // doesn't work on built-ins like Typed Arrays.
  return Function.prototype.call.bind(cls.prototype.__lookupGetter__(getter));
}

function getterCaller(getter: string) {
  return (val: Function) => {
    return val.constructor.prototype.__lookupGetter__(getter).call(val);
  };
}

function uncurryThis(func: Function) {
  return Function.prototype.call.bind(func);
}

const copyProps = (src: object, dest: object) => {
  Array.prototype.forEach.call(Reflect.ownKeys(src), (key) => {
    if (!Reflect.getOwnPropertyDescriptor(dest, key)) {
      Reflect.defineProperty(
        dest,
        key,
        Reflect.getOwnPropertyDescriptor(src, key) as PropertyDescriptor);
    }
  });
};

const makeSafe = (unsafe: any, safe: any) => {
  if (Symbol.iterator in unsafe.prototype) {
    const dummy = new unsafe();
    let next: Function; // We can reuse the same `next` method.

    Array.prototype.forEach.call(Reflect.ownKeys(unsafe.prototype), (key) => {
      if (!Reflect.getOwnPropertyDescriptor(safe.prototype, key)) {
        const desc = Reflect.getOwnPropertyDescriptor(unsafe.prototype, key) as PropertyDescriptor;
        if (
          typeof desc.value === 'function' &&
          desc.value.length === 0 &&
          Symbol.iterator in (
            Function.prototype.call.call(desc.value, dummy) || {})) {
          const createIterator = uncurryThis(desc.value);
          if (next == null) {
            next = uncurryThis(createIterator(dummy).next);
          }
          const SafeIterator = createSafeIterator(createIterator, next);
          desc.value = function() {
            return new SafeIterator(this);
          };
        }
        Reflect.defineProperty(safe.prototype, key, desc);
      }
    });
  } else {
    copyProps(unsafe.prototype, safe.prototype);
  }
  copyProps(unsafe, safe);

  Object.setPrototypeOf(safe.prototype, null);
  Object.freeze(safe.prototype);
  Object.freeze(safe);
  return safe;
};

const StringIterator =
  Function.prototype.call.bind(String.prototype[Symbol.iterator]);
const StringIteratorPrototype = Reflect.getPrototypeOf(StringIterator(''));

function ErrorCaptureStackTrace(targetObject: any) {
  const stack = new Error().stack ?? '';
  // Remove the second line, which is this function
  targetObject.stack = stack.replace(/.*\n.*/, '$1');
}

export default {
  makeSafe, // exported for testing
  internalBinding(mod: string) {
    if (mod === 'config') {
      return {
        hasIntl: false
      };
    }
    throw new Error(`unknown module: "${mod}"`);
  },
  Array,
  ArrayIsArray: Array.isArray,
  ArrayPrototypeFilter: Function.prototype.call.bind(Array.prototype.filter),
  ArrayPrototypeForEach: Function.prototype.call.bind(Array.prototype.forEach),
  ArrayPrototypeIncludes:
    Function.prototype.call.bind(Array.prototype.includes),
  ArrayPrototypeIndexOf: Function.prototype.call.bind(Array.prototype.indexOf),
  ArrayPrototypeJoin: Function.prototype.call.bind(Array.prototype.join),
  ArrayPrototypePop: Function.prototype.call.bind(Array.prototype.pop),
  ArrayPrototypePush: Function.prototype.call.bind(Array.prototype.push),
  ArrayPrototypePushApply: Function.apply.bind(Array.prototype.push),
  ArrayPrototypeSort: Function.prototype.call.bind(Array.prototype.sort),
  ArrayPrototypeSplice: Function.prototype.call.bind(Array.prototype.slice),
  ArrayPrototypeUnshift: Function.prototype.call.bind(Array.prototype.unshift),
  BigIntPrototypeValueOf:
    Function.prototype.call.bind(BigInt.prototype.valueOf),
  BooleanPrototypeValueOf:
    Function.prototype.call.bind(Boolean.prototype.valueOf),
  DatePrototypeGetTime: Function.prototype.call.bind(Date.prototype.getTime),
  DatePrototypeToISOString:
    Function.prototype.call.bind(Date.prototype.toISOString),
  DatePrototypeToString:
    Function.prototype.call.bind(Date.prototype.toString),
  ErrorCaptureStackTrace,
  ErrorPrototypeToString:
    Function.prototype.call.bind(Error.prototype.toString),
  FunctionPrototypeCall:
    Function.prototype.call.bind(Function.prototype.call),
  FunctionPrototypeToString:
    Function.prototype.call.bind(Function.prototype.toString),
  globalThis: (typeof globalThis === 'undefined') ? global : globalThis,
  JSONStringify: JSON.stringify,
  MapPrototypeGetSize: getGetter(Map, 'size'),
  MapPrototypeEntries: Function.prototype.call.bind(Map.prototype.entries),
  MathFloor: Math.floor,
  MathMax: Math.max,
  MathMin: Math.min,
  MathRound: Math.round,
  MathSqrt: Math.sqrt,
  MathTrunc: Math.trunc,
  Number,
  NumberIsFinite: Number.isFinite,
  NumberIsNaN: Number.isNaN,
  NumberParseFloat: Number.parseFloat,
  NumberParseInt: Number.parseInt,
  NumberPrototypeValueOf:
    Function.prototype.call.bind(Number.prototype.valueOf),
  Object,
  ObjectAssign: Object.assign,
  ObjectCreate: Object.create,
  ObjectDefineProperty: Object.defineProperty,
  ObjectGetOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
  ObjectGetOwnPropertyNames: Object.getOwnPropertyNames,
  ObjectGetOwnPropertySymbols: Object.getOwnPropertySymbols,
  ObjectGetPrototypeOf: Object.getPrototypeOf,
  ObjectIs: Object.is,
  ObjectKeys: Object.keys,
  ObjectPrototypeHasOwnProperty:
    Function.prototype.call.bind(Object.prototype.hasOwnProperty),
  ObjectPrototypePropertyIsEnumerable:
    Function.prototype.call.bind(Object.prototype.propertyIsEnumerable),
  ObjectSeal: Object.seal,
  ObjectSetPrototypeOf: Object.setPrototypeOf,
  ReflectApply: Reflect.apply,
  ReflectOwnKeys: Reflect.ownKeys,
  RegExp,
  RegExpPrototypeTest: Function.prototype.call.bind(RegExp.prototype.test),
  RegExpPrototypeToString:
    Function.prototype.call.bind(RegExp.prototype.toString),
  SafeStringIterator: createSafeIterator(
    StringIterator,
    Function.prototype.call.bind((StringIteratorPrototype as any).next)
  ),
  SafeMap: makeSafe(
    Map,
    class SafeMap extends Map {
      // @ts-ignore
      constructor(i: any) { super(i); } // eslint-disable-line no-useless-constructor
    }),
  SafeSet: makeSafe(
    Set,
    class SafeSet extends Set {
      constructor(i: any) { super(i); } // eslint-disable-line no-useless-constructor
    }),
  SetPrototypeGetSize: getGetter(Set, 'size'),
  SetPrototypeValues: Function.prototype.call.bind(Set.prototype.values),
  String,
  StringPrototypeCharCodeAt:
    Function.prototype.call.bind(String.prototype.charCodeAt),
  StringPrototypeCodePointAt:
    Function.prototype.call.bind(String.prototype.codePointAt),
  StringPrototypeEndsWith:
    Function.prototype.call.bind(String.prototype.endsWith),
  StringPrototypeIncludes:
    Function.prototype.call.bind(String.prototype.includes),
  StringPrototypeNormalize:
    Function.prototype.call.bind(String.prototype.normalize),
  StringPrototypePadEnd:
    Function.prototype.call.bind(String.prototype.padEnd),
  StringPrototypePadStart:
    Function.prototype.call.bind(String.prototype.padStart),
  StringPrototypeRepeat: Function.prototype.call.bind(String.prototype.repeat),
  StringPrototypeReplace:
    Function.prototype.call.bind(String.prototype.replace),
  StringPrototypeSlice: Function.prototype.call.bind(String.prototype.slice),
  StringPrototypeSplit: Function.prototype.call.bind(String.prototype.split),
  StringPrototypeToLowerCase:
    Function.prototype.call.bind(String.prototype.toLowerCase),
  StringPrototypeTrim: Function.prototype.call.bind(String.prototype.trim),
  StringPrototypeValueOf:
    Function.prototype.call.bind(String.prototype.valueOf),
  SymbolPrototypeToString:
    Function.prototype.call.bind(Symbol.prototype.toString),
  SymbolPrototypeValueOf:
    Function.prototype.call.bind(Symbol.prototype.valueOf),
  SymbolIterator: Symbol.iterator,
  SymbolFor: Symbol.for,
  SymbolToStringTag: Symbol.toStringTag,
  TypedArrayPrototypeGetLength: getterCaller('length'),
  Uint8Array,
  uncurryThis
};

import assert from '../assert';
import { IxInspectContext } from '../context';
import { ValueData, ValueDataNonPrim, ValueDataPrim } from '../valueData';

export type Primitive = string | number | bigint | boolean | symbol | undefined | null;
export type NonPrimitive = object | Function;

// Type for formatters in both the formatting files
export type PrimFormatter<T extends Primitive> = (value: T, vd: ValueDataPrim, ctx: IxInspectContext) => string;
export type NonPrimFormatter = (value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext) => string;
export type Formatter<T extends Primitive | NonPrimitive, U extends ValueData | ValueDataNonPrim> = (value: T, vd: U, ctx: IxInspectContext) => string

// Stings that relate to Primitives
export type PrimitiveTypeString = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'null';

export function isPrimitive(value: unknown): value is Primitive {
    return !isObject(value) && typeof value !== 'function';
}

export function isNonPrimitive(value: unknown): value is NonPrimitive {
    return !isPrimitive(value);
}

export function getPrimitiveTypeName(value: Primitive): PrimitiveTypeString {
    assert(isPrimitive(value), `value passed to getPrimitiveTypeName wasn't primitive`);
    
    if (value === null)
        return 'null';
    
    return typeof value as PrimitiveTypeString;
}

export function getNonPrimitiveTypeName(value: NonPrimitive) {
    assert(!isPrimitive(value), `value passed to getNonPrimitiveTypeName was primitive`);
    
    return getConstructorName(value);
}

function getConstructorName(value: NonPrimitive) {
    assert(isNonPrimitive(value), 'Primitive passed to getConstructorName');
    
    if (value?.constructor?.name)
        return value.constructor.name;
    
    const objectString = Object.prototype.toString.call(value);
    
    const match = objectString.match(/^\[object ([^\]]+)\]/);
    if (match && match[1])
        return match[1];
    
    return 'Object';
}

function isObject(value: unknown) {
    return typeof value === 'object' && value !== null;
}

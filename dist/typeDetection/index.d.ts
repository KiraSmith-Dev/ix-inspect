import { IxInspectContext } from '../context';
import { ValueData, ValueDataNonPrim, ValueDataPrim } from '../valueData';
export declare type Primitive = string | number | bigint | boolean | symbol | undefined | null;
export declare type NonPrimitive = object | Function;
export declare type PrimFormatter<T extends Primitive> = (value: T, vd: ValueDataPrim, ctx: IxInspectContext) => string;
export declare type NonPrimFormatter = (value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext) => string;
export declare type Formatter<T extends Primitive | NonPrimitive, U extends ValueData | ValueDataNonPrim> = (value: T, vd: U, ctx: IxInspectContext) => string;
export declare type PrimitiveTypeString = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'null';
export declare function isPrimitive(value: unknown): value is Primitive;
export declare function isNonPrimitive(value: unknown): value is NonPrimitive;
export declare function getPrimitiveTypeName(value: Primitive): PrimitiveTypeString;
export declare function getNonPrimitiveTypeName(value: NonPrimitive): string;
//# sourceMappingURL=index.d.ts.map
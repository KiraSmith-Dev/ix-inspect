import { IxInspectContext } from './context';
import { Formatter, NonPrimitive } from './typeDetection';
import { ValueDataNonPrim } from './valueData';
export declare const nonPrimitiveFormatMap: Map<string | symbol, string | Formatter<any, any>>;
export declare function nonPrimitiveFallbackFormatter(value: NonPrimitive, vd: ValueDataNonPrim, ctx: IxInspectContext): string;
//# sourceMappingURL=formatNonPrimitive.d.ts.map
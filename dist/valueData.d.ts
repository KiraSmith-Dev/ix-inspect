import { PrimitiveTypeString } from './typeDetection';
import { IxInspectContext } from './context';
export type ValueDataPrim = {
    typeName: PrimitiveTypeString;
    isPrim: true;
};
export type ValueDataNonPrim = {
    typeName: string;
    isPrim: false;
    toStringTagValue: string;
    getPrefix: (size?: string) => string;
};
export type ValueData = ValueDataPrim | ValueDataNonPrim;
export declare function createValueData(value: unknown, ctx: IxInspectContext): ValueData;
//# sourceMappingURL=valueData.d.ts.map
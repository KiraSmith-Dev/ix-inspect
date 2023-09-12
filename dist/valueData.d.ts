import { PrimitiveTypeString } from './typeDetection';
import { IxInspectContext } from './context';
export declare type ValueDataPrim = {
    typeName: PrimitiveTypeString;
    isPrim: true;
};
export declare type ValueDataNonPrim = {
    typeName: string;
    isPrim: false;
    toStringTagValue: string;
    getPrefix: (size?: string) => string;
};
export declare type ValueData = ValueDataPrim | ValueDataNonPrim;
export declare function createValueData(value: unknown, ctx: IxInspectContext): ValueData;
//# sourceMappingURL=valueData.d.ts.map
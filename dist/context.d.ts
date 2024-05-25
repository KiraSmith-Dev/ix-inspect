import { IColorMap } from './colors';
import { IxInspectOptions } from './options';
export interface IxInspectContext {
    currentDepth: number;
    maxDepth: number;
    colorEnabled: boolean;
    breakLength: number;
    indentation: string;
    showHidden: boolean;
    totalIndentation: string;
    parentValues: unknown[];
    circularRefIndexMap: CircularRefIndexMap;
    originalOptions: IxInspectOptions;
    colorMap: IColorMap;
}
declare class CircularRefIndexMap {
    #private;
    add(value: unknown): number;
    get(value: unknown): number;
    has(value: unknown): boolean;
}
export declare function createContext(options: IxInspectOptions): IxInspectContext;
export {};
//# sourceMappingURL=context.d.ts.map
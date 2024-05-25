declare type ColorApplicator = (text: string) => string;
export interface IColorMap {
    ref: ColorApplicator;
    circular: ColorApplicator;
    key: ColorApplicator;
    function: ColorApplicator;
    colon: ColorApplicator;
    bracket: ColorApplicator;
    string: ColorApplicator;
    number: ColorApplicator;
    bigint: ColorApplicator;
    boolean: ColorApplicator;
    symbol: ColorApplicator;
    undefined: ColorApplicator;
    null: ColorApplicator;
    arrow: ColorApplicator;
    objectfallback: ColorApplicator;
    default: ColorApplicator;
}
export declare const colorMap: IColorMap;
export declare const noopMap: IColorMap;
export {};
//# sourceMappingURL=colors.d.ts.map
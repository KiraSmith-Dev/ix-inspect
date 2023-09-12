import { getNonPrimitiveTypeName, getPrimitiveTypeName, isPrimitive, NonPrimitive, Primitive, PrimitiveTypeString } from './typeDetection';
import { IxInspectContext } from './context';
import primordials from './primordials'

const { 
    SymbolToStringTag,
    ObjectPrototypeHasOwnProperty,
    ObjectPrototypePropertyIsEnumerable
} = primordials;

export type ValueDataPrim = {
    typeName: PrimitiveTypeString,
    isPrim: true
};

export type ValueDataNonPrim = {
    typeName: string,
    isPrim: false,
    toStringTagValue: string,
    getPrefix: (size?: string) => string
};

/*
export type ValueDataPrimT = {
    isPrim: true,
} & ValueDataCommon

export type ValueDataNonPrimT = {
    isPrim: false,
    toStringTagValue: string
} & ValueDataCommon
*/

export type ValueData = ValueDataPrim | ValueDataNonPrim;

export function createValueData(value: unknown, ctx: IxInspectContext): ValueData {
    const isPrim = isPrimitive(value);
    const typeName = isPrim ? getPrimitiveTypeName(value) : getNonPrimitiveTypeName(value as NonPrimitive);
    
    let toStringTagValue: unknown = value ? (value as any)[SymbolToStringTag] : '';
    if (typeof toStringTagValue !== 'string' || (toStringTagValue !== '' && (ctx.showHidden ? ObjectPrototypeHasOwnProperty : ObjectPrototypePropertyIsEnumerable)(value, SymbolToStringTag)))
        toStringTagValue = '';
    
    function getPrefix(size = '') {
        if (typeName === null) {
            if (toStringTagValue !== '' && typeName !== toStringTagValue)
                return `[${typeName}${size}: null prototype] [${toStringTagValue}] `;
            
            return `[${typeName}${size}: null prototype] `;
        }
        
        if (toStringTagValue !== '' && typeName !== toStringTagValue)
            return `${typeName}${size} [${toStringTagValue}] `;
        
        if (typeName === 'Object' && !size.length)
            return '';
        
        return `${typeName}${size} `;
    }
    
    return {
        isPrim: isPrim,
        typeName: typeName as any, // Typescript doesn't understand that 'isPrim' determines if this type is PrimitiveTypeString or string
        toStringTagValue: toStringTagValue as string, // And again, all code paths assign string but typescript doesn't understand
        getPrefix
    }
}

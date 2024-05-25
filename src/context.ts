import assert from './assert';
import { IColorMap, colorMap, noopMap } from './colors';
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

class CircularRefIndexMap {
    #map = new Map<unknown, number>();
    
    add(value: unknown): number {
        const index = this.#map.size + 1;
        this.#map.set(value, index)
        return index; 
    }
    
    get(value: unknown): number {
        const index = this.#map.get(value)
        
        assert(index, `Value didn't exist in CircularRefIndexMap when calling get`);
        
        return index;
    }
    
    has(value: unknown) {
        return this.#map.has(value);
    }
}

export function createContext(options: IxInspectOptions): IxInspectContext {
    return {
        currentDepth: 0,
        maxDepth: options.depth,
        colorEnabled: options.color,
        breakLength: options.breakLength,
        indentation: typeof options.indentation === 'number' ? ' '.repeat(options.indentation) : options.indentation,
        showHidden: options.showHidden,
        totalIndentation: '',
        parentValues: [],
        circularRefIndexMap: new CircularRefIndexMap(),
        originalOptions: options,
        colorMap: options.color ? colorMap : noopMap
    }
}

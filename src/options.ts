// Most of this could be handled by a validation library, but I didn't think this little bit of validation warranted a dependency

export interface IxInspectOptions {
    depth: number;
    color: boolean;
    breakLength: number;
    indentation: string | number;
    showHidden: boolean;
};

const inspectOptionsTypeMap: { [Property in keyof IxInspectOptions]: string[]; } = {
    depth: ['number'],
    color: ['boolean'],
    breakLength: ['number'],
    indentation: ['string', 'number'],
    showHidden: ['boolean']
};

// Unknown since a consumer could change it to anything
export const defaultOptions: unknown = {
    depth: 5,
    color: true,
    breakLength: 80,
    indentation: 2,
    showHidden: false
};

function verifyOptionsType(options: unknown, message: string): asserts options is object {
    if (typeof options !== 'object' || options === null)
        throw new TypeError(message);
}

function applyDefaults(partialOptions: unknown): Partial<IxInspectOptions> {
    verifyOptionsType(partialOptions, 'Type of inspect options must be object');
    verifyOptionsType(defaultOptions, 'Type of inspect defaultOptions must be object');
    
    return Object.assign(defaultOptions, partialOptions);
}

function validateOptionKeys(maybeValidOptions: Partial<IxInspectOptions>): asserts maybeValidOptions is IxInspectOptions {
    for (const [key, expectedTypes] of Object.entries(inspectOptionsTypeMap)) {
        if (!(key in maybeValidOptions))
            throw new TypeError(`Inspect option '${key}' must exist. Did you remove it from the defaultOptions?`);
        
        if (!expectedTypes.includes(typeof maybeValidOptions[key as keyof IxInspectOptions]))
            throw new TypeError(`Type of inspect option '${key}' (of type ${typeof maybeValidOptions[key as keyof IxInspectOptions]}) must be of type (${expectedTypes.join(' | ')})`);
    }
}

export function validateOptions(suppliedOptions: unknown): IxInspectOptions {
    const maybeValidOptions = applyDefaults(suppliedOptions);
    validateOptionKeys(maybeValidOptions)
    return maybeValidOptions;
}

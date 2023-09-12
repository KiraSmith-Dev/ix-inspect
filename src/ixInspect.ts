import { IxInspectOptions, validateOptions } from './options';
import inspectValue from './inspectValue';
import { createContext } from './context';

export { defaultOptions } from './options';

/* 
    Simple entry point. If you want to see the logic, you're looking for:
    ./formatPrimitive.ts - formatting for basic values (null or not typeof object/function)
    ./formatNonPrimitive.ts - formatting for more complex values (non-null and typeof object/function)
*/

function inspect(value: unknown, options?: Partial<IxInspectOptions>): string {
    const validOptions = validateOptions(options ?? {});
    return inspectValue(value, createContext(validOptions));
}

export default inspect;

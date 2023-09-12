import primordials from '../primordials';
import { ValueData, ValueDataNonPrim } from '../valueData';

const { 
    ObjectGetPrototypeOf,
    ObjectPrototypeHasOwnProperty,
    FunctionPrototypeToString,
    
} = primordials;

const stripCommentsRegExp = /(\/\/.*?\n)|(\/\*(.|\n)*?\*\/)/g;
const classRegExp = /^(\s+[^(]*?)\s*{/;

function getClassBase(vd: ValueDataNonPrim) {
    const hasName = ObjectPrototypeHasOwnProperty(vd, 'name');
    const name = (hasName && (vd as any).name) || '(anonymous)';
    const base = `class ${name}`;
    
    const maybeConstructorTag = (vd.typeName !== 'Function' && vd.typeName !== null) ? ` [${vd.typeName}]` : '';
    const maybeTag = (vd.toStringTagValue !== '' && vd.typeName !== vd.toStringTagValue) ? ` [${vd.toStringTagValue}]` : '';
    
    const extendsTag = `extends ${vd.typeName !== null ? ObjectGetPrototypeOf(vd).name ?? '' : '[null prototype]'}`
    
    return `[${base}${maybeConstructorTag}${maybeTag}${extendsTag}]`;
}

function isGeneratorFunction(value: unknown) {
    return (typeof value === 'function') && Function.prototype.toString.call(value).match(/^(async\s+)?function *\*/);
}

function isAsyncFunction(value: unknown) {
    return (typeof value === 'function') && Function.prototype.toString.call(value).startsWith('async');
}

export default function getFunctionPrefix(value: unknown, vd: ValueDataNonPrim) {
    const stringified = FunctionPrototypeToString(value);
    if (stringified.startsWith('class') && stringified.endsWith('}')) {
        const slice = stringified.slice(5, -1);
        const bracketIndex = slice.indexOf('{');
        if (bracketIndex !== -1 && (!slice.slice(0, bracketIndex).includes('(') || classRegExp.test(slice.replace(stripCommentsRegExp, ''))))
            return getClassBase(vd);
    }
    
    const type = `${isAsyncFunction(value) ? `Async` : isGeneratorFunction(value) ? `Generator` : ''}Function`;
    const maybeNullProtoTag = (vd.typeName === null) ? ' (null prototype)' : '';
    const functionNameTag = ((value as Function).name === '') ? ' (anonymous)' : `: ${(value as Function).name}`;
    const maybeTypeNameTag = (vd.typeName !== type && vd.typeName !== null) ? ` ${vd.typeName}` : '';
    const maybeToStringTagValue = (vd.toStringTagValue !== '' && vd.typeName !== vd.toStringTagValue) ? ` [${vd.toStringTagValue}]` : '';
    
    return `[${type}${maybeNullProtoTag}${functionNameTag}]${maybeTypeNameTag}${maybeToStringTagValue}`;
}

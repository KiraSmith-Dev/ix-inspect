import chalk from 'chalk';

type ColorApplicator = (text: string) => string;

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
};

const colors = {
    red: chalk.hex('#E71D36'),
    purple: chalk.hex('#9B5DE5'),
    yellow: chalk.hex('#FEE440'),
    cyan: chalk.hex('#52dedc'),
    green: chalk.hex('#00F5D4'),
    orange: chalk.hex('#FC5130'),
    pink: chalk.hex('#E365C1'),
    white: chalk.hex('#FCFFFD'),
    grey: chalk.hex('#5D5E60')
};

export const colorMap: IColorMap = {
    ref: (text: string) => {
        return colors.red(text);
    },
    circular: (text: string) => {
        return colors.red(text);
    },
    key: (text: string) => {
        return colors.white(text);
    },
    function: (text: string) => {
        return colors.cyan(text);
    },
    colon: (text: string) => {
        return colors.white(text);
    },
    bracket: (text: string) => {
        return colors.pink(text);
    },
    string: (text: string) => {
        return colors.green(text);
    },
    number: (text: string) => {
        return colors.orange(text);
    },
    bigint: (text: string) => {
        return colors.orange(text);
    },
    boolean: (text: string) => {
        return colors.purple(text);
    },
    symbol: (text: string) => {
        return colors.green(text);
    },
    undefined: (text: string) => {
        return colors.grey(text);
    },
    null: (text: string) => {
        return colors.white(text);
    },
    arrow: (text: string) => {
        return colors.white(text);
    },
    objectfallback: (text: string) => {
        return colors.cyan(text);
    },
    default: (text: string) => {
        return colors.white(text);
    }
};

function _passthrough(text: string): string {
    return text;
}

export const noopMap: IColorMap = {
    ref: _passthrough,
    circular: _passthrough,
    key: _passthrough,
    function: _passthrough,
    colon: _passthrough,
    bracket: _passthrough,
    string: _passthrough,
    number: _passthrough,
    bigint: _passthrough,
    boolean: _passthrough,
    symbol: _passthrough,
    undefined: _passthrough,
    null: _passthrough,
    arrow: _passthrough,
    objectfallback: _passthrough,
    default: _passthrough
};

import chalk from 'chalk';

const colors = {
    red: chalk.hex('#E71D36'),
    purple: chalk.hex('#9B5DE5'),
    yellow: chalk.hex('#FEE440'),
    cyan: chalk.hex('#FEE440'),
    green: chalk.hex('#00F5D4'),
    orange: chalk.hex('#FC5130'),
    pink: chalk.hex('#E365C1'),
    white: chalk.hex('#FCFFFD'),
    grey: chalk.hex('#5D5E60')
}

export default {
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const colors = {
    red: chalk_1.default.hex('#E71D36'),
    purple: chalk_1.default.hex('#9B5DE5'),
    yellow: chalk_1.default.hex('#FEE440'),
    cyan: chalk_1.default.hex('#FEE440'),
    green: chalk_1.default.hex('#00F5D4'),
    orange: chalk_1.default.hex('#FC5130'),
    pink: chalk_1.default.hex('#E365C1'),
    white: chalk_1.default.hex('#FCFFFD'),
    grey: chalk_1.default.hex('#5D5E60')
};
exports.default = {
    ref: (text) => {
        return colors.red(text);
    },
    circular: (text) => {
        return colors.red(text);
    },
    key: (text) => {
        return colors.white(text);
    },
    function: (text) => {
        return colors.cyan(text);
    },
    colon: (text) => {
        return colors.white(text);
    },
    bracket: (text) => {
        return colors.pink(text);
    },
    string: (text) => {
        return colors.green(text);
    },
    number: (text) => {
        return colors.orange(text);
    },
    bigint: (text) => {
        return colors.orange(text);
    },
    boolean: (text) => {
        return colors.purple(text);
    },
    symbol: (text) => {
        return colors.green(text);
    },
    undefined: (text) => {
        return colors.grey(text);
    },
    null: (text) => {
        return colors.white(text);
    },
    arrow: (text) => {
        return colors.white(text);
    },
    objectfallback: (text) => {
        return colors.cyan(text);
    },
    default: (text) => {
        return colors.white(text);
    }
};
//# sourceMappingURL=colors.js.map
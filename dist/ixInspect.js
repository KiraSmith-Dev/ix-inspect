"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
const options_1 = require("./options");
const inspectValue_1 = __importDefault(require("./inspectValue"));
const context_1 = require("./context");
var options_2 = require("./options");
Object.defineProperty(exports, "defaultOptions", { enumerable: true, get: function () { return options_2.defaultOptions; } });
/*
    Simple entry point. If you want to see the logic, you're looking for:
    ./formatPrimitive.ts - formatting for basic values (null or not typeof object/function)
    ./formatNonPrimitive.ts - formatting for more complex values (non-null and typeof object/function)
*/
function inspect(value, options) {
    const validOptions = (0, options_1.validateOptions)(options !== null && options !== void 0 ? options : {});
    return (0, inspectValue_1.default)(value, (0, context_1.createContext)(validOptions));
}
exports.default = inspect;
//# sourceMappingURL=ixInspect.js.map
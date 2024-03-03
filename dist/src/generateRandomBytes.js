"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const logger_1 = __importDefault(require("./logger"));
function generate({ numberOfBytes }) {
    try {
        const buffer = (0, node_crypto_1.randomBytes)(numberOfBytes).toString("ascii");
        return { error: null, data: buffer };
    }
    catch (error) {
        logger_1.default.error(error);
        return { error: JSON.stringify(error), data: null };
    }
}
exports.default = generate;

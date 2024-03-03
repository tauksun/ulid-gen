"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ulid = void 0;
const src_1 = require("./src");
/**
 * @description Generates ULID in formats :
 * "base32" | "base64" | "Crockford" | "uuid"
 */
const ulid = (options) => {
    const { error, ulid } = (0, src_1.generateULID)({ encode: options === null || options === void 0 ? void 0 : options.encode });
    if (error) {
        throw error;
    }
    return ulid;
};
exports.ulid = ulid;

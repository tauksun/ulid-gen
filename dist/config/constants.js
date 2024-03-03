"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CROCKFORD_ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const HEXADECIMAL_ENCODING = "0123456789ABCDEF";
const BASE32_ENCODING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE64_ENCODING = "ABCDEFGHJKMNPQRSTVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const constants = {
    CROCKFORD_ENCODING,
    HEXADECIMAL_ENCODING,
    BASE32_ENCODING,
    BASE64_ENCODING,
};
exports.default = constants;
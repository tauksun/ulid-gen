"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function encoder({ num, base, encoding, }) {
    let encoded = "";
    while (num > 0) {
        let remainder = num % base;
        num = Math.floor(num / base);
        encoded = encoding.charAt(remainder) + encoded;
    }
    return encoded;
}
exports.default = encoder;

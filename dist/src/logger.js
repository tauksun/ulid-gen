"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepend = "ULID-GEN : ";
function log(...data) {
    console.log(...data);
}
log.error = (...data) => {
    log(prepend, "ERROR : ", ...data);
};
log.info = (...data) => {
    log(prepend, "INFO : ", ...data);
};
exports.default = log;

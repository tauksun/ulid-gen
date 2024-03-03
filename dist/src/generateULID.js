"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const encode_1 = __importDefault(require("./encode"));
const generateRandomBytes_1 = __importDefault(require("./generateRandomBytes"));
const generateTimestamp_1 = __importDefault(require("./generateTimestamp"));
const logger_1 = __importDefault(require("./logger"));
function generateULID({ encode }) {
    try {
        // Default encode fallback : Crockford
        if (!encode) {
            encode = "Crockford";
        }
        // Timestamp
        const timestamp = (0, generateTimestamp_1.default)();
        // Random Bytes
        const { error: randomByteGenerationError, data: randomBytes } = (0, generateRandomBytes_1.default)({
            numberOfBytes: 16,
        });
        if (randomByteGenerationError || !randomBytes) {
            logger_1.default.error(`Error occured while generating random bytes.`);
            throw randomByteGenerationError;
        }
        let base = null;
        let encoding = "";
        switch (encode) {
            case "base32":
                base = 32;
                encoding = config_1.default.BASE32_ENCODING;
                break;
            case "base64":
                base = 64;
                encoding = config_1.default.BASE64_ENCODING;
                break;
            case "Crockford":
                base = 32;
                encoding = config_1.default.CROCKFORD_ENCODING;
                break;
            case "uuid":
                base = 16;
                encoding = config_1.default.HEXADECIMAL_ENCODING;
                break;
        }
        // Convert & Encode timestamp, random bytes accroding to base
        //>> Timestamp Conversion
        let encodedTimestamp = (0, encode_1.default)({ num: timestamp, base, encoding });
        //>> Pad remaining intial bytes with zeroes
        //>> there will be more empty bytes with large base values
        for (let i = encodedTimestamp.length; i < 10; i++) {
            encodedTimestamp = "0" + encodedTimestamp;
        }
        //>> Random Bytes Conversion
        let encodedRandomBytes = "";
        const randomBytesBuffer = Buffer.from(randomBytes);
        const randomByteLength = randomBytesBuffer.length;
        for (let i = 0; i < randomByteLength; i++) {
            const byte = Math.abs(randomBytesBuffer.readInt8(i));
            encodedRandomBytes =
                encodedRandomBytes + (0, encode_1.default)({ num: byte, base, encoding });
        }
        // Generate ULID
        let ulid = encodedTimestamp.slice(0, 10) + encodedRandomBytes.slice(0, 16);
        // In case of UUID format because of hexadecimal use
        // & adhering to 48bits of timestamp & 80 bits of randomness ULID spec
        // there is loss of millisecond precision upon conversion
        // because Unix Timestamp when converted & encoded to base16 occupies more bytes
        // this is not an issue while generating ULIDs
        // though if generated ULID in UUID format is converted back to extract
        // time, there is millisecond information loss
        if (encode === "uuid") {
            let firstBytes = encodedTimestamp.slice(0, 8);
            let secondBytes = encodedTimestamp.slice(8, 10) + encodedRandomBytes.slice(0, 2);
            let thirdBytes = encodedRandomBytes.slice(2, 6);
            let fourthBytes = encodedRandomBytes.slice(6, 10);
            let fifthBytes = encodedRandomBytes.slice(10, 22);
            ulid =
                firstBytes +
                    "-" +
                    secondBytes +
                    "-" +
                    thirdBytes +
                    "-" +
                    fourthBytes +
                    "-" +
                    fifthBytes;
        }
        return {
            error: null,
            ulid,
        };
    }
    catch (error) {
        logger_1.default.error(error);
        return { error: JSON.stringify(error), ulid: null };
    }
}
exports.default = generateULID;

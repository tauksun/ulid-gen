import constants from "../config";
import { ENCODING } from "../interfaces";
import encoder from "./encode";
import generateRandomBytes from "./generateRandomBytes";
import generateTimestamp from "./generateTimestamp";
import log from "./logger";
import monotonicIncrease from "./monotonicIncrease";

// Monotonic
let previousTimestamp: number | null = null;
let previousCombined = "";
let previousEncoding = "";
let previousEncode = "";
let monotonicIteration = false;

function generateULID({
  encode,
  monotonic,
}: {
  encode?: ENCODING;
  monotonic?: Boolean;
}): {
  error: string | null;
  ulid: string | null;
} {
  try {
    // Default encode fallback : Crockford
    if (!encode) {
      encode = "Crockford";
    }

    // Default monotonic
    if (monotonic === undefined) {
      monotonic = false;
    }

    // Timestamp
    const timestamp = generateTimestamp();

    // Encoded string with timestamp & random bytes
    let base = 32; // Default to Crockford base 32
    let encoding = "";
    let combined = "";

    // Monotonic increment in the same millisecond
    if (
      monotonic &&
      timestamp === previousTimestamp &&
      encode === previousEncode
    ) {
      combined = previousCombined;
      monotonicIteration = true;
    } else {
      // Random Bytes
      const { error: randomByteGenerationError, data: randomBytes } =
        generateRandomBytes({
          numberOfBytes: 16,
        });

      if (randomByteGenerationError || !randomBytes) {
        log.error(`Error occured while generating random bytes.`);
        throw randomByteGenerationError;
      }

      switch (encode) {
        case "base32":
          base = 32;
          encoding = constants.BASE32_ENCODING;
          break;
        case "base64":
          base = 64;
          encoding = constants.BASE64_ENCODING;
          break;
        case "Crockford":
          base = 32;
          encoding = constants.CROCKFORD_ENCODING;
          break;
        case "uuid":
          base = 16;
          encoding = constants.HEXADECIMAL_ENCODING;
          break;
      }

      // Convert & Encode timestamp, random bytes accroding to base
      //>> Timestamp Conversion
      let encodedTimestamp = encoder({ num: timestamp, base, encoding });
      //>> Pad remaining intial bytes with zeroes
      //>> there will be more empty bytes with large base values
      for (let i = encodedTimestamp.length; i < 10; i++) {
        encodedTimestamp = "0" + encodedTimestamp;
      }
      encodedTimestamp = encodedTimestamp.slice(0, 10);

      //>> Random Bytes Conversion
      let encodedRandomBytes = "";
      const randomBytesBuffer = Buffer.from(randomBytes);
      const randomByteLength = randomBytesBuffer.length;
      for (let i = 0; i < randomByteLength; i++) {
        const byte = Math.abs(randomBytesBuffer.readInt8(i));
        encodedRandomBytes =
          encodedRandomBytes + encoder({ num: byte, base, encoding });
      }

      combined = encodedTimestamp + encodedRandomBytes;
      monotonicIteration = false;

      // Store for monotonicity check on next iteration
      previousTimestamp = timestamp;
      previousEncode = encode;
      previousEncoding = encoding;
    }

    // Generate ULID

    let ulid = null;

    // In case of UUID format because of hexadecimal use
    // & adhering to 48bits of timestamp & 80 bits of randomness ULID spec
    // there is loss of millisecond precision upon conversion
    // because Unix Timestamp when converted & encoded to base16 occupies more bytes
    // this is not an issue while generating ULIDs
    // though if generated ULID in UUID format is converted back to extract
    // time, there is millisecond information loss
    if (encode === "uuid") {
      combined = combined.slice(0, 32);
      if (monotonicIteration) {
        combined = monotonicIncrease({
          str: combined,
          base,
          encoding: previousEncoding,
        });
        combined = combined.slice(0, 32);
      }
      previousCombined = combined;

      ulid =
        combined.slice(0, 8) +
        "-" +
        combined.slice(8, 12) +
        "-" +
        combined.slice(12, 16) +
        "-" +
        combined.slice(16, 20) +
        "-" +
        combined.slice(20, 32);
    } else {
      combined = combined.slice(0, 26);
      if (monotonicIteration) {
        combined = monotonicIncrease({
          str: combined,
          base,
          encoding: previousEncoding,
        });
        combined = combined.slice(0, 26);
      }
      previousCombined = combined;
      ulid = combined;
    }

    return {
      error: null,
      ulid,
    };
  } catch (error) {
    log.error(error);
    return { error: JSON.stringify(error), ulid: null };
  }
}

export default generateULID;

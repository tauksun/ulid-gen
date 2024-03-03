import constants from "../config";
import { ENCODING } from "../interfaces";
import encoder from "./encode";
import generateRandomBytes from "./generateRandomBytes";
import generateTimestamp from "./generateTimestamp";
import log from "./logger";

function generateULID({ encode }: { encode: ENCODING }): {
  error: string | null;
  ulid: string | null;
} {
  try {
    // Timestamp
    const timestamp = generateTimestamp();

    // Random Bytes
    const { error: randomByteGenerationError, data: randomBytes } =
      generateRandomBytes({
        numberOfBytes: 16,
      });

    if (randomByteGenerationError || !randomBytes) {
      log.error(`Error occured while generating random bytes.`);
      throw randomByteGenerationError;
    }

    let base: number | null = null;
    let encoding = "";
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

    //>> Random Bytes Conversion
    let encodedRandomBytes = "";
    const randomBytesBuffer = Buffer.from(randomBytes);
    const randomByteLength = randomBytesBuffer.length;
    for (let i = 0; i < randomByteLength; i++) {
      const byte = Math.abs(randomBytes.readInt8(i));
      encodedRandomBytes =
        encodedRandomBytes + encoder({ num: byte, base, encoding });
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
      let secondBytes =
        encodedTimestamp.slice(8, 10) + encodedRandomBytes.slice(0, 2);
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
  } catch (error) {
    log.error(error);
    return { error: JSON.stringify(error), ulid: null };
  }
}

export default generateULID;

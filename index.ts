import { ENCODING } from "./interfaces";
import { generateULID } from "./src";

/**
 * @description Generates ULID in formats :
 * "base32" | "base64" | "Crockford" | "uuid"
 */
const ulid = ({ encode }: { encode: ENCODING }) => {
  const { error, ulid } = generateULID({ encode });
  if (error) {
    throw error;
  }
  return ulid;
};

export default ulid;

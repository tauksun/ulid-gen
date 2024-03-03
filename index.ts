import { ENCODING } from "./interfaces";
import { generateULID } from "./src";

/**
 * @description Generates ULID in formats :
 * "base32" | "base64" | "Crockford" | "uuid"
 */
export const ulid = (options: { encode?: ENCODING }) => {
  const { error, ulid } = generateULID({ encode: options?.encode });
  if (error) {
    throw error;
  }
  return ulid;
};

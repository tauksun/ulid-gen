import { randomBytes } from "node:crypto";
import log from "./logger";

function generate({ numberOfBytes }: { numberOfBytes: number }): {
  error: string | null;
  data: string | null;
} {
  try {
    const buffer = randomBytes(numberOfBytes).toString("ascii");
    return { error: null, data: buffer };
  } catch (error) {
    log.error(error);
    return { error: JSON.stringify(error), data: null };
  }
}

export default generate;

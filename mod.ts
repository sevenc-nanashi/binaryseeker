export * from "./reader.ts";
export * from "./writer.ts";

import { BinaryReader } from "./reader.ts";

/** @deprecated Alias of BinaryReader */
export const BinarySeeker = BinaryReader;

/** @deprecated Alias of BinaryReader */
export default BinarySeeker;

export * from "./reader.ts";
export * from "./writer.ts";

import { BinaryReader } from "./reader.ts";

/**
 * Alias of BinaryReader, for compatibility with the old name.
 * @deprecated Use BinaryReader instead.
 */
export const BinarySeeker = BinaryReader;
export type BinarySeeker = BinaryReader;

export default BinarySeeker;

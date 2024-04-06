/**
 * Simple cursor-based binary reader.
 * @module
 */

/**
 * Simple cursor-based binary reader.
 */
export class BinarySeeker {
  private data: DataView;
  public cursor: number;

  /**
   * Create a new BinarySeeker instance.
   * @param data - The ArrayBuffer to read from.
   * @returns A new BinarySeeker instance.
   */
  constructor(data: ArrayBuffer) {
    this.data = new DataView(data);
    this.cursor = 0;
  }

  /**
   * Seek to a specific offset in the buffer.
   * @param offset - The offset to seek to.
   */
  seek(offset: number): void {
    this.cursor = offset;
  }

  /**
   * Read a single byte from the buffer.
   * @returns The byte read.
   */
  readUInt8(): number {
    const value = this.data.getUint8(this.cursor);
    this.cursor += 1;
    return value;
  }

  /**
   * Read a single signed byte from the buffer.
   * @returns The byte read.
   */
  readInt8(): number {
    const value = this.data.getInt8(this.cursor);
    this.cursor += 1;
    return value;
  }

  /**
   * Read a number from the buffer.
   * Note: In most cases, you should use the `readTypeEndian` method instead.
   *
   * @param type - The type of number to read.
   * @param endian - The endianness to read the number in.
   * @returns The number read.
   */
  read(
    type: "u32" | "u16" | "i32" | "i16" | "f32" | "f64",
    endian: "le" | "be" = "le",
  ): number {
    switch (type) {
      case "u32":
        return endian === "le" ? this.readUInt32LE() : this.readUInt32BE();
      case "u16":
        return endian === "le" ? this.readUInt16LE() : this.readUInt16BE();
      case "i32":
        return endian === "le" ? this.readInt32LE() : this.readInt32BE();
      case "i16":
        return endian === "le" ? this.readInt16LE() : this.readInt16BE();
      case "f32":
        return this.readFloat32();
      case "f64":
        return this.readFloat64();
    }
  }

  /**
   * Read unsigned 64-bit integer (u64) from the buffer.
   * @returns The number read.
   */
  readUInt64LE(): bigint {
    const low = this.readUInt32LE();
    const high = this.readUInt32LE();
    return BigInt(high) << 32n | BigInt(low);
  }

  /**
   * Read unsigned 32-bit integer (u32) from the buffer.
   * @returns The number read.
   */
  readUInt32LE(): number {
    const value = this.data.getUint32(this.cursor, true);
    this.cursor += 4;
    return value;
  }

  /**
   * Read unsigned 16-bit integer (u16) from the buffer.
   * @returns The number read.
   */
  readUInt16LE(): number {
    const value = this.data.getUint16(this.cursor, true);
    this.cursor += 2;
    return value;
  }

  /**
   * Read signed 64-bit integer (i64) from the buffer.
   * @returns The number read.
   */
  readInt64LE(): bigint {
    const low = this.readUInt32LE();
    const high = this.readUInt32LE();
    const value = BigInt(high) << 32n | BigInt(low);
    if (value > 0x7fffffffffffffffn) {
      return value - 0x10000000000000000n;
    }
    return value;
  }

  /**
   * Read signed 32-bit integer (i32) from the buffer.
   * @returns The number read.
   */
  readInt32LE(): number {
    const value = this.data.getInt32(this.cursor, true);
    this.cursor += 4;
    return value;
  }

  /**
   * Read signed 16-bit integer from the buffer.
   * @returns The number read.
   */
  readInt16LE(): number {
    const value = this.data.getInt16(this.cursor, true);
    this.cursor += 2;
    return value;
  }

  /**
   * Read unsigned 64-bit integer (u64) from the buffer.
   * @returns The number read.
   */
  readUInt64BE(): bigint {
    const high = this.readUInt32BE();
    const low = this.readUInt32BE();
    return BigInt(high) << 32n | BigInt(low);
  }
  /**
   * Read unsigned 32-bit integer (u32) from the buffer.
   * @returns The number read.
   */
  readUInt32BE(): number {
    const value = this.data.getUint32(this.cursor, false);
    this.cursor += 4;
    return value;
  }

  /**
   * Read unsigned 16-bit integer (u16) from the buffer.
   * @returns The number read.
   */
  readUInt16BE(): number {
    const value = this.data.getUint16(this.cursor, false);
    this.cursor += 2;
    return value;
  }

  /**
   * Read signed 64-bit integer (i64) from the buffer.
   * @returns The number read.
   */
  readInt64BE(): bigint {
    const high = this.readUInt32BE();
    const low = this.readUInt32BE();
    const value = BigInt(high) << 32n | BigInt(low);
    if (value > 0x7fffffffffffffffn) {
      return value - 0x10000000000000000n;
    }
    return value;
  }

  /**
   * Read signed 32-bit integer (i32) from the buffer.
   * @returns The number read.
   */
  readInt32BE(): number {
    const value = this.data.getInt32(this.cursor, false);
    this.cursor += 4;
    return value;
  }

  /**
   * Read signed 16-bit integer from the buffer.
   * @returns The number read.
   */
  readInt16BE(): number {
    const value = this.data.getInt16(this.cursor, false);
    this.cursor += 2;
    return value;
  }

  /**
   * Read a 32-bit floating point number (f32, float) from the buffer.
   * @returns The number read.
   */
  readFloat32(): number {
    const value = this.data.getFloat32(this.cursor, false);
    this.cursor += 4;
    return value;
  }

  /**
   * Read a 64-bit floating point number (f64, double) from the buffer.
   * @returns The number read.
   */
  readFloat64(): number {
    const value = this.data.getFloat64(this.cursor, false);
    this.cursor += 8;
    return value;
  }

  /**
   * Read a null-terminated string from the buffer.
   * @returns The string read.
   */
  readString(): string {
    const buffer: number[] = [];
    while (true) {
      const charCode = this.data.getUint8(this.cursor);
      this.cursor += 1;
      if (charCode === 0) {
        break;
      }
      buffer.push(charCode);
    }
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(buffer));
  }

  /**
   * Read a fixed-length buffer from the buffer.
   * @param length - The length of the buffer to read.
   * @returns The buffer read.
   */
  readBytes(length: number): Uint8Array {
    const buffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = this.data.getUint8(this.cursor + i);
    }
    this.cursor += length;
    return buffer;
  }

  /**
   * Read a fixed-length string from the buffer.
   * This is a shorthand for `readBytes` and `TextDecoder`.
   * @param length - The length of the string to read.
   * @returns The string read.
   */
  readChars(length: number): string {
    const buffer = this.readBytes(length);
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }
}

export default BinarySeeker;

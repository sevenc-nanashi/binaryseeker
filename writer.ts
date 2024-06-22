/**
 * Simple cursor-based binary writer.
 */
export class BinaryWriter {
  private data: Uint8Array;
  private view: DataView;
  public cursor: number;

  /**
   * Create a new BinaryWriter instance.
   * @returns A new BinaryWriter instance.
   */
  constructor() {
    this.data = new Uint8Array(0);
    this.view = new DataView(this.data.buffer);
    this.cursor = 0;
  }

  /**
   * Seek to a specific offset in the buffer.
   */
  seek(offset: number): void {
    this.cursor = offset;
  }

  /**
   * Write a single byte to the buffer.
   * @param value - The byte to write.
   */
  writeUInt8(value: number): void {
    this.allocate(1);
    this.view.setUint8(this.cursor, value);
    this.cursor += 1;
  }

  /**
   * Write a single signed byte to the buffer.
   * @param value - The byte to write.
   */
  writeInt8(value: number): void {
    this.allocate(1);
    this.data[this.cursor] = value;
    this.cursor += 1;
  }

  /**
   * Write a number to the buffer.
   *
   * > [!NOTE]
   * > In most cases, you should use the `writeTypeEndian` method instead.
   *
   * @param value - The number to write.
   * @param type - The type of number to write.
   * @param endian - The endianness to write the number in.
   */
  write(
    value: number,
    type: "u32" | "u16" | "i32" | "i16" | "f32" | "f64",
    endian: "le" | "be" = "le",
  ): void {
    switch (type) {
      case "u32":
        endian === "le" ? this.writeUInt32LE(value) : this.writeUInt32BE(value);
        break;
      case "u16":
        endian === "le" ? this.writeUInt16LE(value) : this.writeUInt16BE(value);
        break;
      case "i32":
        endian === "le" ? this.writeInt32LE(value) : this.writeInt32BE(value);
        break;
      case "i16":
        endian === "le" ? this.writeInt16LE(value) : this.writeInt16BE(value);
        break;
      case "f32":
        endian === "le"
          ? this.writeFloat32LE(value)
          : this.writeFloat32BE(value);
        break;
      case "f64":
        endian === "le"
          ? this.writeFloat64LE(value)
          : this.writeFloat64BE(value);
        break;
    }
  }

  /**
   * Write a 32-bit unsigned integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeUInt32LE(value: number): void {
    this.allocate(4);
    const view = new DataView(this.data.buffer);
    view.setUint32(this.cursor, value, true);
    this.cursor += 4;
  }

  /**
   * Write a 32-bit unsigned integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeUInt32BE(value: number): void {
    this.allocate(4);
    const view = new DataView(this.data.buffer);
    view.setUint32(this.cursor, value, false);
    this.cursor += 4;
  }

  /**
   * Write a 16-bit unsigned integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeUInt16LE(value: number): void {
    this.allocate(2);
    const view = new DataView(this.data.buffer);
    view.setUint16(this.cursor, value, true);
    this.cursor += 2;
  }

  /**
   * Write a 16-bit unsigned integer to the buffer in big-endian format.
   * @param value - The number to write.
   * @returns The number read.
   */
  writeUInt16BE(value: number): void {
    this.allocate(2);
    const view = new DataView(this.data.buffer);
    view.setUint16(this.cursor, value, false);
    this.cursor += 2;
  }

  /**
   * Write a signed 32-bit integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeInt32LE(value: number): void {
    this.allocate(4);
    const view = new DataView(this.data.buffer);
    view.setInt32(this.cursor, value, true);
    this.cursor += 4;
  }

  /**
   * Write a signed 32-bit integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeInt32BE(value: number): void {
    this.allocate(4);
    const view = new DataView(this.data.buffer);
    view.setInt32(this.cursor, value, false);
    this.cursor += 4;
  }

  /**
   * Write a signed 16-bit integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeInt16LE(value: number): void {
    this.allocate(2);
    const view = new DataView(this.data.buffer);
    view.setInt16(this.cursor, value, true);
    this.cursor += 2;
  }

  /**
   * Write a signed 16-bit integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeInt16BE(value: number): void {
    this.allocate(2);
    const view = new DataView(this.data.buffer);
    view.setInt16(this.cursor, value, false);
    this.cursor += 2;
  }

  /**
   * Write a 64-bit unsigned integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeUInt64LE(value: bigint): void {
    this.allocate(8);
    const view = new DataView(this.data.buffer);
    view.setBigUint64(this.cursor, value, true);
    this.cursor += 8;
  }

  /**
   * Write a 64-bit unsigned integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeUInt64BE(value: bigint): void {
    this.allocate(8);
    const view = new DataView(this.data.buffer);
    view.setBigUint64(this.cursor, value, false);
    this.cursor += 8;
  }

  /**
   * Write a 64-bit signed integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeInt64LE(value: bigint): void {
    this.allocate(8);
    const view = new DataView(this.data.buffer);
    view.setBigInt64(this.cursor, value, true);
    this.cursor += 8;
  }

  /**
   * Write a 32-bit floating point number (f32, float) to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeFloat32LE(value: number): void {
    this.allocate(4);
    const view = new DataView(this.data.buffer);
    view.setFloat32(this.cursor, value, true);
    this.cursor += 4;
  }

  /**
   * Write a 64-bit floating point number (f64, double) to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeFloat64LE(value: number): void {
    this.allocate(8);
    const view = new DataView(this.data.buffer);
    view.setFloat64(this.cursor, value, true);
    this.cursor += 8;
  }

  /**
   * Write a 32-bit floating point number (f32, float) to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeFloat32BE(value: number): void {
    this.allocate(4);
    const view = new DataView(this.data.buffer);
    view.setFloat32(this.cursor, value, false);
    this.cursor += 4;
  }

  /**
   * Write a 64-bit floating point number (f64, double) to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeFloat64BE(value: number): void {
    this.allocate(8);
    const view = new DataView(this.data.buffer);
    view.setFloat64(this.cursor, value, false);
    this.cursor += 8;
  }

  /** Alias for `writeFloat32LE` */
  writeFloat32(value: number): void {
    this.writeFloat32LE(value);
  }

  /** Alias for `writeFloat64LE` */
  writeFloat64(value: number): void {
    this.writeFloat64LE(value);
  }

  /**
   * Write a null-terminated string to the buffer.
   *
   * @param value - The string to write.
   */
  writeString(value: string): void {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(value);
    this.allocate(bytes.length + 1);
    for (let i = 0; i < bytes.length; i++) {
      this.data[this.cursor + i] = bytes[i];
    }
    this.data[this.cursor + bytes.length] = 0;
    this.cursor += bytes.length + 1;
  }

  /**
   * Write a buffer to the buffer.
   *
   * @param value - The buffer to write.
   */
  writeBytes(value: Uint8Array): void {
    this.allocate(value.length);
    this.data.set(value, this.cursor);
    this.cursor += value.length;
  }

  /**
   * Save the buffer as a Uint8Array.
   * @returns The buffer as a Uint8Array.
   */
  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.data);
  }

  private allocate(size: number): void {
    if (this.cursor + size > this.data.byteLength) {
      this.data = new Uint8Array(this.cursor + size);
      this.data.set(new Uint8Array(this.view.buffer));
      this.view = new DataView(this.data.buffer);
    }
  }
}

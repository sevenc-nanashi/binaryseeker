/**
 * Simple cursor-based binary writer.
 *
 * On initialization, the writer creates a buffer with a default size of 256 bytes.
 * The buffer will grow automatically as needed, but you can use {@link ensureSize} to reduce the number of resizes.
 */
export class BinaryWriter {
  private data: Uint8Array;
  private view: DataView;
  public cursor: number;
  private maxCursor: number;

  /**
   * Create a new BinaryWriter instance.
   * @param initialSize - The initial size of the buffer. The buffer will grow automatically as needed, but this can help reduce the number of resizes.
   * @returns A new BinaryWriter instance.
   */
  constructor(initialSize: number = 256) {
    this.data = new Uint8Array(initialSize);
    this.view = new DataView(this.data.buffer);
    this.cursor = 0;
    this.maxCursor = 0;
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
    this.preWrite(1);
    this.view.setUint8(this.cursor, value);
    this.postWrite(1);
  }

  /**
   * Write a single signed byte to the buffer.
   * @param value - The byte to write.
   */
  writeInt8(value: number): void {
    this.preWrite(1);
    this.data[this.cursor] = value;
    this.postWrite(1);
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
    this.preWrite(4);
    const view = new DataView(this.data.buffer);
    view.setUint32(this.cursor, value, true);
    this.postWrite(4);
  }

  /**
   * Write a 32-bit unsigned integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeUInt32BE(value: number): void {
    this.preWrite(4);
    const view = new DataView(this.data.buffer);
    view.setUint32(this.cursor, value, false);
    this.postWrite(4);
  }

  /**
   * Write a 16-bit unsigned integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeUInt16LE(value: number): void {
    this.preWrite(2);
    const view = new DataView(this.data.buffer);
    view.setUint16(this.cursor, value, true);
    this.postWrite(2);
  }

  /**
   * Write a 16-bit unsigned integer to the buffer in big-endian format.
   * @param value - The number to write.
   * @returns The number read.
   */
  writeUInt16BE(value: number): void {
    this.preWrite(2);
    const view = new DataView(this.data.buffer);
    view.setUint16(this.cursor, value, false);
    this.postWrite(2);
  }

  /**
   * Write a signed 32-bit integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeInt32LE(value: number): void {
    this.preWrite(4);
    const view = new DataView(this.data.buffer);
    view.setInt32(this.cursor, value, true);
    this.postWrite(4);
  }

  /**
   * Write a signed 32-bit integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeInt32BE(value: number): void {
    this.preWrite(4);
    const view = new DataView(this.data.buffer);
    view.setInt32(this.cursor, value, false);
    this.postWrite(4);
  }

  /**
   * Write a signed 16-bit integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeInt16LE(value: number): void {
    this.preWrite(2);
    const view = new DataView(this.data.buffer);
    view.setInt16(this.cursor, value, true);
    this.postWrite(2);
  }

  /**
   * Write a signed 16-bit integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeInt16BE(value: number): void {
    this.preWrite(2);
    const view = new DataView(this.data.buffer);
    view.setInt16(this.cursor, value, false);
    this.postWrite(2);
  }

  /**
   * Write a 64-bit unsigned integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeUInt64LE(value: bigint): void {
    this.preWrite(8);
    const view = new DataView(this.data.buffer);
    view.setBigUint64(this.cursor, value, true);
    this.postWrite(8);
  }

  /**
   * Write a 64-bit unsigned integer to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeUInt64BE(value: bigint): void {
    this.preWrite(8);
    const view = new DataView(this.data.buffer);
    view.setBigUint64(this.cursor, value, false);
    this.postWrite(8);
  }

  /**
   * Write a 64-bit signed integer to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeInt64LE(value: bigint): void {
    this.preWrite(8);
    const view = new DataView(this.data.buffer);
    view.setBigInt64(this.cursor, value, true);
    this.postWrite(8);
  }

  /**
   * Write a 32-bit floating point number (f32, float) to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeFloat32LE(value: number): void {
    this.preWrite(4);
    const view = new DataView(this.data.buffer);
    view.setFloat32(this.cursor, value, true);
    this.postWrite(4);
  }

  /**
   * Write a 64-bit floating point number (f64, double) to the buffer in little-endian format.
   * @param value - The number to write.
   */
  writeFloat64LE(value: number): void {
    this.preWrite(8);
    const view = new DataView(this.data.buffer);
    view.setFloat64(this.cursor, value, true);
    this.postWrite(8);
  }

  /**
   * Write a 32-bit floating point number (f32, float) to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeFloat32BE(value: number): void {
    this.preWrite(4);
    const view = new DataView(this.data.buffer);
    view.setFloat32(this.cursor, value, false);
    this.postWrite(4);
  }

  /**
   * Write a 64-bit floating point number (f64, double) to the buffer in big-endian format.
   * @param value - The number to write.
   */
  writeFloat64BE(value: number): void {
    this.preWrite(8);
    const view = new DataView(this.data.buffer);
    view.setFloat64(this.cursor, value, false);
    this.postWrite(8);
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
    this.preWrite(bytes.length + 1);
    for (let i = 0; i < bytes.length; i++) {
      this.data[this.cursor + i] = bytes[i];
    }
    this.data[this.cursor + bytes.length] = 0;
    this.postWrite(bytes.length + 1);
  }

  /**
   * Write a buffer to the buffer.
   *
   * @param value - The buffer to write.
   */
  writeBytes(value: Uint8Array): void {
    this.preWrite(value.length);
    this.data.set(value, this.cursor);
    this.postWrite(value.length);
  }

  /**
    * Write a string to the buffer, without null-terminating it.
    *
    * @param value - The string to write.
    */
  writeChars(value: string): void {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(value);
    this.preWrite(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      this.data[this.cursor + i] = bytes[i];
    }
    this.postWrite(bytes.length);
  }

  /**
   * Save the buffer as a Uint8Array.
   * @returns The buffer as a Uint8Array.
   */
  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.data.slice(0, this.maxCursor));
  }

  /**
   * Increase the buffer size to the specified size if the buffer is too small.
   * @param size - The size to increase the buffer to.
   * @returns The new buffer size.
   */
  ensureSize(size: number): number {
    if (this.data.byteLength < size) {
      this.extendBuffer(size);
    }
    return this.data.byteLength;
  }

  /** Get the current length of the buffer. */
  get length(): number {
    return this.maxCursor;
  }

  /** Get the current capacity of the buffer. */
  get capacity(): number {
    return this.data.byteLength;
  }

  /** Allocate more space in the buffer, if needed. */
  private preWrite(size: number): void {
    if (this.cursor + size > this.data.byteLength) {
      let newSize;
      if (this.data.byteLength >= 2048) {
        newSize = this.data.byteLength + 2048;
      } else {
        newSize = this.data.byteLength * 2;
      }
      if (this.cursor + size > newSize) {
        newSize = this.cursor + size;
      }

      this.extendBuffer(newSize);
    }
  }

  /** Allocate more space in the buffer. */
  private extendBuffer(length: number): void {
    const newData = new Uint8Array(length);
    newData.set(this.data);
    this.data = newData;
    this.view = new DataView(newData.buffer);
  }

  /** Update the cursor after writing to the buffer. */
  private postWrite(size: number): void {
    this.cursor += size;
    if (this.cursor > this.maxCursor) {
      this.maxCursor = this.cursor;
    }
  }
}

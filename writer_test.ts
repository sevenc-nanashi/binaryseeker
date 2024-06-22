import { BinaryWriter } from "./writer.ts";
import { assertEquals } from "@std/assert/assert-equals";

for (
  const [name, value, actual] of [
    ["writeUInt8", 0x12, [0x12]],
    ["writeInt8", -1, [0xff]],
    ["writeUInt16LE", 0x1234, [0x34, 0x12]],
    ["writeUInt16BE", 0x1234, [0x12, 0x34]],
    ["writeInt16LE", -1, [0xff, 0xff]],
    ["writeInt16BE", -1, [0xff, 0xff]],
    ["writeUInt32LE", 0x12345678, [0x78, 0x56, 0x34, 0x12]],
    ["writeUInt32BE", 0x12345678, [0x12, 0x34, 0x56, 0x78]],
    ["writeInt32LE", -1, [0xff, 0xff, 0xff, 0xff]],
    ["writeInt32BE", -1, [0xff, 0xff, 0xff, 0xff]],
    ["writeFloat32LE", 1.5, [0x00, 0x00, 0xc0, 0x3f]],
    ["writeFloat32BE", 1.5, [0x3f, 0xc0, 0x00, 0x00]],
    ["writeFloat64LE", 1.5, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0x3f]],
    ["writeFloat64BE", 1.5, [0x3f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]],
  ] as const
) {
  Deno.test(`BinaryWriter#${name}`, () => {
    const writer = new BinaryWriter();
    writer[name](value);
    assertEquals(writer.toUint8Array(), new Uint8Array(actual));
  });
}

Deno.test("BinaryWriter#writeString", () => {
  const writer = new BinaryWriter();
  writer.writeString("test");
  assertEquals(
    writer.toUint8Array(),
    new Uint8Array([
      116,
      101,
      115,
      116,
      0,
    ]),
  );
});

Deno.test("BinaryWriter#writeBytes", () => {
  const writer = new BinaryWriter();
  writer.writeBytes(new Uint8Array([1, 2, 3, 4]));
  assertEquals(
    writer.toUint8Array(),
    new Uint8Array([1, 2, 3, 4]),
  );
});

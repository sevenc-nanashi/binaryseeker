import { BinaryReader } from "./reader.ts";
import { assertEquals } from "@std/assert/assert-equals";

// deno-fmt-ignore
const data = [
  116, 115, 117, 107, 117, 121, 111, 109, 105, 99, 104, 97, 110, 107, 97, 119, 97, 105, 105, 0
];

const testCases: {
  method:
    | (keyof BinaryReader & `readU${string}`)
    | (keyof BinaryReader & `readI${string}`);
  expected: number;
}[] = [
  {
    method: "readUInt32LE",
    expected: (116) + (115 << 8) + (117 << 16) + (107 << 24),
  },
  {
    method: "readUInt32BE",
    expected: (116 << 24) + (115 << 16) + (117 << 8) + (107),
  },
  {
    method: "readUInt16LE",
    expected: (116) + (115 << 8),
  },
  {
    method: "readUInt16BE",
    expected: (116 << 8) + (115),
  },
  {
    method: "readInt32LE",
    expected: (116) + (115 << 8) + (117 << 16) + (107 << 24),
  },
  {
    method: "readInt32BE",
    expected: (116 << 24) + (115 << 16) + (117 << 8) + (107),
  },
  {
    method: "readInt16LE",
    expected: (116) + (115 << 8),
  },
  {
    method: "readInt16BE",
    expected: (116 << 8) + (115),
  },
];

for (const { method, expected } of testCases) {
  Deno.test(`BinaryReader{method}`, () => {
    const seeker = new BinaryReader(new Uint8Array(data).buffer);
    const actual = seeker[method]();
    assertEquals(actual, expected);
  });
}

Deno.test("BinaryReader", () => {
  const bin = "00010100000110100000101000001010";
  const seeker = new BinaryReader(
    new Uint8Array(bin.match(/.{8}/g)!.map((x) => parseInt(x, 2))).buffer,
  );
  const actual = seeker.readFloat32();
  const sign = bin[0] === "1" ? -1 : 1;
  const exponent = parseInt(bin.slice(1, 9), 2);
  const fraction = parseInt(bin.slice(9), 2);
  const expected = sign * (1 + fraction / 2 ** 23) * 2 ** (exponent - 127);
  assertEquals(actual, expected);
});

Deno.test("BinaryReader#readFloat64", () => {
  const bin =
    "0111101001101110011101000110110101110100011001010111010001100101";
  const seeker = new BinaryReader(
    new Uint8Array(bin.match(/.{8}/g)!.map((x) => parseInt(x, 2))).buffer,
  );
  const actual = seeker.readFloat64();
  const sign = bin[0] === "1" ? -1 : 1;
  const exponent = parseInt(bin.slice(1, 12), 2);
  const fraction = parseInt(bin.slice(12), 2);

  const expected = sign * (1 + fraction / 2 ** 52) * 2 ** (exponent - 1023);
  assertEquals(actual, expected);
});

Deno.test("BinaryReader#readString", () => {
  const seeker = new BinaryReader(new Uint8Array(data).buffer);
  const actual = seeker.readString();
  assertEquals(actual, "tsukuyomichankawaii");
});

Deno.test("BinaryReader does seek", () => {
  const seeker = new BinaryReader(new Uint8Array(data).buffer);
  const firstByte = seeker.readUInt8();
  const secondByte = seeker.readUInt8();
  assertEquals(firstByte, 116);
  assertEquals(secondByte, 115);
});
Deno.test("BinaryReader#hasMoreData", () => {
  const seeker = new BinaryReader(new Uint8Array(data).buffer);
  assertEquals(seeker.hasMoreData, true);
  seeker.seek(20);
  assertEquals(seeker.hasMoreData, false);
});

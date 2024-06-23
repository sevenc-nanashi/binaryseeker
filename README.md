# BinarySeeker / Simple, dependency-less, cursor-based binary reader & writer

[![jsr](https://jsr.io/badges/@sevenc-nanashi/binaryseeker)](https://jsr.io/badges/@sevenc-nanashi/binaryseeker)

BinarySeeker is a simple, dependency-less, cursor-based binary reader and writer
for TypeScript.

## Installation

Please follow [jsr documentation](https://jsr.io/docs/using-packages) for
installation instructions.

```bash
# deno
deno add @sevenc-nanashi/binaryseeeker

# npm (one of the below, depending on your package manager)
npx jsr add @sevenc-nanashi/binaryseeker
yarn dlx jsr add @sevenc-nanashi/binaryseeker
pnpm dlx jsr add @sevenc-nanashi/binaryseeker
bunx jsr add @sevenc-nanashi/binaryseeker
```

## Usage

More detailed documentation can be found in:
<https://jsr.io/@sevenc-nanashi/binaryseeker>

```typescript
import { BinaryReader } from "@sevenc-nanashi/binaryseeker";

const buffer = new Uint8Array(Array.from({ length: 16 }, (_, i) => i + 1))
const reader = new BinaryReader(buffer.buffer);

console.log(reader.readUInt8()); // 1
console.log(reader.readUInt16BE()); // 0x0203
console.log(reader.readUInt32LE()); // 0x07060504
console.log(reader.readUInt64BE()); // 0x08090a0b0c0d0e0fn

const textBufferBase = new TextEncoder().encode("Hello, World!");
const textBuffer = new Uint8Array(14);
textBuffer.set(textBufferBase); // Uint8Array [ 72, ..., 33, 0 ]

const textReader = new BinaryReader(textBuffer.buffer);

console.log(textReader.readBytes(4)); // Uint8Array [ 72, 101, 108, 108 ]
console.log(textReader.readChars(4)); // "o, W"
console.log(textReader.readString()); // "orld!"
```

```typescript
import { BinaryWriter } from "@sevenc-nanashi/binaryseeker";

const writer = new BinaryWriter();

writer.writeUInt8(1);
writer.writeUInt16BE(0x0203);
writer.writeUInt32LE(0x04050607);
writer.writeUInt64BE(0x08090a0b0c0d0e0fn);

console.log(writer.toUint8Array()); // Uint8Array [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]

const textWriter = new BinaryWriter();

textWriter.writeBytes(new Uint8Array([72, 101, 108, 108]));
textWriter.writeChars("o, W");
textWriter.writeString("orld!");

console.log(textWriter.toUint8Array()); // Uint8Array [ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33, 0 ]
```

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE) for more
information.

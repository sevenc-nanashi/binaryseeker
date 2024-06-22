# BinarySeeker / Simple, dependency-less, cursor-based binary reader

[![jsr](https://jsr.io/badges/@sevenc-nanashi/binaryseeker)](https://jsr.io/badges/@sevenc-nanashi/binaryseeker)

BinarySeeker is a simple, dependency-less, cursor-based binary reader and writer for TypeScript.

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

const buffer = new Uint8Array([
  0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,
  0x0e, 0x0f,
]);
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

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE) for more
information.

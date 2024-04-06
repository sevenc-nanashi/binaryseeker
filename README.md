# BinarySeeker / Simple, dependency-less, cursor-based binary reader

BinarySeeker is a simple, dependency-less, cursor-based binary reader for TypeScript.

## Installation

Please follow [jsr documentation](https://jsr.io/docs/using-packages) for installation instructions.

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

More detailed documentation can be found in: <https://jsr.io/@sevenc-nanashi/binaryseeker>

```typescript
import { BinarySeeker } from "@sevenc-nanashi/binaryseeker";

const buffer = new Uint8Array([
  0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,
]);
const reader = new BinarySeeker(buffer.buffer);

console.log(reader.readUint8()); // 1
console.log(reader.readUint16BE()); // 0x0203
console.log(reader.readUint32LE()); // 0x06050403
console.log(reader.readUint64BE()); // 0x090807060504030a
```

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE) for more information.

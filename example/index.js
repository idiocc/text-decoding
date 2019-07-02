import { TextDecoder } from '../src'

const decoded = new TextDecoder('utf-8')
  .decode(new Uint8Array([
    0x7A, 0xC2, 0xA2, 0xE6, 0xB0, 0xB4, 0xF0, 0x9D, 0x84, 0x9E, 0xF4, 0x8F, 0xBF, 0xBD,
  ]))
console.log(decoded)
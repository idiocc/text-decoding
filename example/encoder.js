import { TextEncoder } from '../src'

const uint8array = new TextEncoder(
  'windows-1252', { NONSTANDARD_allowLegacyEncoding: true })
  .encode('hello world')

console.log(uint8array)
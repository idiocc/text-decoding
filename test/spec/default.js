import { equal, deepEqual } from '@zoroaster/assert'
import Context from '../context'
import { TextDecoder, TextEncoder } from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  // 'is a function'() {
  //   equal(typeof textDecoding, 'function')
  // },
  // async 'calls package without error'() {
  //   await textDecoding()
  // },
  // async 'gets a link to the fixture'({ fixture }) {
  //   const text = fixture`text.txt`
  //   const res = await textDecoding({
  //     text,
  //   })
  //   ok(res, text)
  // },
}

/** @type {Object.<string, (c: Context)>} */
export const utf = {
  context: Context,
  'roundtrip'({ encode_utf16le, encode_utf16be, genblock, cpname, encode_utf8, decode_utf8 }) {
    const MIN_CODEPOINT = 0
    const MAX_CODEPOINT = 0x10FFFF
    const BLOCK_SIZE = 0x1000
    const SKIP_SIZE = 31

    const TD_U16LE = new TextDecoder("UTF-16LE")
    const TD_U16BE = new TextDecoder("UTF-16BE")

    const TE_U8    = new TextEncoder()
    const TD_U8    = new TextDecoder("UTF-8")

    for (let i = MIN_CODEPOINT; i < MAX_CODEPOINT; i += BLOCK_SIZE) {
      const block_tag = cpname(i) + " - " + cpname(i + BLOCK_SIZE - 1)
      const block = genblock(i, BLOCK_SIZE, SKIP_SIZE)

      // test UTF-16LE, UTF-16BE, and UTF-8 encodings against themselves
      let encoded = encode_utf16le(block)
      let decoded = TD_U16LE.decode(encoded)
      equal(block, decoded, "UTF-16LE round trip " + block_tag)

      encoded = encode_utf16be(block)
      decoded = TD_U16BE.decode(encoded)
      equal(block, decoded, "UTF-16BE round trip " + block_tag)

      encoded = TE_U8.encode(block)
      decoded = TD_U8.decode(encoded)
      equal(block, decoded, "UTF-8 round trip " + block_tag)

      // test TextEncoder(UTF-8) against the older idiom
      const exp_encoded = encode_utf8(block)
      deepEqual(encoded, exp_encoded,
        "UTF-8 reference encoding " + block_tag)

      const exp_decoded = decode_utf8(exp_encoded)
      equal(decoded, exp_decoded,
        "UTF-8 reference decoding " + block_tag)
    }
  },
}

export default T
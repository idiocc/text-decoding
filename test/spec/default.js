import { equal, ok, deepEqual } from '@zoroaster/assert'
import { throws, notEqual } from 'assert'
import Context from '../context'
import { TextDecoder, TextEncoder } from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'x-user-defined encoding'() {
    equal(new TextEncoder('x-user-defined').encoding, 'utf-8')

    const decoder = new TextDecoder('x-user-defined')
    for (let i = 0; i < 0x80; ++i) {
      equal(decoder.decode(new Uint8Array([i])), String.fromCharCode(i))
      equal(decoder.decode(new Uint8Array([i + 0x80])), String.fromCharCode(i + 0xF780))
    }
  },
  'gb18030 ranges'() {
    const cases = [
      { bytes: [148, 57, 218, 51], string: '\uD83D\uDCA9' }, // U+1F4A9 PILE OF POO
    ]

    cases.forEach((c) => {
      const res = new TextDecoder('gb18030').decode(new Uint8Array(c.bytes))
      equal(res,c.string)
    })
  },
  // 'TextDecoder Polyfill (will fail if natively supported)'() {},
  // 'TextEncoder Polyfill (will fail if natively supported)'() {},
  'Attributes'() {
    ok('encoding' in new TextEncoder())
    equal(new TextEncoder().encoding, 'utf-8')

    ok('encoding' in new TextDecoder())
    equal(new TextDecoder().encoding, 'utf-8')
    equal(new TextDecoder('utf-16le').encoding, 'utf-16le')
    ok('fatal' in new TextDecoder())
    ok(!new TextDecoder('utf-8').fatal)
    ok(new TextDecoder('utf-8', { fatal: true }).fatal)
    ok('ignoreBOM' in new TextDecoder())
    ok(!new TextDecoder('utf-8').ignoreBOM)
    ok(new TextDecoder('utf-8', { ignoreBOM: true }).ignoreBOM)
  },
  'bad data'() {
    const badStrings = [
      { input: '\ud800', expected: '\ufffd' }, // Surrogate half
      { input: '\udc00', expected: '\ufffd' }, // Surrogate half
      { input: 'abc\ud800def', expected: 'abc\ufffddef' }, // Surrogate half
      { input: 'abc\udc00def', expected: 'abc\ufffddef' }, // Surrogate half
      { input: '\udc00\ud800', expected: '\ufffd\ufffd' }, // Wrong order
    ]
    badStrings.forEach(({ input, expected }) => {
      const encoded = new TextEncoder().encode(input)
      const decoded = new TextDecoder().decode(encoded)
      equal(expected, decoded)
    })
  },
  'fatal flag'() {
    const bad = [
      { encoding: 'utf-8', input: [0xC0] }, // ends early
      { encoding: 'utf-8', input: [0xC0, 0x00] }, // invalid trail
      { encoding: 'utf-8', input: [0xC0, 0xC0] }, // invalid trail
      { encoding: 'utf-8', input: [0xE0] }, // ends early
      { encoding: 'utf-8', input: [0xE0, 0x00] }, // invalid trail
      { encoding: 'utf-8', input: [0xE0, 0xC0] }, // invalid trail
      { encoding: 'utf-8', input: [0xE0, 0x80, 0x00] }, // invalid trail
      { encoding: 'utf-8', input: [0xE0, 0x80, 0xC0] }, // invalid trail
      { encoding: 'utf-8', input: [0xFC, 0x80, 0x80, 0x80, 0x80, 0x80] }, // > 0x10FFFF
      { encoding: 'utf-16le', input: [0x00] }, // truncated code unit
      { encoding: 'utf-16le', input: [0x00, 0xd8] }, // surrogate half
      { encoding: 'utf-16le', input: [0x00, 0xd8, 0x00, 0x00] }, // surrogate half
      { encoding: 'utf-16le', input: [0x00, 0xdc, 0x00, 0x00] }, // trail surrogate
      { encoding: 'utf-16le', input: [0x00, 0xdc, 0x00, 0xd8] },  // swapped surrogates
      // TODO: Single byte encoding cases
    ]
    bad.forEach(({ encoding, input }) => {
      throws(() => {
        new TextDecoder(encoding, {
          fatal: true,
        }).decode(new Uint8Array(input))
      })
    })
  },
  'Encoding names are case insensitive'() {
    const encodings = [
      { label: 'utf-8', encoding: 'utf-8' },
      { label: 'utf-16', encoding: 'utf-16le' },
      { label: 'utf-16le', encoding: 'utf-16le' },
      { label: 'utf-16be', encoding: 'utf-16be' },
      { label: 'ascii', encoding: 'windows-1252' },
      { label: 'iso-8859-1', encoding: 'windows-1252' },
    ]

    encodings.forEach(
      ({ encoding, label }) => {
        equal(new TextDecoder(label.toLowerCase()).encoding, encoding)
        equal(new TextDecoder(label.toUpperCase()).encoding, encoding)
      })
  },
  'Byte-order marks'() {
    const utf8_bom = [0xEF, 0xBB, 0xBF]
    const utf8 = [0x7A, 0xC2, 0xA2, 0xE6, 0xB0, 0xB4, 0xF0, 0x9D, 0x84, 0x9E, 0xF4, 0x8F, 0xBF, 0xBD]

    const utf16le_bom = [0xff, 0xfe]
    const utf16le = [0x7A, 0x00, 0xA2, 0x00, 0x34, 0x6C, 0x34, 0xD8, 0x1E, 0xDD, 0xFF, 0xDB, 0xFD, 0xDF]

    const utf16be_bom = [0xfe, 0xff]
    const utf16be = [0x00, 0x7A, 0x00, 0xA2, 0x6C, 0x34, 0xD8, 0x34, 0xDD, 0x1E, 0xDB, 0xFF, 0xDF, 0xFD]

    const string = 'z\xA2\u6C34\uD834\uDD1E\uDBFF\uDFFD' // z, cent, CJK water, G-Clef, Private-use character

    // missing BOMs
    equal(new TextDecoder('utf-8').decode(new Uint8Array(utf8)), string)
    equal(new TextDecoder('utf-16le').decode(new Uint8Array(utf16le)), string)
    equal(new TextDecoder('utf-16be').decode(new Uint8Array(utf16be)), string)

    // matching BOMs
    equal(new TextDecoder('utf-8').decode(new Uint8Array(utf8_bom.concat(utf8))), string)
    equal(new TextDecoder('utf-16le').decode(new Uint8Array(utf16le_bom.concat(utf16le))), string)
    equal(new TextDecoder('utf-16be').decode(new Uint8Array(utf16be_bom.concat(utf16be))), string)

    // matching BOMs split
    const decoder8 = new TextDecoder('utf-8')
    equal(decoder8.decode(new Uint8Array(utf8_bom.slice(0, 1)), { stream: true }), '')
    equal(decoder8.decode(new Uint8Array(utf8_bom.slice(1).concat(utf8))), string)
    equal(decoder8.decode(new Uint8Array(utf8_bom.slice(0, 2)), { stream: true }), '')
    equal(decoder8.decode(new Uint8Array(utf8_bom.slice(2).concat(utf8))), string)
    const decoder16le = new TextDecoder('utf-16le')
    equal(decoder16le.decode(new Uint8Array(utf16le_bom.slice(0, 1)), { stream: true }), '')
    equal(decoder16le.decode(new Uint8Array(utf16le_bom.slice(1).concat(utf16le))), string)
    const decoder16be = new TextDecoder('utf-16be')
    equal(decoder16be.decode(new Uint8Array(utf16be_bom.slice(0, 1)), { stream: true }), '')
    equal(decoder16be.decode(new Uint8Array(utf16be_bom.slice(1).concat(utf16be))), string)

    // mismatching BOMs
    notEqual(new TextDecoder('utf-8').decode(new Uint8Array(utf16le_bom.concat(utf8))), string)
    notEqual(new TextDecoder('utf-8').decode(new Uint8Array(utf16be_bom.concat(utf8))), string)
    notEqual(new TextDecoder('utf-16le').decode(new Uint8Array(utf8_bom.concat(utf16le))), string)
    notEqual(new TextDecoder('utf-16le').decode(new Uint8Array(utf16be_bom.concat(utf16le))), string)
    notEqual(new TextDecoder('utf-16be').decode(new Uint8Array(utf8_bom.concat(utf16be))), string)
    notEqual(new TextDecoder('utf-16be').decode(new Uint8Array(utf16le_bom.concat(utf16be))), string)

    // ignore BOMs
    equal(new TextDecoder('utf-8', { ignoreBOM: true })
      .decode(new Uint8Array(utf8_bom.concat(utf8))),
    '\uFEFF' + string)
    equal(new TextDecoder('utf-16le', { ignoreBOM: true })
      .decode(new Uint8Array(utf16le_bom.concat(utf16le))),
    '\uFEFF' + string)
    equal(new TextDecoder('utf-16be', { ignoreBOM: true })
      .decode(new Uint8Array(utf16be_bom.concat(utf16be))),
    '\uFEFF' + string)
  },
  'Encoding names'() {
    equal(new TextDecoder('utf-8').encoding, 'utf-8') // canonical case
    equal(new TextDecoder('UTF-16').encoding, 'utf-16le') // canonical case and name
    equal(new TextDecoder('UTF-16BE').encoding, 'utf-16be') // canonical case and name
    equal(new TextDecoder('iso8859-1').encoding, 'windows-1252') // canonical case and name
    equal(new TextDecoder('iso-8859-1').encoding, 'windows-1252') // canonical case and name
  },
  'Streaming Decode'() {
    const string = '\x00123ABCabc\x80\xFF\u0100\u1000\uFFFD\uD800\uDC00\uDBFF\uDFFF'
    const cases = [
      {
        encoding: 'utf-8',
        encoded: [0, 49, 50, 51, 65, 66, 67, 97, 98, 99, 194, 128, 195, 191, 196,
          128, 225, 128, 128, 239, 191, 189, 240, 144, 128, 128, 244, 143,
          191, 191],
      },
      {
        encoding: 'utf-16le',
        encoded: [0, 0, 49, 0, 50, 0, 51, 0, 65, 0, 66, 0, 67, 0, 97, 0, 98, 0,
          99, 0, 128, 0, 255, 0, 0, 1, 0, 16, 253, 255, 0, 216, 0, 220,
          255, 219, 255, 223],
      },
      {
        encoding: 'utf-16be',
        encoded: [0, 0, 0, 49, 0, 50, 0, 51, 0, 65, 0, 66, 0, 67, 0, 97, 0, 98, 0,
          99, 0, 128, 0, 255, 1, 0, 16, 0, 255, 253, 216, 0, 220, 0, 219,
          255, 223, 255],
      },
    ]

    cases.forEach(function(c) {
      for (let len = 1; len <= 5; ++len) {
        let out = ''
        const decoder = new TextDecoder(c.encoding)
        for (let i = 0; i < c.encoded.length; i += len) {
          const sub = []
          for (let j = i; j < c.encoded.length && j < i + len; ++j) {
            sub.push(c.encoded[j])
          }
          out += decoder.decode(new Uint8Array(sub), { stream: true })
        }
        out += decoder.decode()
        equal(out, string, 'streaming decode ' + c.encoding)
      }
    })
  },
  'Shift_JIS Decode'() {
    const jis = [0x82, 0xC9, 0x82, 0xD9, 0x82, 0xF1]
    const expected = '\u306B\u307B\u3093' // Nihon
    equal(new TextDecoder('shift_jis').decode(new Uint8Array(jis)), expected)
  },
  'Supersets of ASCII decode ASCII correctly'({ ASCII_SUPERSETS }) {
    ASCII_SUPERSETS.forEach((encoding) => {
      let string = '', bytes = []
      for (let i = 0; i < 128; ++i) {
        // Encodings that have escape codes in 0x00-0x7F
        if (encoding === 'iso-2022-jp' &&
            (i === 0x0E || i === 0x0F || i === 0x1B))
          continue

        string += String.fromCharCode(i)
        bytes.push(i)
      }
      const ascii_encoded = new TextEncoder().encode(string)
      equal(new TextDecoder(encoding).decode(ascii_encoded), string, encoding)
    })
  },
  'Non-fatal errors at EOF'() {
    throws(() => {
      new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array([0xff]))
    })
    // This should not hang:
    new TextDecoder('utf-8').decode(new Uint8Array([0xff]))

    throws(() => {
      new TextDecoder('utf-16le', { fatal: true }).decode(new Uint8Array([0x00]))
    })
    // This should not hang:
    new TextDecoder('utf-16le').decode(new Uint8Array([0x00]))

    throws(() => {
      new TextDecoder('utf-16be', { fatal: true }).decode(new Uint8Array([0x00]))
    })
    // This should not hang:
    new TextDecoder('utf-16be').decode(new Uint8Array([0x00]))
  },
  'Legacy encodings supported only for decode, not encode'({ LEGACY_ENCODINGS }) {
    LEGACY_ENCODINGS.forEach(function(encoding) {
      equal(new TextDecoder(encoding).encoding, encoding)
      equal(new TextEncoder(encoding).encoding, 'utf-8')
    })
  },
  'Replacement encoding labels'() {
    [
      'csiso2022kr',
      'hz-gb-2312',
      'iso-2022-cn',
      'iso-2022-cn-ext',
      'iso-2022-kr',
    ].forEach(function(encoding) {
      equal(new TextEncoder(encoding).encoding, 'utf-8')

      throws(() => {
        new TextDecoder(encoding, { fatal: true })
      })

      throws(() => {
        new TextDecoder(encoding, { fatal: false })
      })
    })
  },
  'ArrayBuffer, ArrayBufferView and buffer offsets'() {
    const decoder = new TextDecoder()
    const bytes = [65, 66, 97, 98, 99, 100, 101, 102, 103, 104, 67, 68, 69, 70, 71, 72]
    const chars = 'ABabcdefghCDEFGH'
    const buffer = new Uint8Array(bytes).buffer
    equal(decoder.decode(buffer), chars,
      'Decoding from ArrayBuffer should match expected text.');

    ['Uint8Array', 'Int8Array', 'Uint8ClampedArray',
      'Uint16Array', 'Int16Array',
      'Uint32Array', 'Int32Array',
      'Float32Array', 'Float64Array'].forEach((typeName) => {
      const type = global[typeName]

      const array = new type(buffer)
      equal(decoder.decode(array), chars,
        'Decoding from ' + typeName + ' should match expected text.')

      const subset = new type(buffer, type.BYTES_PER_ELEMENT, 8 / type.BYTES_PER_ELEMENT)
      equal(decoder.decode(subset),
        chars.substring(type.BYTES_PER_ELEMENT, type.BYTES_PER_ELEMENT + 8),
        'Decoding from ' + typeName + ' should match expected text.')
    })
  },
  'Invalid parameters'() {
    throws(() => { new TextDecoder(null) })
    // throws(() => { new TextDecoder('utf-8', '') },
    //   'String should not coerce to dictionary.')
    throws(() => { new TextDecoder('utf-8').decode(null, '') })
  },
  'GB 18030 2000 vs 2005: U+1E3F, U+E7C7 (decoding)'() {
    // Regression test for https://github.com/whatwg/encoding/issues/22
    equal(
      new TextDecoder('gb18030').decode(new Uint8Array([
        0xA8, 0xBC,
        0x81, 0x35, 0xF4, 0x37,
      ])), '\u1E3F\uE7C7')
  },
  'encode() called with falsy arguments (polyfill bindings)'() {
    const encoder = new TextEncoder()
    deepEqual([].slice.call(encoder.encode(false)), [102, 97, 108, 115, 101])
    deepEqual([].slice.call(encoder.encode(0)), [48])
  },
  'windows-1255 map 0xCA to U+05BA'() {
    equal(
      new TextDecoder('windows-1255').decode(new Uint8Array([0xCA])),
      '\u05BA')
  },
}

export const NONSTANDARD = {
  'regression tests'() {
    const res = new TextEncoder('big5', { NONSTANDARD_allowLegacyEncoding: true })
      .encode('\u2550\u255E\u2561\u256A\u5341\u5345')
    deepEqual([249,249,249,233,249,235,249,234,164,81,164,202], [...res])
  },
  'GB 18030 2000 vs 2005: U+1E3F, U+E7C7 (encoding)'() {
    // Regression test for https://github.com/whatwg/encoding/issues/22
    const res = new TextEncoder('gb18030', { NONSTANDARD_allowLegacyEncoding: true })
      .encode('\u1E3F\uE7C7')
    deepEqual([...res], [
      0xA8, 0xBC, 0x81, 0x35, 0xF4, 0x37,
    ])
  },
  'gb18030: U+E5E5 (encoding)'() {
    // Regression test for https://github.com/whatwg/encoding/issues/17
    throws(() => {
      new TextEncoder('gb18030', { NONSTANDARD_allowLegacyEncoding: true })
        .encode('\uE5E5')
    })
  },
  'iso-2022-jp encoding attack (encoding)'() {
    // Regression test for https://github.com/whatwg/encoding/issues/15
    const encoder =
      new TextEncoder('iso-2022-jp', { NONSTANDARD_allowLegacyEncoding: true });
    [
    //'\u000E', '\u000F', '\u001B',
      '\u00A5\u000E', //'\u00A5\u000F',  '\u00A5\u001B'
    ].forEach((s) => {
      throws(() => { encoder.encode(s) })
    })
  },
  'utf-16le (encoding)'() {
    const encoder = new TextEncoder('utf-16le', {
      NONSTANDARD_allowLegacyEncoding: true,
    })
    const decoder = new TextDecoder('utf-16le')

    const sample = "z\xA2\u6C34\uD834\uDD1E\uDBFF\uDFFD"

    equal(decoder.decode(encoder.encode(sample)), sample)
  },
  'utf-16be (encoding)'() {
    const encoder = new TextEncoder('utf-16be', {
      NONSTANDARD_allowLegacyEncoding: true,
    })
    const decoder = new TextDecoder('utf-16be')

    const sample = "z\xA2\u6C34\uD834\uDD1E\uDBFF\uDFFD"

    equal(decoder.decode(encoder.encode(sample)), sample)
  },
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
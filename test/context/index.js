import { join } from 'path'
import { debuglog } from 'util'

const LOG = debuglog('text-decoding')

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * A tagged template that returns the relative path to the fixture.
   * @param {string} file
   * @example
   * fixture`input.txt` // -> test/fixture/input.txt
   */
  fixture(file) {
    const f = file.raw[0]
    return join('test/fixture', f)
  }
  async _destroy() {
    LOG('destroy context')
  }
  encode_utf16le(s) { return this.encode_utf16(s, true) }
  encode_utf16be(s) { return this.encode_utf16(s, false) }
  encode_utf16(s, le) {
    const a = new Uint8Array(s.length * 2), view = new DataView(a.buffer)
    s.split('').forEach((c, i) => {
      view.setUint16(i * 2, c.charCodeAt(0), le)
    })
    return a
  }
  genblock(from, len, skip) {
    const block = []
    for (let i = 0; i < len; i += skip) {
      let cp = from + i
      if (0xD800 <= cp && cp <= 0xDFFF)
        continue
      if (cp < 0x10000) {
        block.push(String.fromCharCode(cp))
        continue
      }
      cp = cp - 0x10000
      block.push(String.fromCharCode(0xD800 + (cp >> 10)))
      block.push(String.fromCharCode(0xDC00 + (cp & 0x3FF)))
    }
    return block.join('')
  }
  cpname(n) {
    if (n+0 !== n)
      return n.toString()
    const w = (n <= 0xFFFF) ? 4 : 6
    return 'U+' + ('000000' + n.toString(16).toUpperCase()).slice(-w)
  }
  encode_utf8(string) {
    const utf8 = unescape(encodeURIComponent(string))
    const octets = new Uint8Array(utf8.length)
    for (let i = 0; i < utf8.length; i += 1) {
      octets[i] = utf8.charCodeAt(i)
    }
    return octets
  }
  decode_utf8(octets) {
    const utf8 = String.fromCharCode.apply(null, octets)
    return decodeURIComponent(escape(utf8))
  }
}
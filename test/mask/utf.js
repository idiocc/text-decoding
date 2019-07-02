import makeTestSuite from '@zoroaster/mask'
import { TextDecoder } from '../../src'

export const samples = makeTestSuite('test/result/utf-samples', {
  getResults() {
    const input = eval(`(${this.input})`)
    const decoded = new TextDecoder(this.encoding)
      .decode(new Uint8Array(input))
    return decoded
  },
  jsProps: ['expected'],
})
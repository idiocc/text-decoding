import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import { TextDecoder } from '../../src'

export const utf_samples = makeTestSuite('test/result/utf-samples', {
  async getResults() {
    const input = eval(`(${this.input})`)
    const decoded = new TextDecoder(this.encoding)
      .decode(new Uint8Array(input))
    return decoded
  },
  jsProps: ['expected'],
  context: Context,
})
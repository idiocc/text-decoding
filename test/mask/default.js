import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import { TextDecoder } from '../../src'

export default makeTestSuite('test/result/default', {
  getResults() {
    const bytes = this.input.split(',').map((a) => parseInt(a, 10))
    return new TextDecoder(this.encoding).decode(new Uint8Array(bytes))
  },
  jsProps: ['expected'],
  context: Context,
})
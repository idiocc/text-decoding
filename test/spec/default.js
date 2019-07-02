import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import textDecoding from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof textDecoding, 'function')
  },
  async 'calls package without error'() {
    await textDecoding()
  },
  async 'gets a link to the fixture'({ fixture }) {
    const text = fixture`text.txt`
    const res = await textDecoding({
      text,
    })
    ok(res, text)
  },
}

export default T
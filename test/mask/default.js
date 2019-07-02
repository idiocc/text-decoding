import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import textDecoding from '../../src'

// export default
makeTestSuite('test/result', {
  async getResults() {
    const res = await textDecoding({
      text: this.input,
    })
    return res
  },
  context: Context,
})
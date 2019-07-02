/* alanode example/ */
import textDecoding from '../src'

(async () => {
  const res = await textDecoding({
    text: 'example',
  })
  console.log(res)
})()
# text-decoding

[![npm version](https://badge.fury.io/js/text-decoding.svg)](https://npmjs.org/package/text-decoding)

`text-decoding` is [fork] Polyfill for the Encoding Living Standard's API Written In ES6 And Optimised With JavaScript Compiler.

```sh
yarn add text-decoding
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`textDecoding(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`_text-decoding.Config`](#type-_text-decodingconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import textDecoding from 'text-decoding'
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `textDecoding(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-_text-decodingconfig">`_text-decoding.Config`</a>__: Options for the program.

|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| __text*__ | <em>string</em>  | A text to return. | -       |

```js
/* alanode example/ */
import textDecoding from 'text-decoding'

(async () => {
  const res = await textDecoding({
    text: 'example',
  })
  console.log(res)
})()
```
```
example
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [Idio][1] 2019

[1]: https://idio.cc

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>
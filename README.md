# text-decoding

[![npm version](https://badge.fury.io/js/text-decoding.svg)](https://npmjs.org/package/text-decoding)

`text-decoding` is a fork of [Polyfill for the Encoding Living Standard's API](https://github.com/inexorabletash/text-encoding) (`text-encoding`) For Node.JS.

This is a polyfill for the [Encoding Living Standard](https://encoding.spec.whatwg.org/) API for the Web, allowing encoding and decoding of textual data to and from Typed Array buffers for binary data in JavaScript.

By default it adheres to the spec and does not support encoding to legacy encodings, only decoding. It is also implemented to match the specification's algorithms, rather than for performance. The intended use is within Web pages, so it has no dependency on server frameworks or particular module schemes.

```sh
yarn add text-decoding
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`class TextDecoder`](#class-textdecoder)
- [`class TextEncoder`](#class-textencoder)
- [Encodings](#encodings)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its named classes and functions:

```js
import { TextEncoder, TextDecoder, EncodingIndexes, getEncoding } from 'text-decoding'
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `class TextDecoder`

Decodes a Uint8Array into bytes.

```js
import { TextDecoder } from 'text-decoding'

const decoded = new TextDecoder('utf-8')
  .decode(new Uint8Array([
    0x7A, 0xC2, 0xA2, 0xE6, 0xB0, 0xB4, 0xF0, 0x9D, 0x84, 0x9E, 0xF4, 0x8F, 0xBF, 0xBD,
  ]))
console.log(decoded)
```
```
z¢水𝄞􏿽
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `class TextEncoder`

Encodes a string into `Uint8Array` for the given encoding.

As required by the specification, only encoding to utf-8 is supported. If you want to try it out, you can force a non-standard behavior by passing the `NONSTANDARD_allowLegacyEncoding` option to _TextEncoder_ and a label. For example:

```js
const uint8array = new TextEncoder(
  'windows-1252', { NONSTANDARD_allowLegacyEncoding: true }).encode(text);
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Encodings

All encodings from the Encoding specification are supported:

utf-8 ibm866 iso-8859-2 iso-8859-3 iso-8859-4 iso-8859-5 iso-8859-6 iso-8859-7 iso-8859-8 iso-8859-8-i iso-8859-10 iso-8859-13 iso-8859-14 iso-8859-15 iso-8859-16 koi8-r koi8-u macintosh windows-874 windows-1250 windows-1251 windows-1252 windows-1253 windows-1254 windows-1255 windows-1256 windows-1257 windows-1258 x-mac-cyrillic gb18030 hz-gb-2312 big5 euc-jp iso-2022-jp shift_jis euc-kr replacement utf-16be utf-16le x-user-defined

(Some encodings may be supported under other names, e.g. ascii, iso-8859-1, etc. See [Encoding](https://encoding.spec.whatwg.org/) for additional labels for each encoding.)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright

Original Work By [Joshua Bell](https://github.com/inexorabletash/text-encoding) under dual Unlicense/Apache-2.0 license.

> The encoding indexes, algorithms, and many comments in the code derive from the Encoding Standard https://encoding.spec.whatwg.org/

---

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio">
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>
# text-decoding

%NPM: text-decoding%

`text-decoding` is a fork of [Polyfill for the Encoding Living Standard's API](https://github.com/inexorabletash/text-encoding) (`text-encoding`) For Node.JS.

This is a polyfill for the [Encoding Living Standard](https://encoding.spec.whatwg.org/) API for the Web, allowing encoding and decoding of textual data to and from Typed Array buffers for binary data in JavaScript.

By default it adheres to the spec and does not support encoding to legacy encodings, only decoding. It is also implemented to match the specification's algorithms, rather than for performance. The intended use is within Web pages, so it has no dependency on server frameworks or particular module schemes.

```sh
yarn add text-decoding
```

## Table Of Contents

%TOC%

%~%
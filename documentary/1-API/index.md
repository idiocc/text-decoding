## API

The package is available by importing its named classes and functions:

```js
import { TextEncoder, TextDecoder, EncodingIndexes, getEncoding } from 'text-decoding'
```

%~%

## `class TextDecoder`

Decodes a Uint8Array into bytes.

%EXAMPLE: example, ../src => text-decoding%
%FORK example%

%~%

## `class TextEncoder`

Encodes a string into `Uint8Array` for the given encoding.

As required by the specification, only encoding to utf-8 is supported. If you want to try it out, you can force a non-standard behavior by passing the `NONSTANDARD_allowLegacyEncoding` option to _TextEncoder_ and a label. For example:

%EXAMPLE: example/encoder, ../src => text-decoding%
%FORK-js example/encoder%

%~%

## `const EncodingIndexes`

This is [a map of indexes](src/encoding-indexes.js) used for encoding.

%~%

```## getEncoding => { name: string, labels: Array<string> }
[["label", "string"]]
```

Returns the normalised name of the encoding and its associated labels.

<table>
<tr><th>Source</th><th>Output</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/get-encoding, ../src => text-decoding%
</td>
<td>

%FORK-js example/get-encoding%
</td></tr>
</table>

%~%

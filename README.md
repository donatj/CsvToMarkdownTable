# CSV To Markdown Table

[![npm version](https://badge.fury.io/js/csv-to-markdown-table.svg)](https://badge.fury.io/js/csv-to-markdown-table)
![npm](https://img.shields.io/npm/dt/csv-to-markdown-table.svg?color=blue)
[![Coverage Status](https://coveralls.io/repos/github/donatj/CsvToMarkdownTable/badge.svg?branch=master)](https://coveralls.io/github/donatj/CsvToMarkdownTable?branch=master)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/donatj/csvtomarkdowntable/master/LICENSE.md)

Simple JavaScript CSV to Markdown Table Converter

You can see it in action and play with the [Live Example](https://donatstudios.com/CsvToMarkdownTable).

Uses [csv-walker](https://www.npmjs.com/package/csv-walker) for CSV parsing.
Works in Node.js (>=20) as well as in the browser.

## Install

```bash
npm install csv-to-markdown-table
```

## Usage

### CLI

This package also includes a CLI tool. You can install it globally with:

```bash
npm install -g csv-to-markdown-table
```

Then you can use it like so:

```bash
$ csv-to-markdown-table --help
Usage: csv-to-markdown-table [options]
// … help output

$ csv-to-markdown-table --delimiter ',' --headers < example.csv
| cats | dogs | fish | 
|------|------|------|
| 1    | 2    | 3    | 
| 4    | 5    | 6    |
$ csv-to-markdown-table
Reading from stdin... (press Ctrl+D at the start of a line to finish)
CSV Delimiter: \t (tab) Headers: false
[interactive input]
```

### Browser via CDN (UMD)

```html
<script src="https://unpkg.com/csv-to-markdown-table"></script>
<script>
  console.log(
    csvToMarkdown("Name,Role,Location\nAda Lovelace,Mathematician,London\nGrace Hopper,Computer scientist,New York", ",", true)
  );
</script>
```

### Node.js with CommonJS (require)

```js
const csvToMarkdown = require("csv-to-markdown-table");

console.log(
  csvToMarkdown("Name,Role,Location\nAda Lovelace,Mathematician,London\nGrace Hopper,Computer scientist,New York", ",", true)
);
```

### Node.js with ES Modules (import)

```js
import csvToMarkdown from "csv-to-markdown-table";

console.log(
  csvToMarkdown("Name,Role,Location\nAda Lovelace,Mathematician,London\nGrace Hopper,Computer scientist,New York", ",", true)
);
```

### TypeScript

```ts
import csvToMarkdown from "csv-to-markdown-table";

console.log(
  csvToMarkdown("Name,Role,Location\nAda Lovelace,Mathematician,London\nGrace Hopper,Computer scientist,New York", ",", true)
);
```

#### Outputs:

```markdown
| Name         | Role               | Location |
|--------------|--------------------|----------|
| Ada Lovelace | Mathematician      | London   |
| Grace Hopper | Computer scientist | New York |
```

Which displays in markdown as:

| Name         | Role               | Location |
|--------------|--------------------|----------|
| Ada Lovelace | Mathematician      | London   |
| Grace Hopper | Computer scientist | New York |


### Options

The optional fourth argument accepts conversion settings:

```js
csvToMarkdown('name,quote\nAda,"line one\nline two"', ",", true, {
  newlineReplacement: "<br />",
  cellFilter: (value) => value.trim(),
});
```

`newlineReplacement` sets the string used for newlines within CSV fields
(LF, CR, or CRLF). It defaults to `"<br>"`; use `""` to remove them or `null`
to skip newline replacement and preserve the original newline characters.
Existing calls without options retain the same behavior. TypeScript users can
import the `CsvToMarkdownOptions` type; the argument accepts
`Partial<CsvToMarkdownOptions>` so each setting can be supplied independently.

```ts
import type { CsvToMarkdownOptions } from "csv-to-markdown-table";
```

`cellFilter` accepts a `(value: string) => string` callback to transform each
parsed CSV field, including headers and empty fields. It runs before tab and
newline replacement, Markdown escaping, and column sizing. By default, values
are returned unchanged.

Supplied options are merged with the defaults. Omit a property to use its default
value; explicitly setting a property to `undefined` is unsupported. TypeScript
users can enable `exactOptionalPropertyTypes` to catch this at compile time.

`prettyPrint` defaults to `true`, padding cells to align columns. Set it to
`false` for compact output with outer pipes and three-dash separators. Spaces
within cell values are preserved.

Both modes use the same input:

```js
const csv = [
  "Name,Role,Location",
  "Ada Lovelace,Mathematician,London",
  "Grace Hopper,Computer scientist,New York",
].join("\n");

csvToMarkdown(csv, ",", true); // prettyPrint: true (default)
csvToMarkdown(csv, ",", true, { prettyPrint: false });
```

With `prettyPrint: true`, columns line up in the Markdown source:

```markdown
| Name         | Role               | Location |
|--------------|--------------------|----------|
| Ada Lovelace | Mathematician      | London   |
| Grace Hopper | Computer scientist | New York |
```

With `prettyPrint: false`, only the cell content and table delimiters remain:

```markdown
|Name|Role|Location|
|---|---|---|
|Ada Lovelace|Mathematician|London|
|Grace Hopper|Computer scientist|New York|
```

Both render as the same table.

## Distribution Formats

This package is distributed in multiple formats:

- **UMD**: Universal Module Definition for browsers and legacy environments (includes csvToMarkdown global variable when loaded in a browser)
  - `lib/CsvToMarkdown.js` (unminified)
  - `lib/CsvToMarkdown.min.js` (minified)
- **ESM**: ES Modules for modern JavaScript environments
  - `lib/CsvToMarkdown.mjs`
- **CJS**: CommonJS for Node.js
  - `lib/CsvToMarkdown.cjs`

The package.json is configured with the appropriate fields to ensure the correct format is used in each environment:

- `main`: Points to the CommonJS build
- `module`: Points to the ESM build
- `unpkg`: Points to the minified UMD build
- `exports`: Provides conditional exports for different environments

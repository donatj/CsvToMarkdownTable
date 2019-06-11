# CSV To Markdown Table

[![npm version](https://badge.fury.io/js/csv-to-markdown-table.svg)](https://badge.fury.io/js/csv-to-markdown-table)
![npm](https://img.shields.io/npm/dt/csv-to-markdown-table.svg?color=blue)
[![Build Status](https://travis-ci.org/donatj/CsvToMarkdownTable.svg?branch=master)](https://travis-ci.org/donatj/CsvToMarkdownTable)
[![Coverage Status](https://coveralls.io/repos/github/donatj/CsvToMarkdownTable/badge.svg?branch=master)](https://coveralls.io/github/donatj/CsvToMarkdownTable?branch=master)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/donatj/csvtomarkdowntable/master/LICENSE.md)

Simple JavaScript CSV to Markdown Table Converter

You can see it in action and play with the [Live Example](https://donatstudios.com/CsvToMarkdownTable).

Requires **no external libraries**. Works in Node as well as in the browser.

Example Use:

```js
csvToMarkdown( "header1,header2,header3\nValue1,Value2,Value3", ",", true);
```

Outputs:

```
| header1 | header2 | header3 | 
|---------|---------|---------| 
| Value1  | Value2  | Value3  | 
```

Which displays in markdown as:

| header1 | header2 | header3 | 
|---------|---------|---------| 
| Value1  | Value2  | Value3  | 

## Notes

A well done CSV to JIRA Confluence Wiki Markup fork is maintained here: https://github.com/terriann/CsvToPlainTextTable

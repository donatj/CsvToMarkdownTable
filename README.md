# CSV To Markdown Table

Simple JavaScript CSV to Markdown Table Converter

Currently requires MooTools 1.2+ (Tested in 1.3.x -> 1.5.x).  I am actively working to remove this requirement.

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

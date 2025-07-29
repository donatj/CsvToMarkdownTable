const csvToMarkdown = require('./lib/CsvToMarkdown.cjs');

console.log(csvToMarkdown( "header1,header2,header3\nValue1,Value2,Value3", ",", true));

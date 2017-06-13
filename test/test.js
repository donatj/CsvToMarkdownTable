var assert = require('assert');
var csvToMarkdown = require('../lib/CsvToMarkdown');

describe('csvToMarkdown', function () {
	it('should return a table with no headers', function () {
		var result = csvToMarkdown("a\tb\tc", "\t", false);
		assert.equal(result, "|   |   |   | \n|---|---|---| \n| a | b | c | \n");
	});

	it('should return a table with headers and no data', function () {
		var result = csvToMarkdown("a\tb\tc", "\t", true);
		assert.equal(result, "| a | b | c | \n|---|---|---| \n");
	});

	it('should convert tabs to 4 spaces to work on github', function () {
		var result = csvToMarkdown("a\tb\tc", ";", false);
		assert.equal(result, "|             | \n|-------------| \n| a    b    c | \n");
	})

	it('should format correctly with semicolons and long values', function () {
		var result = csvToMarkdown("a;b;c;long value\nd;e;f", ";", false);
		assert.equal(result, "|   |   |   |            | \n|---|---|---|------------| \n| a | b | c | long value | \n| d | e | f |            | \n");
	});

	it('should skip delimiters wrapped by quotes', function() {
		var result = csvToMarkdown('"a, b, c, d",e', ",", false);
		assert.equal(result, '|              |   | \n|--------------|---| \n| "a, b, c, d" | e | \n');
	})

	it('should format correctly with double bar header style', function () {
		var result = csvToMarkdown("a,b,c\nx,y,z", ",", true, true);
		assert.equal(result, "|| a || b || c || \n| x | y | z | \n");
	});
});

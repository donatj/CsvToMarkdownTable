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

	it('should format correctly with double bar header style using the first line as a header', function () {
		var result = csvToMarkdown("key,sandwich,points,notes\n1,Chicken Salad,48,With just enough seasoning\n2,Turkey & Bacon,263,Healthy but with bacon\n3,Bologna and cheese,1,Classic Favorite", ",", true, true);
		assert.equal(result, "|| key || sandwich           || points || notes                      || \n|  1    | Chicken Salad       | 48      | With just enough seasoning  | \n|  2    | Turkey & Bacon      | 263     | Healthy but with bacon      | \n|  3    | Bologna and cheese  | 1       | Classic Favorite            | \n");
	});

	it('should format correctly with double bar header style with a blank header', function () {
		var result = csvToMarkdown("1,Chicken Salad,48,With just enough seasoning\n2,Turkey & Bacon,263,Healthy but with bacon\n3,Bologna and cheese,1,Classic Favorite", ",", false, true);
		assert.equal(result, "||   ||                    ||     ||                            || \n|  1  | Chicken Salad       | 48   | With just enough seasoning  | \n|  2  | Turkey & Bacon      | 263  | Healthy but with bacon      | \n|  3  | Bologna and cheese  | 1    | Classic Favorite            | \n");
	});
});

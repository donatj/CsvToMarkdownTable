var assert = require('assert');
var csvToMarkdown = require('../lib/CsvToMarkdown');

describe('csvToMarkdown', function () {

	it('should return headers and blank row when no csv data is passed and all other values, using default header setting and default tab delimeter', function () {
		var result = csvToMarkdown("");
		assert.strictEqual(result, "|  | \n|--| \n|  | \n");
	});

	it('should return a table with blank headers, using default header setting and default tab delimeter', function () {
		var result = csvToMarkdown("a\tb\tc");
		assert.strictEqual(result, "|   |   |   | \n|---|---|---| \n| a | b | c | \n");
	});

	it('should handle windows newlines gracefully', function () {
		var result = csvToMarkdown("a\tb\r\nc\td\r\ne\tf\r\n", "\t", true);
		assert.strictEqual(result, "| a | b | \n|---|---| \n| c | d | \n| e | f | \n|   |   | \n");
	});

	it('should return a table with no headers', function () {
		var result = csvToMarkdown("a\tb\tc", "\t", false);
		assert.strictEqual(result, "|   |   |   | \n|---|---|---| \n| a | b | c | \n");
	});

	it('should return a table with headers and no data', function () {
		var result = csvToMarkdown("a\tb\tc", "\t", true);
		assert.strictEqual(result, "| a | b | c | \n|---|---|---| \n");
	});

	it('should return a table with blank headers with various separators', function () {
		var cases = [["a\tb\tc", "\t"], ["a,b,c", ","], ["a;b;c", ";"]];
		cases.forEach(function (entry) {
			var result = csvToMarkdown(entry[0], entry[1], false);
			assert.strictEqual(result, "|   |   |   | \n|---|---|---| \n| a | b | c | \n");
		})
	});

	it('should contain the separtor when it is wrapped in quotes', function () {
		var cases = [["a\t\"b\tc\"\td", "\t"], ["a,\"b,c\",d", ","], ["a;\"b;c\";d", ";"]];
		cases.forEach(function (entry) {
			var result = csvToMarkdown(entry[0], entry[1], false);
			assert.strictEqual(result, "|   |       |   | \n|---|-------|---| \n| a | \"b"+entry[1]+"c\" | d | \n");
		})
	});

	it('should return a table with headers and no data', function () {
		var result = csvToMarkdown("a\tb\tc", "\t", true);
		assert.strictEqual(result, "| a | b | c | \n|---|---|---| \n");
	});

	it('should convert tabs to 4 spaces to work on github', function () {
		var result = csvToMarkdown("a\tb\tc", ";", false);
		assert.strictEqual(result, "|             | \n|-------------| \n| a    b    c | \n");
	})

	it('should format correctly with semicolons and long values', function () {
		var result = csvToMarkdown("a;b;c;long value\nd;e;f", ";", false);
		assert.strictEqual(result, "|   |   |   |            | \n|---|---|---|------------| \n| a | b | c | long value | \n| d | e | f |            | \n");
	});

	it('should skip delimiters wrapped by quotes', function () {
		var result = csvToMarkdown('"a, b, c, d",e', ",", false);
		assert.strictEqual(result, '|              |   | \n|--------------|---| \n| "a, b, c, d" | e | \n');
	})

	it('should escape pipes and back slashes', function(){
		var result = csvToMarkdown('"a|b|c|d",e\\f\\g', ",", false);
		assert.strictEqual(result, '|              |         | \n|--------------|---------| \n| "a\\|b\\|c\\|d" | e\\\\f\\\\g | \n');
	});

	it('should handle single values ending in the delimiter', function(){
		var result = csvToMarkdown('"assd;"', ";", false);
		assert.strictEqual(result, '|         | \n|---------| \n| "assd;" | \n');
	});

	it('should handle items that begin with word boundaries', function(){
		var result = csvToMarkdown('"foo";"bar";"baz"\n"1";"2";"[foo -;- bar baz]"', ";", true);
		assert.strictEqual(result, '| "foo" | "bar" | "baz"               | \n|-------|-------|---------------------| \n| "1"   | "2"   | "[foo -;- bar baz]" | \n');
	});
});

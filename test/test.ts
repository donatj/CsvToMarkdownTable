import csvToMarkdown from "../src/CsvToMarkdown";

describe("csvToMarkdown", () => {

	test("should return headers and blank row when no csv data is passed and all other values, using default header setting and default tab delimeter", () => {
		const result = csvToMarkdown("");
		expect(result).toBe("|  | \n|--| \n|  | \n");
	});

	test("should return a table with blank headers, using default header setting and default tab delimeter", () => {
		const result = csvToMarkdown("a\tb\tc");
		expect(result).toBe("|   |   |   | \n|---|---|---| \n| a | b | c | \n");
	});

	test("should handle windows newlines gracefully", () => {
		const result = csvToMarkdown("a\tb\r\nc\td\r\ne\tf\r\n", "\t", true);
		expect(result).toBe("| a | b | \n|---|---| \n| c | d | \n| e | f | \n|   |   | \n");
	});

	test("should return a table with no headers", () => {
		const result = csvToMarkdown("a\tb\tc", "\t", false);
		expect(result).toBe("|   |   |   | \n|---|---|---| \n| a | b | c | \n");
	});

	test("should return a table with headers and no data", () => {
		const result = csvToMarkdown("a\tb\tc", "\t", true);
		expect(result).toBe("| a | b | c | \n|---|---|---| \n");
	});

	test("should return a table with blank headers with various separators", () => {
		const cases = [["a\tb\tc", "\t"], ["a,b,c", ","], ["a;b;c", ";"]];
		cases.forEach((entry) => {
			const result = csvToMarkdown(entry[0], entry[1], false);
			expect(result).toBe("|   |   |   | \n|---|---|---| \n| a | b | c | \n");
		});
	});

	test("should contain the separtor when it is wrapped in quotes", () => {
		const cases = [["a\t\"b\tc\"\td", "\t"], ["a,\"b,c\",d", ","], ["a;\"b;c\";d", ";"]];
		cases.forEach((entry) => {
			const result = csvToMarkdown(entry[0], entry[1], false);
			expect(result).toBe("|   |       |   | \n|---|-------|---| \n| a | \"b" + entry[1] + "c\" | d | \n");
		});
	});

	test("should return a table with headers and no data (duplicate test)", () => {
		const result = csvToMarkdown("a\tb\tc", "\t", true);
		expect(result).toBe("| a | b | c | \n|---|---|---| \n");
	});

	test("should convert tabs to 4 spaces to work on github", () => {
		const result = csvToMarkdown("a\tb\tc", ";", false);
		expect(result).toBe("|             | \n|-------------| \n| a    b    c | \n");
	});

	test("should format correctly with semicolons and long values", () => {
		const result = csvToMarkdown("a;b;c;long value\nd;e;f", ";", false);
		expect(result).toBe("|   |   |   |            | \n|---|---|---|------------| \n| a | b | c | long value | \n| d | e | f |            | \n");
	});

	test("should skip delimiters wrapped by quotes", () => {
		const result = csvToMarkdown("\"a, b, c, d\",e", ",", false);
		expect(result).toBe("|              |   | \n|--------------|---| \n| \"a, b, c, d\" | e | \n");
	});

	test("should escape pipes and back slashes", () => {
		const result = csvToMarkdown("\"a|b|c|d\",e\\f\\g", ",", false);
		expect(result).toBe("|              |         | \n|--------------|---------| \n| \"a\\|b\\|c\\|d\" | e\\\\f\\\\g | \n");
	});

	test("should handle single values ending in the delimiter", () => {
		const result = csvToMarkdown("\"assd;\"", ";", false);
		expect(result).toBe("|         | \n|---------| \n| \"assd;\" | \n");
	});

	test("should handle items that begin with word boundaries", () => {
		const result = csvToMarkdown("\"foo\";\"bar\";\"baz\"\n\"1\";\"2\";\"[foo -;- bar baz]\"", ";", true);
		expect(result).toBe("| \"foo\" | \"bar\" | \"baz\"               | \n|-------|-------|---------------------| \n| \"1\"   | \"2\"   | \"[foo -;- bar baz]\" | \n");
	});

	test("should handle delimiters that are regex special characters", () => {
		const delimiters = ["[", "]", "\\", "/", "^", "$", ".", "|", "?", "*", "+", "(", ")", "{", "}", "-"];
		delimiters.forEach((delimiter) => {
			const result = csvToMarkdown("a" + delimiter + "b" + delimiter + "c", delimiter, false);
			expect(result).toBe("|   |   |   | \n|---|---|---| \n| a | b | c | \n");
		});
	});
});

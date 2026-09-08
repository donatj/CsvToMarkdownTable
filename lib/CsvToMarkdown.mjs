import { allValues, enclosure, escape, parse, separator } from "csv-walker";
//#region src/CsvToMarkdown.ts
/*!
* Copyright (c) Jesse G. Donat and contributors.
* Licensed under the MIT License.
*
* This notice may not be removed or altered from any source distribution.
*/
const CsvToMarkdownOptionsDefaults = {
	newlineReplacement: "<br>",
	cellFilter: (value) => value,
	prettyPrint: true
};
/**
* Converts CSV to Markdown Table
*
* @param {string} csvContent - The string content of the CSV
* @param {string} delimiter - The character to use as the CSV column delimiter
* @param {boolean} hasHeader - Whether to use the first row of Data as headers
* @param {Partial<CsvToMarkdownOptions>} options - Optional conversion settings
* @returns {string}
*/
function csvToMarkdown(csvContent, delimiter = "	", hasHeader = false, options = {}) {
	const opt = {
		...CsvToMarkdownOptionsDefaults,
		...options
	};
	const parserOptions = [separator(delimiter)];
	if (opt.enclosure !== void 0) parserOptions.push(enclosure(opt.enclosure));
	if (opt.escape !== void 0) parserOptions.push(escape(opt.escape));
	const tabularData = allValues(parse(csvContent, ...parserOptions));
	const maxRowLen = [];
	for (const values of tabularData) values.forEach((column, index) => {
		var _maxRowLen$index;
		let value = opt.cellFilter(column);
		if (delimiter != "	") value = value.replace(/\t/g, "    ");
		if (opt.newlineReplacement !== null) {
			const replacement = opt.newlineReplacement;
			value = value.replace(/\r\n?|\n/g, () => replacement);
		}
		value = value.replace(/(\||\\)/g, "\\$1");
		maxRowLen[index] = opt.prettyPrint ? Math.max((_maxRowLen$index = maxRowLen[index]) !== null && _maxRowLen$index !== void 0 ? _maxRowLen$index : 0, value.length) : 0;
		values[index] = value;
	});
	if (tabularData.length === 0) {
		tabularData.push([""]);
		maxRowLen.push(0);
	}
	let headerOutput = "";
	let seperatorOutput = "";
	const rowEnding = opt.prettyPrint ? "| \n" : "|\n";
	maxRowLen.forEach((len) => {
		const sizer = Array(len + 1 + 2);
		seperatorOutput += "|" + (opt.prettyPrint ? sizer.join("-") : "---");
		headerOutput += "|" + (opt.prettyPrint ? sizer.join(" ") : "");
	});
	headerOutput += rowEnding;
	seperatorOutput += rowEnding;
	if (hasHeader) headerOutput = "";
	let rowOutput = "";
	tabularData.forEach((col, i) => {
		maxRowLen.forEach((len, y) => {
			const row = typeof col[y] == "undefined" ? "" : col[y];
			const spacing = opt.prettyPrint ? Array(len - row.length + 1).join(" ") : "";
			const out = opt.prettyPrint ? `| ${row}${spacing} ` : `|${row}`;
			if (hasHeader && i === 0) headerOutput += out;
			else rowOutput += out;
		});
		if (hasHeader && i === 0) headerOutput += rowEnding;
		else rowOutput += rowEnding;
	});
	return `${headerOutput}${seperatorOutput}${rowOutput}`;
}
//#endregion
export { csvToMarkdown as default };

//# sourceMappingURL=CsvToMarkdown.mjs.map
/*!
 * Copyright (c) Jesse G. Donat and contributors.
 * Licensed under the MIT License.
 *
 * This notice may not be removed or altered from any source distribution.
 */

import { allValues, parse, separator } from "csv-walker";

export interface CsvToMarkdownOptions {
	/** Replacement for newlines within CSV fields. Defaults to "<br>"; null skips replacement. */
	newlineReplacement: string | null;
	/** Transforms each parsed field, including headers, before Markdown formatting. */
	cellFilter: (value: string) => string;
	/** Pads cells to align columns. Defaults to true. */
	prettyPrint: boolean;
}

const CsvToMarkdownOptionsDefaults: CsvToMarkdownOptions = {
	newlineReplacement: "<br>",
	cellFilter: (value) => value,
	prettyPrint: true,
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

export default function csvToMarkdown(
	csvContent: string,
	delimiter: string = "\t",
	hasHeader: boolean = false,
	options: Partial<CsvToMarkdownOptions> = {},
): string {
	const opt: CsvToMarkdownOptions = {
		...CsvToMarkdownOptionsDefaults,
		...options,
	};

	const tabularData = allValues(parse(csvContent, separator(delimiter)));
	const maxRowLen: number[] = [];

	for (const values of tabularData) {
		values.forEach((column, index) => {
			let value = opt.cellFilter(column);

			if (delimiter != "\t") {
				value = value.replace(/\t/g, "    ");
			}

			if (opt.newlineReplacement !== null) {
				const replacement = opt.newlineReplacement;
				value = value.replace(/\r\n?|\n/g, () => replacement);
			}
			value = value.replace(/(\||\\)/g, "\\$1");
			maxRowLen[index] = opt.prettyPrint
				? Math.max(maxRowLen[index] ?? 0, value.length)
				: 0;
			values[index] = value;
		});
	}

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

	if (hasHeader) {
		headerOutput = "";
	}

	let rowOutput = "";
	tabularData.forEach((col, i) => {
		maxRowLen.forEach((len, y) => {
			const row = typeof col[y] == "undefined" ? "" : col[y];
			const spacing = opt.prettyPrint
				? Array(len - row.length + 1).join(" ")
				: "";
			const out = opt.prettyPrint ? `| ${row}${spacing} ` : `|${row}`;
			if (hasHeader && i === 0) {
				headerOutput += out;
			} else {
				rowOutput += out;
			}
		});

		if (hasHeader && i === 0) {
			headerOutput += rowEnding;
		} else {
			rowOutput += rowEnding;
		}
	});

	return `${headerOutput}${seperatorOutput}${rowOutput}`;
}

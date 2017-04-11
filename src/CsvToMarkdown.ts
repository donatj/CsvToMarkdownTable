/**
 * Converts CSV to Markdown Table
 *
 * @param {string} csvContent - The string content of the CSV
 * @param {string} delimiter - The character(s) to use as the CSV column delimiter
 * @param {boolean} hasHeader - Whether to use the first row of Data as headers
 * @returns {string}
 */
function csvToMarkdown(csvContent: string, delimiter: string = "\t", hasHeader: boolean = false) {
	if (delimiter != "\t") {
		csvContent = csvContent.replace(/\t/g, "    ");
	}

	let columns = csvContent.split("\n");

	let tabularData: string[][] = [];
	let maxRowLen: number[] = [];

	columns.forEach((e, i) => {
		if (typeof tabularData[i] == "undefined") {
			tabularData[i] = [];
		}

		let row = e.split(delimiter);

		row.forEach((ee, ii) => {
			if (typeof maxRowLen[ii] == "undefined") {
				maxRowLen[ii] = 0;
			}

			maxRowLen[ii] = Math.max(maxRowLen[ii], ee.length);
			tabularData[i][ii] = ee;
		});
	});

	let headerOutput = "";
	let seperatorOutput = "";

	maxRowLen.forEach((len) => {
		let spacer;
		spacer = Array(len + 1 + 2).join("-");
		seperatorOutput += "|" + spacer;

		spacer = Array(len + 1 + 2).join(" ");
		headerOutput += "|" + spacer;
	});

	headerOutput += "| \n";
	seperatorOutput += "| \n";

	if (hasHeader) {
		headerOutput = "";
	}

	let rowOutput = "";
	let initHeader = true;
	tabularData.forEach((col) => {
		maxRowLen.forEach((len, y) => {
			let row = typeof col[y] == "undefined" ? "" : col[y];
			let spacing = Array((len - row.length) + 1).join(" ");
			let out = `| ${row}${spacing} `;
			if (hasHeader && initHeader) {
				headerOutput += out;
			} else {
				rowOutput += out;
			}
		});

		if (hasHeader && initHeader) {
			headerOutput += "| \n";
		} else {
			rowOutput += "| \n";
		}

		initHeader = false;
	});

	return headerOutput + seperatorOutput + rowOutput;
}

if (typeof module != "undefined") {
	module.exports = csvToMarkdown;
}
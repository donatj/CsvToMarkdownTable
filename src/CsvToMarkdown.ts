/**
 * Converts CSV to Markdown Table
 *
 * @param {string} csvContent - The string content of the CSV
 * @param {string} delimiter - The character(s) to use as the CSV column delimiter
 * @param {boolean} hasHeader - Whether to use the first row of Data as headers
 * @param {boolean} useDoubleBarHeader - Whether the header uses double barlines for <th>
 * @returns {string}
 */
function csvToMarkdown(csvContent: string, delimiter: string = "\t", hasHeader: boolean = false, useDoubleBarHeader: boolean = false) {
	if (delimiter != "\t") {
		csvContent = csvContent.replace(/\t/g, "    ");
	}

	const columns = csvContent.split("\n");

	const tabularData: string[][] = [];
	const maxRowLen: number[] = [];

	columns.forEach((e, i) => {
		if (typeof tabularData[i] == "undefined") {
			tabularData[i] = [];
		}
		const regex = new RegExp(delimiter + '(?![^"]*"\\B)');
		const row = e.split(regex);
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
		const sizer = Array(len + 1 + 2);

		seperatorOutput += "|" + sizer.join("-");
		headerOutput += "|" + sizer.join(" ");
	});

	headerOutput += "| \n";
	seperatorOutput += "| \n";

	if (hasHeader) {
		headerOutput = "";
	}

	let rowOutput = "";
	tabularData.forEach((col, i) => {
		maxRowLen.forEach((len, y) => {
			const row = typeof col[y] == "undefined" ? "" : col[y];
			let pre_space_count = 1;
			let post_space_count = (len - row.length ) + 1;

			if(useDoubleBarHeader) {
				if(i > 0 ){
					post_space_count++;
					pre_space_count++;
					if(y > 0){
						pre_space_count--;
					}
				}
				if(!hasHeader && i===0){
					post_space_count++;
					if(y === 0) {
						pre_space_count++;
					}
				}
			}
			
			const preSpacing = Array(pre_space_count + 1).join(" ");
			const spacing = Array(post_space_count + 1).join(" ");
			const out = `|${preSpacing}${row}${spacing}`;
			
			if (hasHeader && i === 0) {
				headerOutput += out;
			} else {
				rowOutput += out;
			}
		});

		if (hasHeader && i === 0) {
			headerOutput += "| \n";
		} else {
			rowOutput += "| \n";
		}
	});

	if(useDoubleBarHeader) {
		headerOutput = headerOutput.replace(/\|/g, '||');
		seperatorOutput = '';
	}

	return headerOutput + seperatorOutput + rowOutput;
}

if (typeof module != "undefined") {
	module.exports = csvToMarkdown;
}

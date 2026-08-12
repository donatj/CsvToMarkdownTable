'use strict';

var csvWalker = require('csv-walker');

/*!
 * Copyright (c) Jesse G. Donat and contributors.
 * Licensed under the MIT License.
 *
 * This notice may not be removed or altered from any source distribution.
 */
/**
 * Converts CSV to Markdown Table
 *
 * @param {string} csvContent - The string content of the CSV
 * @param {string} delimiter - The character to use as the CSV column delimiter
 * @param {boolean} hasHeader - Whether to use the first row of Data as headers
 * @returns {string}
 */
function csvToMarkdown(csvContent, delimiter = "\t", hasHeader = false) {
    const tabularData = csvWalker.allValues(csvWalker.parse(csvContent, csvWalker.separator(delimiter)));
    const maxRowLen = [];
    for (const values of tabularData) {
        values.forEach((column, index) => {
            var _a;
            let value = column;
            if (delimiter != "\t") {
                value = value.replace(/\t/g, "    ");
            }
            value = value.replace(/\r\n?|\n/g, "<br>").replace(/(\||\\)/g, "\\$1");
            maxRowLen[index] = Math.max((_a = maxRowLen[index]) !== null && _a !== void 0 ? _a : 0, value.length);
            values[index] = value;
        });
    }
    if (tabularData.length === 0) {
        tabularData.push([""]);
        maxRowLen.push(0);
    }
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
            const spacing = Array(len - row.length + 1).join(" ");
            const out = `| ${row}${spacing} `;
            if (hasHeader && i === 0) {
                headerOutput += out;
            }
            else {
                rowOutput += out;
            }
        });
        if (hasHeader && i === 0) {
            headerOutput += "| \n";
        }
        else {
            rowOutput += "| \n";
        }
    });
    return `${headerOutput}${seperatorOutput}${rowOutput}`;
}

module.exports = csvToMarkdown;
//# sourceMappingURL=CsvToMarkdown.cjs.map

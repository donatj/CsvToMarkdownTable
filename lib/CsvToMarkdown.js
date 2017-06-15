"use strict";
/**
 * Converts CSV to Markdown Table
 *
 * @param {string} csvContent - The string content of the CSV
 * @param {string} delimiter - The character(s) to use as the CSV column delimiter
 * @param {boolean} hasHeader - Whether to use the first row of Data as headers
 * @param {boolean} useDoubleBarHeader - Whether the header uses double barlines for <th>
 * @returns {string}
 */
function csvToMarkdown(csvContent, delimiter, hasHeader, useDoubleBarHeader) {
    if (delimiter === void 0) { delimiter = "\t"; }
    if (hasHeader === void 0) { hasHeader = false; }
    if (useDoubleBarHeader === void 0) { useDoubleBarHeader = false; }
    if (delimiter != "\t") {
        csvContent = csvContent.replace(/\t/g, "    ");
    }
    var columns = csvContent.split("\n");
    var tabularData = [];
    var maxRowLen = [];
    columns.forEach(function (e, i) {
        if (typeof tabularData[i] == "undefined") {
            tabularData[i] = [];
        }
        var regex = new RegExp(delimiter + '(?![^"]*"\\B)');
        var row = e.split(regex);
        row.forEach(function (ee, ii) {
            if (typeof maxRowLen[ii] == "undefined") {
                maxRowLen[ii] = 0;
            }
            maxRowLen[ii] = Math.max(maxRowLen[ii], ee.length);
            tabularData[i][ii] = ee;
        });
    });
    var headerOutput = "";
    var seperatorOutput = "";
    maxRowLen.forEach(function (len) {
        var sizer = Array(len + 1 + 2);
        seperatorOutput += "|" + sizer.join("-");
        headerOutput += "|" + sizer.join(" ");
    });
    headerOutput += "| \n";
    seperatorOutput += "| \n";
    if (hasHeader) {
        headerOutput = "";
    }
    var rowOutput = "";
    tabularData.forEach(function (col, i) {
        maxRowLen.forEach(function (len, y) {
            var row = typeof col[y] == "undefined" ? "" : col[y];
            var pre_space_count = 1;
            var post_space_count = (len - row.length) + 1;
            if (useDoubleBarHeader) {
                if (i > 0) {
                    post_space_count++;
                    pre_space_count++;
                    if (y > 0) {
                        pre_space_count--;
                    }
                }
                if (!hasHeader && i === 0) {
                    post_space_count++;
                    if (y === 0) {
                        pre_space_count++;
                    }
                }
            }
            var preSpacing = Array(pre_space_count + 1).join(" ");
            var spacing = Array(post_space_count + 1).join(" ");
            var out = "|" + preSpacing + row + spacing;
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
    if (useDoubleBarHeader) {
        headerOutput = headerOutput.replace(/\|/g, '||');
        seperatorOutput = '';
    }
    return headerOutput + seperatorOutput + rowOutput;
}
if (typeof module != "undefined") {
    module.exports = csvToMarkdown;
}

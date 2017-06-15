/**
 * Converts CSV to Markdown Table
 *
 * @param {string} csvContent - The string content of the CSV
 * @param {string} delimiter - The character(s) to use as the CSV column delimiter
 * @param {boolean} hasHeader - Whether to use the first row of Data as headers
 * @param {boolean} useDoubleBarHeader - Whether the header uses double barlines for <th>
 * @returns {string}
 */
declare function csvToMarkdown(csvContent: string, delimiter?: string, hasHeader?: boolean, useDoubleBarHeader?: boolean): string;

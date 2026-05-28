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
 * @param {string} delimiter - The character(s) to use as the CSV column delimiter
 * @param {boolean} hasHeader - Whether to use the first row of Data as headers
 * @returns {string}
 */
export default function csvToMarkdown(csvContent: string, delimiter?: string, hasHeader?: boolean): string;

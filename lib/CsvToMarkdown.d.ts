/*!
 * Copyright (c) Jesse G. Donat and contributors.
 * Licensed under the MIT License.
 *
 * This notice may not be removed or altered from any source distribution.
 */
export interface CsvToMarkdownOptions {
    /** Replacement for newlines within CSV fields. Defaults to "<br>". */
    newlineReplacement: string;
    /** Transforms each parsed field, including headers, before Markdown formatting. */
    cellFilter: (value: string) => string;
}
/**
 * Converts CSV to Markdown Table
 *
 * @param {string} csvContent - The string content of the CSV
 * @param {string} delimiter - The character to use as the CSV column delimiter
 * @param {boolean} hasHeader - Whether to use the first row of Data as headers
 * @param {Partial<CsvToMarkdownOptions>} options - Optional conversion settings
 * @returns {string}
 */
export default function csvToMarkdown(csvContent: string, delimiter?: string, hasHeader?: boolean, options?: Partial<CsvToMarkdownOptions>): string;

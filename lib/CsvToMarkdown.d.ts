/*!
 * Copyright (c) Jesse G. Donat and contributors.
 * Licensed under the MIT License.
 *
 * This notice may not be removed or altered from any source distribution.
 */
export interface CsvToMarkdownOptions {
    /** Quoted-field enclosure passed to csv-walker when supplied. */
    enclosure?: string;
    /** CSV escape character; an empty string disables escaping. */
    escape?: string;
    /** Replacement for newlines within CSV fields. Defaults to "<br>"; null skips replacement. */
    newlineReplacement: string | null;
    /** Transforms each parsed field; indexes are zero-based and include headers. */
    cellFilter: (value: string, rowIndex: number, columnIndex: number) => string;
    /** Pads cells to align columns. Defaults to true. */
    prettyPrint: boolean;
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

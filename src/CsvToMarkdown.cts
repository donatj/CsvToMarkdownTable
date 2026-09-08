// Declaration-only adapter for the direct CommonJS function export.
import type * as esm from "./CsvToMarkdown.js" with {
	"resolution-mode": "import",
};

declare const csvToMarkdown: typeof esm.default;
declare namespace csvToMarkdown {
	export type CsvToMarkdownOptions = esm.CsvToMarkdownOptions;
}

export = csvToMarkdown;

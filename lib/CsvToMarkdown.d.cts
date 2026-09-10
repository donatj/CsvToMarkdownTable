import type * as esm from "./CsvToMarkdown.js" with {
    "resolution-mode": "import"
};
declare const csvToMarkdown: typeof esm.default;
declare namespace csvToMarkdown {
    type CsvToMarkdownOptions = esm.CsvToMarkdownOptions;
}
export = csvToMarkdown;

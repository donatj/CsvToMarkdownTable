import csvToMarkdown = require("csv-to-markdown-table");
import defaultImport from "csv-to-markdown-table";
import type { CsvToMarkdownOptions } from "csv-to-markdown-table";

const options: Partial<CsvToMarkdownOptions> = { prettyPrint: false };
const result: string = csvToMarkdown("a,b", ",", true, options);
defaultImport(result);
// @ts-expect-error Options must retain their declared types.
csvToMarkdown("a,b", ",", true, { prettyPrint: "false" });

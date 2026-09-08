import csvToMarkdown, {
	type CsvToMarkdownOptions,
} from "csv-to-markdown-table";

const options: Partial<CsvToMarkdownOptions> = { prettyPrint: false };
const result: string = csvToMarkdown("a,b", ",", true, options);
csvToMarkdown(result);
// @ts-expect-error Options must retain their declared types.
csvToMarkdown("a,b", ",", true, { prettyPrint: "false" });

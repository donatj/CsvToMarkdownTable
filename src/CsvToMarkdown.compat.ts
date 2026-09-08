import csvToMarkdown, {
	CsvToMarkdownOptionsDefaults,
} from "./CsvToMarkdown.js";

// Preserve the callable CommonJS export and browser global.
export default Object.assign(csvToMarkdown, { CsvToMarkdownOptionsDefaults });

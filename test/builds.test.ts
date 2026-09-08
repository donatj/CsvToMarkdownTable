import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import csvToMarkdown from "../src/CsvToMarkdown.js";

describe.each(["CsvToMarkdown.js", "CsvToMarkdown.min.js"])(
	"%s UMD bundle",
	(file) => {
		test.each(["global", "commonjs", "amd"])("supports %s loading", (mode) => {
			let exported: typeof csvToMarkdown | undefined;
			const module = { exports: {} };
			const define = Object.assign(
				(_dependencies: string[], factory: () => typeof csvToMarkdown) => {
					exported = factory();
				},
				{ amd: true },
			);
			const context = {
				...(mode === "commonjs" ? { module, exports: module.exports } : {}),
				...(mode === "amd" ? { define } : {}),
				csvToMarkdown: undefined as typeof csvToMarkdown | undefined,
			};
			runInNewContext(
				readFileSync(new URL(`../lib/${file}`, import.meta.url), "utf8"),
				context,
			);
			const convert = (
				mode === "commonjs"
					? module.exports
					: mode === "amd"
						? exported
						: context.csvToMarkdown
			) as typeof csvToMarkdown;
			const input = 'name,note\nAda,"line one\nline two|\\"';
			const options = { prettyPrint: false, escape: "" };
			expect(typeof convert).toBe("function");
			expect(convert(input, ",", true, options)).toBe(
				csvToMarkdown(input, ",", true, options),
			);
		});
	},
);

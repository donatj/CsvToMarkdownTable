import { defineConfig } from "tsdown";

const shared = {
	entry: ["src/CsvToMarkdown.ts"],
	outDir: "lib",
	target: "es2018",
	sourcemap: true,
	dts: false,
};

export default defineConfig([
	...(["esm", "cjs"] as const).map((format) => ({
		...shared,
		format,
		deps:
			format === "cjs"
				? { alwaysBundle: ["csv-walker"], onlyBundle: ["csv-walker"] }
				: { neverBundle: ["csv-walker"] },
		outExtensions: () => ({
			js: format === "cjs" ? ".cjs" : ".mjs",
		}),
	})),
	...[false, true].map((minify) => ({
		...shared,
		format: "umd" as const,
		platform: "browser" as const,
		globalName: "csvToMarkdown",
		deps: { alwaysBundle: ["csv-walker"], onlyBundle: ["csv-walker"] },
		minify,
		outputOptions: {
			entryFileNames: minify ? "CsvToMarkdown.min.js" : "CsvToMarkdown.js",
			exports: "default" as const,
		},
	})),
]);

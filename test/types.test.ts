import { fileURLToPath } from "node:url";
import ts from "typescript";

test.each(["cts", "mts"])(
	"package declarations support .%s consumers",
	(ext) => {
		const program = ts.createProgram(
			[fileURLToPath(new URL(`./types/consumer.${ext}`, import.meta.url))],
			{
				module: ts.ModuleKind.NodeNext,
				moduleResolution: ts.ModuleResolutionKind.NodeNext,
				strict: true,
				noEmit: true,
				types: [],
			},
		);
		const errors = ts
			.getPreEmitDiagnostics(program)
			.map((diagnostic) =>
				ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
			);
		expect(errors).toEqual([]);
	},
);

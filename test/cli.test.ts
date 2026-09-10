import { spawn, spawnSync } from "child_process";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, "../bin/csv2md");

interface CliResult {
	exitCode: number | null;
	stderr: string;
	stdout: string;
}

function runCli(args: string[], input: string = ""): Promise<CliResult> {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [cliPath, ...args], {
			stdio: "pipe",
		});
		let stdout = "";
		let stderr = "";

		child.stdout.setEncoding("utf8");
		child.stdout.on("data", (chunk: string) => {
			stdout += chunk;
		});
		child.stderr.setEncoding("utf8");
		child.stderr.on("data", (chunk: string) => {
			stderr += chunk;
		});
		child.on("error", reject);
		child.on("close", (exitCode) => {
			resolve({ exitCode, stderr, stdout });
		});
		child.stdin.end(input);
	});
}

describe("CLI Tool Tests", () => {
	test.each(["", "\n", "\r\n"])(
		"should preserve boundary empty TSV fields with trailing newline %p",
		async (newline) => {
			const { exitCode, stdout, stderr } = await runCli(
				[],
				`\tA\nB\t${newline}`,
			);

			expect(exitCode).toBe(0);
			expect(stderr).toBe("");
			expect(stdout).toBe("|   |   | \n|---|---| \n|   | A | \n| B |   | \n");
		},
	);

	test("should preserve spaces at the start and end of CSV input", async () => {
		const { exitCode, stdout, stderr } = await runCli(
			["--delim", ",", "--headers"],
			" A,B \n",
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toBe("|  A | B  | \n|----|----| \n");
	});

	test("should preserve UTF-8 characters split across input chunks", () => {
		// Supply a real byte stream with separate event-loop turns so pipe buffering
		// cannot merge the chunks and hide a broken decoder.
		const script = `
			import { Readable } from "node:stream";
			import { setImmediate } from "node:timers/promises";
			import { pathToFileURL } from "node:url";

			const stdin = Readable.from((async function* () {
				yield Buffer.from([0xc3]);
				await setImmediate();
				yield Buffer.from([0xa9]);
			})(), { objectMode: false });
			Object.defineProperty(process, "stdin", { value: stdin });
			await import(pathToFileURL(process.argv[1]).href);
		`;
		const { status, stdout, stderr, error } = spawnSync(
			process.execPath,
			["--input-type=module", "--eval", script, cliPath, "--headers"],
			{ encoding: "utf8", timeout: 5000 },
		);

		expect(error).toBeUndefined();
		expect(status).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toBe("| é | \n|---| \n");
	});

	// Test help command
	test("should display help information when --help flag is used", async () => {
		const { exitCode, stdout, stderr } = await runCli(["--help"]);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toContain("Usage:");
		expect(stdout).toContain("Usage: csv2md [options]");
		expect(stdout).toContain("Options:");
		expect(stdout).toContain("--delim");
		expect(stdout).toContain("--headers");
		expect(stdout).toContain("--help");
	});

	// Test invalid argument
	test("should display error and help when invalid argument is provided", async () => {
		const { exitCode, stdout, stderr } = await runCli(["--invalid-arg"]);

		expect(exitCode).not.toBe(0);
		expect(stderr).toContain("Unrecognized argument: --invalid-arg");
		expect(stdout).toContain("Usage:");
	});

	// Test missing delimiter after --delim flag
	test("should display error when no delimiter is specified after --delim", async () => {
		const { exitCode, stderr } = await runCli(["--delim"]);

		expect(exitCode).not.toBe(0);
		expect(stderr).toContain("No delimiter specified after --delim");
	});

	test("should reject multi-character delimiters", async () => {
		const { exitCode, stderr } = await runCli(["--delim", "||"]);

		expect(exitCode).not.toBe(0);
		expect(stderr).toContain("Delimiter must be one character.");
	});

	// Test with input from standard input
	test("should convert CSV to markdown table when input is piped", async () => {
		const csvContent = "a,b,c\n1,2,3\n4,5,6";
		const { exitCode, stdout, stderr } = await runCli(
			["--delim", ","],
			csvContent,
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toContain("|   |   |   |");
		expect(stdout).toContain("|---|---|---|");
		expect(stdout).toContain("| a | b | c |");
		expect(stdout).toContain("| 1 | 2 | 3 |");
		expect(stdout).toContain("| 4 | 5 | 6 |");
	});

	// Test with headers flag
	test("should use first row as headers when --headers flag is used", async () => {
		const csvContent = "a,b,c\n1,2,3\n4,5,6";
		const { exitCode, stdout, stderr } = await runCli(
			["--delim", ",", "--headers"],
			csvContent,
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toContain("| a | b | c |");
		expect(stdout).toContain("|---|---|---|");
		expect(stdout).toContain("| 1 | 2 | 3 |");
		expect(stdout).toContain("| 4 | 5 | 6 |");

		// The header row should not appear in the data section
		const lines = stdout.trim().split("\n");
		expect(lines.filter((line) => line.includes("| a | b | c |")).length).toBe(
			1,
		);
	});

	// Test with special delimiter
	test("should handle special delimiter :tab correctly", async () => {
		const csvContent = "a\tb\tc\n1\t2\t3\n4\t5\t6";
		const { exitCode, stdout, stderr } = await runCli(
			["--delim", ":tab"],
			csvContent,
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toContain("|   |   |   |");
		expect(stdout).toContain("|---|---|---|");
		expect(stdout).toContain("| a | b | c |");
		expect(stdout).toContain("| 1 | 2 | 3 |");
		expect(stdout).toContain("| 4 | 5 | 6 |");
	});

	// Test with special delimiter :comma
	test("should handle special delimiter :comma correctly", async () => {
		const csvContent = "a,b,c\n1,2,3\n4,5,6";
		const { exitCode, stdout, stderr } = await runCli(
			["--delim", ":comma"],
			csvContent,
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toContain("|   |   |   |");
		expect(stdout).toContain("|---|---|---|");
		expect(stdout).toContain("| a | b | c |");
		expect(stdout).toContain("| 1 | 2 | 3 |");
		expect(stdout).toContain("| 4 | 5 | 6 |");
	});

	// Test with special delimiter :semicolon
	test("should handle special delimiter :semicolon correctly", async () => {
		const csvContent = "a;b;c\n1;2;3\n4;5;6";
		const { exitCode, stdout, stderr } = await runCli(
			["--delim", ":semicolon"],
			csvContent,
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toContain("|   |   |   |");
		expect(stdout).toContain("|---|---|---|");
		expect(stdout).toContain("| a | b | c |");
		expect(stdout).toContain("| 1 | 2 | 3 |");
		expect(stdout).toContain("| 4 | 5 | 6 |");
	});
});

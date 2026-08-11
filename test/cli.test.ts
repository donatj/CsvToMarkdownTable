import { spawn } from "child_process";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, "../bin/csv-to-markdown-table");

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
		child.stderr.setEncoding("utf8");
		child.stdout.on("data", (chunk: string) => {
			stdout += chunk;
		});
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

function expectedTableOutput(lines: string[]): string {
	return lines.map((line) => line + " ").join("\n") + "\n";
}

const tableOutput = expectedTableOutput([
	"|   |   |   |",
	"|---|---|---|",
	"| a | b | c |",
	"| 1 | 2 | 3 |",
	"| 4 | 5 | 6 |",
]);

const headerTableOutput = expectedTableOutput([
	"| a | b | c |",
	"|---|---|---|",
	"| 1 | 2 | 3 |",
	"| 4 | 5 | 6 |",
]);

describe("CLI Tool Tests", () => {
	test("should display help information when --help flag is used", async () => {
		const { exitCode, stderr, stdout } = await runCli(["--help"]);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toContain("Usage:");
		expect(stdout).toContain("Options:");
		expect(stdout).toContain("--delim");
		expect(stdout).toContain("--headers");
		expect(stdout).toContain("--help");
	});

	test("should display error and help when invalid argument is provided", async () => {
		const { exitCode, stderr, stdout } = await runCli(["--invalid-arg"]);

		expect(exitCode).not.toBe(0);
		expect(stderr).toContain("Unrecognized argument: --invalid-arg");
		expect(stdout).toContain("Usage:");
	});

	test("should display error when no delimiter is specified after --delim", async () => {
		const { exitCode, stderr } = await runCli(["--delim"]);

		expect(exitCode).not.toBe(0);
		expect(stderr).toContain("No delimiter specified after --delim");
	});

	test("should convert CSV to markdown table from standard input", async () => {
		const { exitCode, stderr, stdout } = await runCli(
			["--delim", ","],
			"a,b,c\n1,2,3\n4,5,6",
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toBe(tableOutput);
	});

	test("should use first row as headers when --headers flag is used", async () => {
		const { exitCode, stderr, stdout } = await runCli(
			["--delim", ",", "--headers"],
			"a,b,c\n1,2,3\n4,5,6",
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toBe(headerTableOutput);
	});

	test("should handle special delimiter :tab correctly", async () => {
		const { exitCode, stderr, stdout } = await runCli(
			["--delim", ":tab"],
			"a\tb\tc\n1\t2\t3\n4\t5\t6",
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toBe(tableOutput);
	});

	test("should handle special delimiter :comma correctly", async () => {
		const { exitCode, stderr, stdout } = await runCli(
			["--delim", ":comma"],
			"a,b,c\n1,2,3\n4,5,6",
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toBe(tableOutput);
	});

	test("should handle special delimiter :semicolon correctly", async () => {
		const { exitCode, stderr, stdout } = await runCli(
			["--delim", ":semicolon"],
			"a;b;c\n1;2;3\n4;5;6",
		);

		expect(exitCode).toBe(0);
		expect(stderr).toBe("");
		expect(stdout).toBe(tableOutput);
	});
});

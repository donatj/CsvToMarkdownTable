import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execFileAsync = promisify(execFile);
const cliPath = path.resolve(__dirname, "../bin/csv-to-markdown-table");

// Helper to run CLI with stdin input
const execFileWithInput = (file: string, args: string[], input: string): Promise<{ stdout: string; stderr: string }> => {
	return new Promise((resolve, reject) => {
		const child = execFile(file, args, (error, stdout, stderr) => {
			if (error) {
				const err = error as NodeJS.ErrnoException & { stdout: string; stderr: string };
				err.stdout = stdout as string;
				err.stderr = stderr as string;
				reject(err);
				return;
			}
			resolve({ stdout: stdout as string, stderr: stderr as string });
		});
		if (child.stdin) {
			child.stdin.write(input);
			child.stdin.end();
		}
	});
};

// Helper function to create a temporary CSV file
const createTempCsvFile = (content: string): string => {
	const tempFilePath = path.join(__dirname, "temp-test.csv");
	fs.writeFileSync(tempFilePath, content);
	return tempFilePath;
};

// Helper function to clean up temporary files
const cleanupTempFiles = (filePath: string): void => {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
};

describe("CLI Tool Tests", () => {
	// Test help command
	test("should display help information when --help flag is used", async () => {
		const { stdout, stderr } = await execFileAsync(cliPath, ["--help"]);

		expect(stderr).toBe("");
		expect(stdout).toContain("Usage:");
		expect(stdout).toContain("Options:");
		expect(stdout).toContain("--delim");
		expect(stdout).toContain("--headers");
		expect(stdout).toContain("--help");
	});

	// Test invalid argument
	test("should display error and help when invalid argument is provided", async () => {
		try {
			await execFileAsync(cliPath, ["--invalid-arg"]);
			// If we get here, the command didn't fail as expected
			fail("Command should have failed with non-zero exit code");
		} catch (error: any) {
			expect(error.stderr).toContain("Unrecognized argument: --invalid-arg");
			expect(error.stdout).toContain("Usage:");
		}
	});

	// Test missing delimiter after --delim flag
	test("should display error when no delimiter is specified after --delim", async () => {
		try {
			await execFileAsync(cliPath, ["--delim"]);
			fail("Command should have failed with non-zero exit code");
		} catch (error: any) {
			expect(error.stderr).toContain("No delimiter specified after --delim");
		}
	});

	// Test with input from file using pipe
	test("should convert CSV to markdown table when input is piped", async () => {
		const csvContent = "a,b,c\n1,2,3\n4,5,6";
		const tempFilePath = createTempCsvFile(csvContent);

		try {
			const csvInput = fs.readFileSync(tempFilePath, "utf8");
			const { stdout, stderr } = await execFileWithInput(cliPath, ["--delim", ","], csvInput);

			expect(stderr).toBe("");
			expect(stdout).toContain("|   |   |   |");
			expect(stdout).toContain("|---|---|---|");
			expect(stdout).toContain("| a | b | c |");
			expect(stdout).toContain("| 1 | 2 | 3 |");
			expect(stdout).toContain("| 4 | 5 | 6 |");
		} finally {
			cleanupTempFiles(tempFilePath);
		}
	});

	// Test with headers flag
	test("should use first row as headers when --headers flag is used", async () => {
		const csvContent = "a,b,c\n1,2,3\n4,5,6";
		const tempFilePath = createTempCsvFile(csvContent);

		try {
			const csvInput = fs.readFileSync(tempFilePath, "utf8");
			const { stdout, stderr } = await execFileWithInput(cliPath, ["--delim", ",", "--headers"], csvInput);

			expect(stderr).toBe("");
			expect(stdout).toContain("| a | b | c |");
			expect(stdout).toContain("|---|---|---|");
			expect(stdout).toContain("| 1 | 2 | 3 |");
			expect(stdout).toContain("| 4 | 5 | 6 |");

			// The header row should not appear in the data section
			const lines = stdout.trim().split("\n");
			expect(lines.filter(line => line.includes("| a | b | c |")).length).toBe(1);
		} finally {
			cleanupTempFiles(tempFilePath);
		}
	});

	// Test with special delimiter
	test("should handle special delimiter :tab correctly", async () => {
		const csvContent = "a\tb\tc\n1\t2\t3\n4\t5\t6";
		const tempFilePath = createTempCsvFile(csvContent);

		try {
			const csvInput = fs.readFileSync(tempFilePath, "utf8");
			const { stdout, stderr } = await execFileWithInput(cliPath, ["--delim", ":tab"], csvInput);

			expect(stderr).toBe("");
			expect(stdout).toContain("|   |   |   |");
			expect(stdout).toContain("|---|---|---|");
			expect(stdout).toContain("| a | b | c |");
			expect(stdout).toContain("| 1 | 2 | 3 |");
			expect(stdout).toContain("| 4 | 5 | 6 |");
		} finally {
			cleanupTempFiles(tempFilePath);
		}
	});

	// Test with special delimiter :comma
	test("should handle special delimiter :comma correctly", async () => {
		const csvContent = "a,b,c\n1,2,3\n4,5,6";
		const tempFilePath = createTempCsvFile(csvContent);

		try {
			const csvInput = fs.readFileSync(tempFilePath, "utf8");
			const { stdout, stderr } = await execFileWithInput(
				cliPath,
				["--delim", ":comma"],
				csvInput
			);

			expect(stderr).toBe("");
			expect(stdout).toContain("|   |   |   |");
			expect(stdout).toContain("|---|---|---|");
			expect(stdout).toContain("| a | b | c |");
			expect(stdout).toContain("| 1 | 2 | 3 |");
			expect(stdout).toContain("| 4 | 5 | 6 |");
		} finally {
			cleanupTempFiles(tempFilePath);
		}
	});

	// Test with special delimiter :semicolon
	test("should handle special delimiter :semicolon correctly", async () => {
		const csvContent = "a;b;c\n1;2;3\n4;5;6";
		const tempFilePath = createTempCsvFile(csvContent);

		try {
			const csvInput = fs.readFileSync(tempFilePath, "utf8");
			const { stdout, stderr } = await execFileWithInput(
				cliPath,
				["--delim", ":semicolon"],
				csvInput
			);

			expect(stderr).toBe("");
			expect(stdout).toContain("|   |   |   |");
			expect(stdout).toContain("|---|---|---|");
			expect(stdout).toContain("| a | b | c |");
			expect(stdout).toContain("| 1 | 2 | 3 |");
			expect(stdout).toContain("| 4 | 5 | 6 |");
		} finally {
			cleanupTempFiles(tempFilePath);
		}
	});
});

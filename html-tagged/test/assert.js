import * as fs from "node:fs";
import * as path from "node:path";

export * from "node:assert";

const snapshotsDir = path.join(process.cwd(), ".snapshots");
fs.mkdirSync(snapshotsDir, { recursive: true });

export function inlineSnapshot(expected, actual) {
	expected = expected.replace(/\r?\n/g, "\r\n");
	actual = actual.replace(/\r?\n/g, "\r\n");
	if (expected === actual) return;

	const snapshotFile = path.join(snapshotsDir, "" + Date.now() + ".txt");
	fs.writeFileSync(
		snapshotFile,
		"-------- EXPECTED --------\n" +
			expected +
			"\n-------- ACTUAL --------\n" +
			actual,
		"utf-8"
	);

	throw new Error("Bad snapshot: " + snapshotFile);
}

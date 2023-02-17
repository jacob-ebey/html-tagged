import * as fs from "node:fs";
import * as path from "node:path";

const snapshotsDir = path.join(process.cwd(), ".snapshots");
fs.mkdirSync(snapshotsDir, { recursive: true });

const CRLF_REGEX = new RegExp("\r\n", "g");
export function inlineSnapshot(expected, actual) {
	expected = expected.replace(CRLF_REGEX, "\n");
	actual = actual.replace(CRLF_REGEX, "\n");
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

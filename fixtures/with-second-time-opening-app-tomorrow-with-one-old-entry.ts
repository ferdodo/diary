import type { TestContext } from "../types/test-context";
import { bootstrap } from "../utils/bootstrap";
import { withLeftPageWrittenForFirstTime } from "./with-left-page-written-for-first-time";

export async function withSecondTimeOpeningAppTomorrowWithOneOldEntry(
	entryContent = "Hello, there",
): Promise<TestContext> {
	const testContext = await withLeftPageWrittenForFirstTime(
		entryContent,
		"2020/01/01",
	);

	testContext.window.document.body.innerHTML = "";
	bootstrap(testContext.window, "2020/01/02");
	return testContext;
}

import type { TestContext } from "../types/test-context";
import { bootstrap } from "../utils/bootstrap";
import { withLeftPageWrittenForFirstTime } from "./with-left-page-written-for-first-time";

export async function withSecondTimeOpeningSameDayAppWithEntry(
	entryContent = "Hello, there",
): Promise<TestContext> {
	const testContext = await withLeftPageWrittenForFirstTime(entryContent);
	testContext.window.document.body.innerHTML = "";
	bootstrap(testContext.window);
	return testContext;
}

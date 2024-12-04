import { findByDisplayValue } from "@testing-library/dom";
import { asWriterWriteOnLeftPage } from "../automations/as-writer-write-on-left-page";
import type { TestContext } from "../types/test-context";
import { withFirstTimeOpeningApp } from "./with-first-time-opening-app";

export async function withLeftPageWrittenForFirstTime(
	entryContent = "Hello, there",
): Promise<TestContext> {
	const testContext = withFirstTimeOpeningApp();
	await asWriterWriteOnLeftPage(testContext, entryContent);
	const body = testContext.window.document.body;
	await findByDisplayValue(body, entryContent);
	return testContext;
}

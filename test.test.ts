import { findByDisplayValue, findByRole } from "@testing-library/dom";
import { expect, test } from "vitest";
import { withLeftPageWrittenForFirstTime } from "./fixtures/with-left-page-written-for-first-time";
import { withSecondTimeOpeningAppWithEntry } from "./fixtures/with-second-time-opening-app-with-one-entry";

test("opening page a second time should display entry written the first time on left page", async () => {
	const data = Math.random().toString();
	const testContext = await withSecondTimeOpeningAppWithEntry(data);
	const body = testContext.window.document.body;
	await findByDisplayValue(body, data);
});

test("when writing for first time on left page, right page should be empty", async () => {
	const testContext = await withLeftPageWrittenForFirstTime();
	const body = testContext.window.document.body;
	const rightPage = await findByRole(body, "right-page");

	if (!(rightPage instanceof HTMLTextAreaElement)) {
		throw new Error("Right page is not a textarea element !");
	}

	expect(rightPage.value).toBe("");
});

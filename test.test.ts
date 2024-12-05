import { findByDisplayValue, findByRole } from "@testing-library/dom";
import { expect, test } from "vitest";
import { asWriterGoToNextPage } from "./automations/as-writer-go-to-next-page";
import { asWriterGoToPreviousPage } from "./automations/as-writer-go-to-previous-page";
import { asWriterWriteOnLeftPage } from "./automations/as-writer-write-on-left-page";
import { asWriterWriteOnRightPage } from "./automations/as-writer-write-on-right-page";
import { withFirstTimeOpeningApp } from "./fixtures/with-first-time-opening-app";
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

test("write the first entry on the first four pages", async () => {
	const dataPage1 = Math.random().toString();
	const dataPage2 = Math.random().toString();
	const dataPage3 = Math.random().toString();
	const dataPage4 = Math.random().toString();
	const testContext = await withFirstTimeOpeningApp();
	const body = testContext.window.document.body;
	await asWriterWriteOnLeftPage(testContext, dataPage1);
	await asWriterWriteOnRightPage(testContext, dataPage2);
	await asWriterGoToNextPage(testContext);
	await asWriterWriteOnLeftPage(testContext, dataPage3);
	await asWriterWriteOnRightPage(testContext, dataPage4);
	await asWriterGoToPreviousPage(testContext);
	await findByDisplayValue(body, dataPage1);
	await findByDisplayValue(body, dataPage2);
	await asWriterGoToNextPage(testContext);
	await findByDisplayValue(body, dataPage3);
	await findByDisplayValue(body, dataPage4);
});

test("only one next page should becoming editable when editing the current content", async () => {
	const dataPage1 = Math.random().toString();
	const dataPage2 = Math.random().toString();
	const testContext = await withFirstTimeOpeningApp();
	const body = testContext.window.document.body;
	await asWriterWriteOnLeftPage(testContext, dataPage1);
	await asWriterWriteOnLeftPage(testContext, dataPage2);
	await asWriterGoToNextPage(testContext);
	await findByDisplayValue(body, dataPage2);
});

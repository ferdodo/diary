import { findByDisplayValue, findByRole } from "@testing-library/dom";
import { expect, test } from "vitest";
import { asWriterGoToNextPage } from "./automations/as-writer-go-to-next-page";
import { asWriterGoToPreviousPage } from "./automations/as-writer-go-to-previous-page";
import { asWriterWriteOnLeftPage } from "./automations/as-writer-write-on-left-page";
import { asWriterWriteOnRightPage } from "./automations/as-writer-write-on-right-page";
import { withFirstTimeOpeningApp } from "./fixtures/with-first-time-opening-app";
import { withLeftPageWrittenForFirstTime } from "./fixtures/with-left-page-written-for-first-time";
import { withSecondTimeOpeningSameDayAppWithEntry } from "./fixtures/with-second-time-opening-app-same-day-with-one-entry";
import { withSecondTimeOpeningAppTomorrowWithOneOldEntry } from "./fixtures/with-second-time-opening-app-tomorrow-with-one-old-entry";

test("opening page a second time should display entry written the first time on left page", async () => {
	const data = Math.random().toString();
	const testContext = await withSecondTimeOpeningSameDayAppWithEntry(data);
	const body = testContext.window.document.body;
	await findByDisplayValue(body, data);
});

test("when writing for first time on left page, right page should be empty", async () => {
	const testContext = await withLeftPageWrittenForFirstTime();
	const body = testContext.window.document.body;
	const right = (await findByRole(body, "right-page")) as HTMLTextAreaElement;
	expect(right.value).toBe("");
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

test("past days are immutable", async () => {
	const testContext = await withSecondTimeOpeningAppTomorrowWithOneOldEntry();
	const dataPage1 = Math.random().toString();
	const body = testContext.window.document.body;
	const leftPage = (await findByRole(body, "left-page")) as HTMLTextAreaElement;
	const oldValue = leftPage.value;
	await asWriterWriteOnLeftPage(testContext, dataPage1);
	await findByDisplayValue(body, oldValue);
});

test("can't turn a page before the first one", async () => {
	const data = Math.random().toString();
	const testContext = await withLeftPageWrittenForFirstTime(data);
	const body = testContext.window.document.body;
	await asWriterGoToPreviousPage(testContext);
	await findByDisplayValue(body, data);
});

test("new entries are empty", async () => {
	const testContext = await withFirstTimeOpeningApp();
	const body = testContext.window.document.body;
	const left = (await findByRole(body, "left-page")) as HTMLTextAreaElement;
	const right = (await findByRole(body, "right-page")) as HTMLTextAreaElement;
	expect(left.value).toBe("");
	expect(right.value).toBe("");
});

test("on reopening page the same day, no new entry is created for today", async () => {
	const testContext = await withSecondTimeOpeningSameDayAppWithEntry();
	await asWriterWriteOnRightPage(testContext);
	const body = testContext.window.document.body;
	const right = await findByRole(body, "right-page-date");
	expect(right.textContent).toBe("");
});

test("Can write on the left page with a previous entry", async () => {
	const data = Math.random().toString();
	const testContext = await withSecondTimeOpeningAppTomorrowWithOneOldEntry();
	const body = testContext.window.document.body;
	await asWriterWriteOnRightPage(testContext);
	await asWriterGoToNextPage(testContext);
	await asWriterWriteOnLeftPage(testContext, data);
	await findByDisplayValue(body, data);
});

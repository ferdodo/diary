import { fireEvent } from "@testing-library/dom";
import type { TestContext } from "../types/test-context";

export async function asWriterGoToPreviousPage(testContext: TestContext) {
	fireEvent.wheel(testContext.window.document.body, { deltaY: 100 });
}

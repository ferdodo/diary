import { findByRole, fireEvent } from "@testing-library/dom";
import type { TestContext } from "../types/test-context";

export async function asWriterWriteOnLeftPage(
	testContext: TestContext,
	value = "Hello, world!",
) {
	const leftPage = await findByRole(
		testContext.window.document.body,
		"left-page",
	);

	if (leftPage instanceof HTMLTextAreaElement) {
		fireEvent.change(leftPage, { target: { value } });
	}
}

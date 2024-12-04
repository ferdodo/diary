import { Window as HappyWindow } from "happy-dom";
import type { TestContext } from "../types/test-context";
import { bootstrap } from "../utils/bootstrap";
import { readAllEntries } from "../utils/read-all-entries";

export function withFirstTimeOpeningApp(): TestContext {
	const window = new HappyWindow() as unknown as Window;
	bootstrap(window);
	const entries = readAllEntries(window);

	if (entries.length !== 0) {
		throw new Error(
			"On first time opening app, there should be no entries in the diary !",
		);
	}

	return { window };
}

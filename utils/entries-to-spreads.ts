import type { Entry } from "../types/entry";
import type { Page } from "../types/page";
import type { Spread } from "../types/spread";

export function entriesToSpreads(entries: Entry[]): Spread[] {
	const spreads: Spread[] = [];

	for (const { contents, day } of entries) {
		let dayPrinted = false;

		for (const content of contents) {
			const page: Page = { day: dayPrinted ? "" : day, content };
			dayPrinted = true;

			const lastSpread = spreads[spreads.length - 1];

			if (lastSpread && !lastSpread?.[1]?.content) {
				lastSpread[1] = page;
			} else {
				spreads.push([page, { day: "", content: "" }]);
			}
		}
	}

	return spreads;
}

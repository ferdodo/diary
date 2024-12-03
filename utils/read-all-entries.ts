import type { Entry } from "../types/entry";

export function readAllEntries(): Entry[] {
	const entriesJSON = localStorage.getItem("entries");

	if (!entriesJSON) {
		return [];
	}

	return JSON.parse(entriesJSON);
}

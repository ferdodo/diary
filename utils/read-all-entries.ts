import type { Entry } from "../types/entry";

export function readAllEntries(window: Window): Entry[] {
	const entriesJSON = window.localStorage.getItem("entries");

	if (!entriesJSON) {
		return [];
	}

	return JSON.parse(entriesJSON);
}

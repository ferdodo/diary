import type { Entry } from "../types/entry";

export function saveAllEntries(window: Window, entries: Entry[]) {
	window.localStorage.setItem("entries", JSON.stringify(entries));
}

import type { Entry } from "../types/entry";

export function saveAllEntries(entries: Entry[]) {
	localStorage.setItem("entries", JSON.stringify(entries));
}

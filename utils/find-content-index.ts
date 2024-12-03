import type { Entry } from "../types/entry";

function arrayChunk<T>(array: T[], size: number): T[][] {
	const chunked = [];

	for (let i = 0; i < array.length; i += size) {
		chunked.push(array.slice(i, i + size));
	}

	return chunked;
}

export function findContentIndex(
	spreadIndex: number,
	rightPage: boolean,
	entries: Entry[],
): [number, number] {
	let entryIndex = 0;
	let contentIndex = 0;
	let currentIndex = 0;
	const entryIndexByContent = entries.flatMap((entry, entryI) =>
		entry.contents.map(() => entryI),
	);

	const spreadedContent = arrayChunk(entryIndexByContent, 2);

	let currentEntryIndex = 0;
	const targetContent = spreadIndex * 2 + (rightPage ? 1 : 0);

	for (const entryIndex of entryIndexByContent) {
		if (currentEntryIndex !== entryIndex) {
			contentIndex = 0;
			currentEntryIndex = entryIndex;
		}

		if (currentIndex === targetContent) {
			break;
		}

		contentIndex++;
		currentIndex++;
	}

	for (const [
		index,
		[entryIndexLeft, entryIndexRight],
	] of spreadedContent.entries()) {
		if (index === spreadIndex) {
			if (rightPage) {
				entryIndex = entryIndexRight;
			} else {
				entryIndex = entryIndexLeft;
			}
		}
	}

	if (entryIndex === undefined) {
		entryIndex = entries.length;
	}

	return [entryIndex, contentIndex];
}

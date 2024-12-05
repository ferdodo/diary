import { configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Entry } from "./types/entry";
import { entriesToSpreads } from "./utils/entries-to-spreads";
import { findContentIndex } from "./utils/find-content-index";

interface DiaryState {
	spreadIndex: number;
	entries: Entry[];
	today: string;
}

export function createCurrentSpreadSelector() {
	return createSelector([(state: DiaryState) => state], (state: DiaryState) => {
		const spreads = entriesToSpreads(state.entries);
		const spread = spreads[state.spreadIndex];

		return (
			spread || [
				{ day: "", content: "" },
				{ day: "", content: "" },
			]
		);
	});
}

export function createEntriesSlice() {
	return createSlice({
		name: "entriesSlice",
		initialState: <DiaryState>{
			spreadIndex: 0,
			entries: [],
			today: "1970/01/01",
		},
		reducers: {
			initEntries(
				_state,
				action: PayloadAction<{ entries: Entry[]; today: string }>,
			) {
				const { entries, today } = action.payload;
				const spreads = entriesToSpreads(entries);
				const spreadIndex = Math.max(0, spreads.length - 1);
				const lastEntry = entries[entries.length - 1];

				if (lastEntry?.day !== today) {
					entries.push({ day: today, contents: [""] });
				}

				return { entries, spreadIndex, today };
			},
			turnNextPage(state, _action: PayloadAction<void>) {
				const spreads = entriesToSpreads(state.entries);
				const lastRightPageEmpty = !spreads[spreads.length - 1][1].content;

				if (
					state.spreadIndex <
					(lastRightPageEmpty ? spreads.length - 1 : spreads.length)
				) {
					state.spreadIndex++;
				}
			},
			turnPreviousPage(state, _action: PayloadAction<void>) {
				if (state.spreadIndex > 0) {
					state.spreadIndex--;
				}
			},
			writePage(
				state,
				action: PayloadAction<{ rightSide: boolean; content: string }>,
			) {
				const { rightSide, content } = action.payload;
				const { entries, spreadIndex, today } = state;

				const [entryIndex, contentIndex] = findContentIndex(
					spreadIndex,
					rightSide,
					entries,
				);

				if (entries[entryIndex]?.day === today) {
					if (!entries[entryIndex]) {
						entries[entryIndex] = { day: "", contents: [] };
					}

					entries[entryIndex].contents[contentIndex] = content;
				}
			},
		},
	});
}

export function createStore() {
	const slice = createEntriesSlice();

	return configureStore({
		reducer: slice.reducer,
	});
}

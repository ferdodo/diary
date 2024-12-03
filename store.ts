import { configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Entry } from "./types/entry";
import { entriesToSpreads } from "./utils/entries-to-spreads";
import { findContentIndex } from "./utils/find-content-index";
import { getTodayDate } from "./utils/get-today-date";

interface DiaryState {
	spreadIndex: number;
	entries: Entry[];
}

const slice = createSlice({
	name: "entriesSlice",
	initialState: <DiaryState>{
		spreadIndex: 0,
		entries: [],
	},
	reducers: {
		initEntries(_state, action: PayloadAction<Entry[]>) {
			const entries = action.payload;
			const spreads = entriesToSpreads(entries);
			const spreadIndex = Math.max(0, spreads.length - 1);

			const lastEntry = entries[entries.length - 1];

			if (lastEntry?.day !== getTodayDate()) {
				entries.push({ day: getTodayDate(), contents: [""] });
			}

			return { entries, spreadIndex };
		},
		turnNextPage(state, _action: PayloadAction<void>) {
			const spreads = entriesToSpreads(state.entries);

			if (state.spreadIndex < spreads.length - 1) {
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
			const { entries, spreadIndex } = state;

			const [entryIndex, contentIndex] = findContentIndex(
				spreadIndex,
				rightSide,
				entries,
			);

			if (entries[entryIndex]?.day === getTodayDate()) {
				if (!entries[entryIndex]) {
					entries[entryIndex] = { day: "", contents: [] };
				}

				if (entries[entryIndex].contents[contentIndex] === undefined) {
					entries[entryIndex].contents[contentIndex] = "";
				}

				if (contentIndex === entries[entryIndex].contents.length - 1) {
					entries[entryIndex].contents.push("");
				}

				entries[entryIndex].contents[contentIndex] = content;
			}
		},
	},
});

export const currentSpread = createSelector(
	[(state) => state],
	(state: DiaryState) => {
		const spreads = entriesToSpreads(state.entries);
		const spread = spreads[state.spreadIndex];
		return spread;
	},
);

export const { initEntries, turnNextPage, turnPreviousPage, writePage } =
	slice.actions;

export const store = configureStore({
	reducer: slice.reducer,
});

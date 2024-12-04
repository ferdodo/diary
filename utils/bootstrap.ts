import { html } from "htm/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Diary } from "../components/diary";
import { createEntriesSlice, createStore } from "../store";
import { getTodayDate } from "./get-today-date";
import { readAllEntries } from "./read-all-entries";
import { saveAllEntries } from "./save-all-entries";

export function bootstrap(window: Window, today = getTodayDate()) {
	const div = window.document.createElement("div");
	div.className = "app";
	window.document.body.appendChild(div);
	const root = createRoot(div);
	const initialEntries = readAllEntries(window);
	const store = createStore();
	const slice = createEntriesSlice();
	const { initEntries, turnNextPage, turnPreviousPage } = slice.actions;
	store.dispatch(initEntries({ entries: initialEntries, today }));

	store.subscribe(() => {
		saveAllEntries(window, store.getState().entries);
	});

	window.addEventListener("wheel", (event) => {
		if (event.deltaY < 0) {
			store.dispatch(turnNextPage());
		} else {
			store.dispatch(turnPreviousPage());
		}
	});

	root.render(html`
        <${Provider} store=${store}>
            <${Diary} />
        </${Provider}>
    `);
}

import { html } from "htm/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Diary } from "./components/diary";
import { initEntries, store, turnNextPage, turnPreviousPage } from "./store";
import { readAllEntries } from "./utils/read-all-entries";
import { saveAllEntries } from "./utils/save-all-entries";

const div = document.createElement("div");
div.className = "app";
document.body.appendChild(div);
const root = createRoot(div);
const initialEntries = readAllEntries();
store.dispatch(initEntries(initialEntries));

store.subscribe(() => {
	saveAllEntries(store.getState().entries);
});

document.addEventListener("wheel", (event) => {
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

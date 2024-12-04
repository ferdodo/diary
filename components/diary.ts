import { html } from "htm/react";
import type { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCurrentSpreadSelector, createEntriesSlice } from "../store";

export function Diary() {
	const [leftPage, rightPage] = useSelector(createCurrentSpreadSelector());
	const dispatch = useDispatch();
	const slice = createEntriesSlice();
	const writePage = slice.actions.writePage;

	return html`
		<div className="book">
			<section className="page left-page">
				<h6>${leftPage?.day}</h6>
				<textarea
					role="left-page"
					value=${leftPage?.content}
					spellCheck="false"
					onChange=${(e: ChangeEvent<HTMLInputElement>) => dispatch(writePage({ rightSide: false, content: e.target.value }))} />
			</section>

			<section className="page right-page">
				<h6>${rightPage?.day}</h6>
				<textarea
					role="right-page"
					value=${rightPage?.content}
					spellCheck="false"
					onChange=${(e: ChangeEvent<HTMLInputElement>) => dispatch(writePage({ rightSide: true, content: e.target.value }))} />
			</section>
		</div>
	`;
}

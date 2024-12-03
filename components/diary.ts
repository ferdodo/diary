import { html } from "htm/react";
import type { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { currentSpread, writePage } from "../store";

export function Diary() {
	const [leftPage, rightPage] = useSelector(currentSpread);
	const dispatch = useDispatch();

	return html`
		<div className="book">
			<section className="page left-page">
				<h6>${leftPage?.day}</h6>
				<textarea
					value=${leftPage?.content}
					spellCheck="false"
					onChange=${(e: ChangeEvent<HTMLInputElement>) => dispatch(writePage({ rightSide: false, content: e.target.value }))} />
			</section>

			<section className="page right-page">
				<h6>${rightPage?.day}</h6>
				<textarea
					value=${rightPage?.content}
					spellCheck="false"
					onChange=${(e: ChangeEvent<HTMLInputElement>) => dispatch(writePage({ rightSide: true, content: e.target.value }))} />
			</section>
		</div>
	`;
}

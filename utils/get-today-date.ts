export function getTodayDate(): string {
	const today = new Date();
	const date = today.getDate();
	const month = today.getMonth();
	const year = today.getFullYear();
	return `${year}/${month}/${date}`;
}

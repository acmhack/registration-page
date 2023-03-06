export function calculateRemainingTime(): [number, number, number, number] {
	const remainingTime = (new Date(2023, 3, 9, 12).valueOf() - Date.now()) / 1000;

	const seconds = Math.floor(remainingTime % 60);
	const minutes = Math.floor(remainingTime / 60) % 60;
	const hours = Math.floor(remainingTime / 3600) % 24;
	const days = Math.floor(remainingTime / (3600 * 24));

	return [days, hours, minutes, seconds];
}


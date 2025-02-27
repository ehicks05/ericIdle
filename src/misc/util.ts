export function round(value: number, places: number) {
	const multiplier = 10 ** places;
	return Math.round(value * multiplier) / multiplier;
}

/**
 * `thisIsCool` -> `This Is Cool`
 */
export function camelToTitle(value: string) {
	const result = value.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
}

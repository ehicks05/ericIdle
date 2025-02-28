import {
	DAYS_IN_SEASON,
	DAYS_IN_YEAR,
	SEASONS,
	TICKS_PER_DAY,
} from "@/constants/calendar";
import { useGame } from "..";

export const countTick = () => {
	useGame.setState(({ game }) => {
		game.tickCount += 1;
	});
};

export const getCalendar = (_tick?: number) => {
	const { tickCount } = useGame.getState().game;

	const tick = _tick === undefined ? tickCount : _tick;

	const day = Math.floor(tick / TICKS_PER_DAY);

	const year = Math.floor(day / DAYS_IN_YEAR);
	const dayOfYear = day - year * DAYS_IN_YEAR;
	const seasonIndex = Math.floor(dayOfYear / DAYS_IN_SEASON);
	const dayOfSeason = dayOfYear - seasonIndex * DAYS_IN_SEASON;

	const season = SEASONS[seasonIndex];

	return { tick, year, dayOfYear, season, dayOfSeason: dayOfSeason + 1 };
};

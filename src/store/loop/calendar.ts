import { DAYS_IN_SEASON, DAYS_IN_YEAR, SEASONS } from "@/constants/calendar";
import { useGame } from "..";

export const countTick = () => {
	useGame.setState(({ game }) => {
		game.tickCount += 1;
	});
};

export const getCalendar = () => {
	const { tickCount } = useGame.getState().game;

	const year = Math.floor(tickCount / DAYS_IN_YEAR);
	const dayOfYear = tickCount - year * DAYS_IN_YEAR;
	const seasonIndex = Math.floor(dayOfYear / DAYS_IN_SEASON);
	const dayOfSeason = dayOfYear - seasonIndex * DAYS_IN_SEASON;

	const season = SEASONS[seasonIndex];

	return { tickCount, year, dayOfYear, season, dayOfSeason: dayOfSeason + 1 };
};

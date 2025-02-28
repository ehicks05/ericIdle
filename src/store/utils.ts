import { TICKS_PER_SECOND } from "@/constants/gameSpeed";
import { useGame } from ".";

// Villager
export const updateVillagerCount = (amount: number) => {
	useGame.setState(({ game }) => {
		game.resources.villagers.amount += amount;
	});
};

/**
 * Returns the probability `p` needed so that you have a 50% chance of success
 * after `expectedTrials`.
 */
const getP = (expectedTrials: number) => {
	return 0.7 / expectedTrials;
};

/**
 * Find `p` such that a 50% overall chance of success is expected after
 * `seconds` seconds, assuming one trial per tick.
 */
export const getPByTime = (seconds: number) => {
	const expectedTrials = seconds * TICKS_PER_SECOND;
	return getP(expectedTrials);
};

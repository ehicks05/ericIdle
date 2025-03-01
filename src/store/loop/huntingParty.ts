import { FOOD_EATEN_PER_SECOND } from "@/constants/game";
import { incrementResource, useGame } from "..";
import { createEvent, getPByTime } from "../utils";

export const SECONDS_PER_HUNT = 30;

const rand = (from: number, to: number) => {
	const low = Math.min(from, to);
	const high = Math.max(from, to);
	return low + Math.random() * (high - low);
};

const huntingPartyFood = () => {
	const hunterCount = useGame.getState().game.jobs.hunters.amount;
	const baseFoodPerHunter = FOOD_EATEN_PER_SECOND * 1.2;
	const randomFactor = rand(0.8, 1.2);
	return baseFoodPerHunter * SECONDS_PER_HUNT * hunterCount * randomFactor;
};

const handleHuntingPartyReturn = () => {
	const foodFound = huntingPartyFood();

	incrementResource("food", foodFound);

	useGame.setState(({ game }) => {
		game.isHuntingPartyActive = false;

		const event = createEvent(`Hunters find ${foodFound.toFixed(2)} food`);
		game.log = [event, ...game.log];
		game.huntingPartyReturnedAt = Date.now();
	});
};

export const checkHuntingParty = () => {
	const isHunters = useGame.getState().game.jobs.hunters.amount > 0;

	if (isHunters) {
		useGame.setState(({ game }) => {
			game.isHuntingPartyActive = true;
		});

		const rand = Math.random();
		const p = getPByTime(SECONDS_PER_HUNT);

		if (rand < p) {
			handleHuntingPartyReturn();
		}
	} else {
		useGame.setState(({ game }) => {
			game.isHuntingPartyActive = false;
		});
	}
};

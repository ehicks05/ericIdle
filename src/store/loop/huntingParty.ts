import { TICKS_PER_SECOND } from "@/constants/gameSpeed";
import { incrementResource, useGame } from "..";
import { FOOD_EATEN_PER_SECOND } from "@/constants/game";

const hasHuntingPartyReturned = () => {
	const {
		game: {
			jobs: { hunters },
			isHuntingPartyActive,
			huntingPartyReturnedAt,
		},
	} = useGame.getState();

	// wait at least 5 seconds
	const msSinceLastEvent = Date.now() - huntingPartyReturnedAt;
	if (msSinceLastEvent < 5000) return false;

	const isHunters = hunters.amount > 0;
	if (!isHunters) {
		return false;
	}

	if (isHuntingPartyActive === false) {
		useGame.setState(({ game }) => {
			game.isHuntingPartyActive = true;
			game.huntingPartyReturnedAt = Date.now();
		});
	}

	const rand = Math.random() / TICKS_PER_SECOND;
	return rand < 0.002;
};

const handleHuntingPartyReturn = () => {
	const { jobs } = useGame.getState().game;
	const hunterCount = jobs.hunters.amount;

	const baseFoodPerHunter = FOOD_EATEN_PER_SECOND * 1.2;
	const expectedSecondsPerHunt = 30;
	const randomFactor = 0.8 + Math.random() * 0.4;
	const huntingPartyFood =
		baseFoodPerHunter * expectedSecondsPerHunt * hunterCount * randomFactor;

	incrementResource("food", huntingPartyFood);

	useGame.setState(({ game }) => {
		game.isHuntingPartyActive = false;

		const event = {
			date: new Date().getTime(),
			text: `${hunterCount} hunters returned with ${huntingPartyFood.toFixed(2)} food`,
		};
		game.log = [event, ...game.log];
	});
};

export const checkHuntingParty = () => {
	if (hasHuntingPartyReturned()) {
		handleHuntingPartyReturn();
	}
};

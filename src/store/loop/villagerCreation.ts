import { useGame } from "..";
import { createEvent, getPByTime } from "../utils";

const VILLAGER_CREATION_SECONDS = import.meta.env.DEV ? 3 : 30;

const { max, min, round } = Math;

const isPopulationGrowing = () => {
	const { villagers, food } = useGame.getState().game.resources;

	const isRoom = villagers.amount < villagers.limit;
	const isFood = food.amount > 0;

	return isRoom && isFood;
};

const getVillagersToCreate = () => {
	const { villagers } = useGame.getState().game.resources;
	const spacesAvailable = villagers.limit - villagers.amount;

	return max(min(round(villagers.amount / 50), spacesAvailable), 1);
};

const createVillager = () => {
	const villagersToCreate = getVillagersToCreate();

	useGame.setState(({ game }) => {
		game.resources.villagers.amount += villagersToCreate;
		game.jobs[game.defaultJob].amount += villagersToCreate;

		const event = createEvent(
			`${villagersToCreate} ${villagersToCreate === 1 ? "villager joins" : "villagers join"} the community`,
		);
		game.log = [event, ...game.log];
		game.villagerCreatedAt = Date.now();
	});
};

export const checkVillagerCreation = () => {
	if (isPopulationGrowing()) {
		useGame.setState(({ game }) => {
			game.isIncomingVillager = true;
		});

		const rand = Math.random();
		const p = getPByTime(VILLAGER_CREATION_SECONDS);
		if (rand < p) {
			createVillager();
		}
	} else {
		useGame.setState(({ game }) => {
			game.isIncomingVillager = false;
		});
	}
};

import { TICKS_PER_SECOND } from "@/constants/gameSpeed";
import { useGame } from "..";
import { updateVillagerCount } from "../utils";

export const addWorker = (amount: number) => {
	useGame.setState(({ game }) => {
		game.jobs[game.defaultJob].amount += amount;
	});
};

const hasVillagerArrived = () => {
	const {
		game: {
			resources: { villagers, food },
			isIncomingVillager,
			villagerCreatedAt,
		},
	} = useGame.getState();

	// wait at least 5 seconds
	const msSinceLastEvent = Date.now() - villagerCreatedAt;
	if (msSinceLastEvent < 5000) return false;

	const isRoom = villagers.amount < villagers.limit;
	const isFood = food.amount >= 1;

	if (isRoom && isFood) {
		if (isIncomingVillager === false) {
			useGame.setState(({ game }) => {
				game.isIncomingVillager = true;
				game.villagerCreatedAt = Date.now();
			});
		}

		const rand = Math.random() / TICKS_PER_SECOND;
		return rand < 0.002;
	}
	return false;
};

const createVillager = () => {
	const { villagers } = useGame.getState().game.resources;
	const spacesAvailable = villagers.limit - villagers.amount;

	const { max, min, floor, sqrt } = Math;
	const villagersToCreate = max(
		min(floor(sqrt(villagers.amount)) - 1, spacesAvailable),
		1,
	);

	updateVillagerCount(villagersToCreate);
	addWorker(villagersToCreate);

	useGame.setState(({ game }) => {
		game.isIncomingVillager = false;

		const event = {
			date: new Date().getTime(),
			text: `${villagersToCreate} villager${villagersToCreate !== 1 ? "s" : ""} joined the community`,
		};
		game.log = [event, ...game.log];
	});
};

export const checkVillagerCreation = () => {
	if (hasVillagerArrived()) {
		createVillager();
	}
};

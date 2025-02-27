import { MS_PER_TICK } from "@/constants/gameSpeed";
import { useGame } from "..";
import { updateVillagerCount } from "../utils";

export const addWorker = (amount: number) => {
	useGame.setState(({ game }) => {
		game.jobs[game.defaultJob].amount += amount;
	});
};

export const isCreateVillager = () => {
	const {
		game: {
			resources: { villagers, food },
			isIncomingVillager,
			villagerCreatedAt,
		},
	} = useGame.getState();

	// wait at least 5 seconds
	const msSinceLastVillager = Date.now() - villagerCreatedAt;
	if (msSinceLastVillager < 5000) return false;

	const isRoom = villagers.amount < villagers.limit;
	const isFood = food.amount >= 1;

	if (isRoom && isFood) {
		if (isIncomingVillager === false) {
			useGame.setState(({ game }) => {
				game.isIncomingVillager = true;
				game.villagerCreatedAt = Date.now();
			});
		}

		const ticksPerSecond = 1000 / MS_PER_TICK;

		const rand = Math.random() / ticksPerSecond;
		return rand < 0.01;
	}
	return false;
};

export const createVillager = () => {
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
	});
};

import { FOOD_EATEN_PER_SECOND } from "@/constants/game";
import { SECONDS_PER_TICK } from "@/constants/gameSpeed";
import type { Game } from "@/constants/types";
import { incrementResource, useGame } from "../index";
import { updateVillagerCount } from "../utils";

const removeWorkers = (_count: number) => {
	const { game } = useGame.getState();

	let count = _count;

	while (count > 0) {
		const jobName =
			game.jobs.idlers.amount > 0
				? "idlers"
				: Object.values(game.jobs).find((job) => job.amount > 0)?.name;

		if (jobName) {
			useGame.setState(({ game }) => {
				game.jobs[jobName].amount -= 1;
			});
		}

		count--;
	}
};

export const updateResources = () => {
	const { game } = useGame.getState();

	// apply production and bonuses
	Object.values(game.resources).forEach((resource) => {
		let additiveMod = 0;
		Object.values(game.jobs).forEach((job) => {
			job.production
				.filter((production) => production.resource === resource.name)
				.forEach((production) => {
					additiveMod += job.amount * production.amount;
				});
		});

		let multiplicativeMod = 1;
		Object.values(game.buildings).forEach((building) => {
			building.bonus
				.filter((bonus) => bonus.resource === resource.name)
				.forEach((bonus) => {
					multiplicativeMod += building.amount * bonus.amount;
				});
		});

		// villagers gotta eat
		const foodConsumption =
			resource.name === "food"
				? FOOD_EATEN_PER_SECOND * game.resources.villagers.amount
				: 0;

		const newRate = additiveMod * multiplicativeMod - foodConsumption;

		useGame.setState(({ game }) => {
			game.resources[resource.name].rate = newRate;
		});

		incrementResource(
			resource.name as keyof Game["resources"],
			// apply rate per tick
			newRate * SECONDS_PER_TICK,
		);
	});

	// handle starvation
	if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0) {
		const foodDeficit = -game.resources.food.amount;
		const deaths = Math.ceil(foodDeficit / FOOD_EATEN_PER_SECOND);

		updateVillagerCount(-deaths);
		removeWorkers(deaths);
		incrementResource("food", deaths * FOOD_EATEN_PER_SECOND);

		useGame.setState(({ game }) => {
			const event = {
				date: new Date().getTime(),
				text: `${deaths} villager${deaths !== 1 ? "s" : ""} starved`,
			};
			game.log = [event, ...game.log];
		});
	}

	const workerCount = Object.values(game.jobs).reduce(
		(sum, job) => sum + job.amount,
		0,
	);

	// more workers than villagers
	const extraWorkers = workerCount - game.resources.villagers.amount;
	if (extraWorkers > 0) {
		removeWorkers(extraWorkers);
	}
};

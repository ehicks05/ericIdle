import type { Game } from "@/constants/types";
import { incrementResource, useGame } from "../index";
import { updateVillagerCount } from "../utils";

const removeWorker = () => {
	const { game } = useGame.getState();

	const jobName =
		game.jobs.idlers.amount > 0
			? "idlers"
			: Object.values(game.jobs).find((job) => job.amount > 0)?.name;

	if (jobName) {
		useGame.setState(({ game }) => {
			game.jobs[jobName].amount -= 1;
		});
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
			resource.name === "food" ? 0.045 * game.resources.villagers.amount : 0;

		const newRate = additiveMod * multiplicativeMod - foodConsumption;

		useGame.setState(({ game }) => {
			game.resources[resource.name].rate = newRate;
		});

		incrementResource(
			resource.name as keyof Game["resources"],
			// apply rate per tick
			newRate * (200 / 1000),
		);
	});

	// handle starvation
	if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0) {
		updateVillagerCount(-1);
		removeWorker();
		incrementResource("food", 0.05);
	}

	const workerCount = Object.values(game.jobs).reduce(
		(sum, job) => sum + job.amount,
		0,
	);

	// more workers than villagers
	if (workerCount > game.resources.villagers.amount) {
		removeWorker();
	}
};

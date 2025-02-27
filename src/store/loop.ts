import { MS_PER_TICK } from "@/constants/gameSpeed";
import type { Game } from "@/constants/types";
import { canAfford, incrementResource, useGame } from ".";
import { addWorker, removeWorker, updateVillagerCount } from "./utils";

export const doGameTick = () => {
	checkProgress();
	updateResourceLimits();
	updateResources();
	if (isCreateVillager()) {
		createVillager();
	}
};

const checkProgress = () => {
	const { game } = useGame.getState();

	Object.values(game.progress)
		.filter((progress) => progress.goal && !progress.unlocked)
		.forEach((progress) => {
			const goal = progress.goal;

			const shouldUnlock =
				"technology" in goal
					? game.technologies[goal.technology].discovered
					: canAfford({ cost: [goal] });

			if (shouldUnlock) {
				useGame.setState(({ game }) => {
					game.progress[progress.name].unlocked = true;
				});

				applyProgress(progress.name);
			}
		});
};

// go through every game object, looking for ones whose prereq = this progressObject. Make it visible
// todo: consider what happens if you have multiple prereqs
const applyProgress = (progressName: string) => {
	const { game } = useGame.getState();

	Object.values(game.resources)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.resources[o.name].status = "visible";
			}),
		);
	Object.values(game.buildings)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.buildings[o.name].status = "visible";
			}),
		);
	Object.values(game.jobs)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.jobs[o.name].status = "visible";
			}),
		);
	Object.values(game.technologies)
		.filter((o) => o.prereq === progressName)
		.forEach((o) =>
			useGame.setState(({ game }) => {
				game.technologies[o.name].status = "visible";
			}),
		);
};

const updateResourceLimits = () => {
	const { game } = useGame.getState();

	Object.values(game.resources).forEach((resource) => {
		let multiplicativeMod = 1;
		let additiveMod = 0;
		Object.values(game.buildings)
			.filter((building) => building.resourceLimitModifier)
			.forEach((building) => {
				building.resourceLimitModifier
					.filter(
						(resourceLimitMod) => resourceLimitMod.resource === resource.name,
					)
					.forEach((resourceLimitMod) => {
						if (resourceLimitMod.type === "mult")
							multiplicativeMod += building.amount * resourceLimitMod.amount;
						if (resourceLimitMod.type === "add")
							additiveMod += building.amount * resourceLimitMod.amount;
					});
			});

		const newLimit = (resource.baseLimit + additiveMod) * multiplicativeMod;

		useGame.setState(({ game }) => {
			game.resources[resource.name].limit = newLimit;
		});
	});
};

const updateResources = () => {
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

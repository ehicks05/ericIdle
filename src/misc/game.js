import { MS_PER_TICK } from "../constants/gameSpeed.ts";
import { myRound } from "./util";

export const doGameTick = (game, updateGame) => {
	checkProgress(game, updateGame);
	updateResourceLimits(game, updateGame);
	updateResources(game, updateGame);
	if (isCreateVillager(game, updateGame)) createVillager(game, updateGame);
};

const checkProgress = (game, updateGame) => {
	Object.values(game.progress)
		.filter(
			(progress) => progress.requirement && !progress.requirement.unlocked,
		)
		.forEach((progress) => {
			const requirement = progress.requirement;

			const unlockIt =
				(requirement.resource &&
					game.resources[requirement.resource].amount >= requirement.amount) ||
				(requirement.technology &&
					game.technologies[requirement.technology].discovered);

			if (unlockIt) {
				updateGame((draft) => {
					draft.progress[progress.name].unlocked = true;
					return;
				});
				applyProgress(game, updateGame, progress.name);
			}
		});
};

// go through every game object, looking for ones whose prereq = this progressObject. Make it visible
// todo: consider what happens if you have multiple prereqs
const applyProgress = (game, updateGame, progressObject) => {
	Object.entries(game).forEach(([categoryKey, category]) => {
		Object.entries(category)
			.filter(([gameObjectKey, gameObject]) => typeof gameObject === "object")
			.forEach(([gameObjectKey, gameObject]) => {
				if (gameObject.prereq === progressObject)
					updateGame((draft) => {
						draft[categoryKey][gameObjectKey].status = "visible";
						return;
					});
			});
	});
};

const updateResourceLimits = (game, updateGame) => {
	Object.entries(game.resources).forEach(([resourceKey, resource]) => {
		let multiplicativeMod = 0;
		let additiveMod = 0;
		Object.values(game.buildings)
			.filter((building) => building.resourceLimitModifier)
			.forEach((building) => {
				building.resourceLimitModifier
					.filter(
						(resourceLimitMod) => resourceLimitMod.resource === resource.name,
					)
					.forEach((resourceLimitMod) => {
						if (resourceLimitMod.type === "multi")
							multiplicativeMod += building.amount * resourceLimitMod.amount;
						if (resourceLimitMod.type === "additive")
							additiveMod += building.amount * resourceLimitMod.amount;
					});
			});

		const newLimit =
			(resource.baseLimit + additiveMod) * (1 + multiplicativeMod);
		updateGame((draft) => {
			draft.resources[resourceKey].limit = newLimit;
			return;
		});
	});
};

const updateResources = (game, updateGame) => {
	Object.values(game.resources).forEach((resource) => {
		let multiplicativeMod = 0;
		Object.values(game.buildings).forEach((building) => {
			building.bonus.forEach((bonus) => {
				if (bonus.resource === resource.name)
					multiplicativeMod += building.amount * bonus.amount;
			});
		});

		let additiveMod = 0;
		Object.values(game.jobs).forEach((job) => {
			job.production?.forEach((production) => {
				if (production.resource === resource.name)
					additiveMod += job.amount * production.amount;
			});
		});

		let newRate = additiveMod * (1 + multiplicativeMod);

		// villagers gotta eat
		if (resource.name === "food")
			newRate = newRate - 0.045 * game?.resources?.villagers?.amount;

		updateGame((draft) => {
			draft.resources[resource.name].rate = newRate;
			return;
		});
		updateResource(game, updateGame, resource.name, newRate * (200 / 1000)); // apply rate per tick
	});

	// Starvation
	if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0) {
		updateVillagerCount(game, updateGame, -1);
		removeWorker(game, updateGame);
		updateResource(game, updateGame, "food", 0.05); // ...
	}

	const workerCount = Object.values(game.jobs).reduce(
		(sum, job) => sum + job.amount,
		0,
	);

	// more workers than villagers
	if (workerCount > game.resources.villagers.amount)
		removeWorker(game, updateGame);
};

export const updateResource = (game, updateGame, name, amount) => {
	updateGame((draft) => {
		const newAmount = Math.min(
			myRound(draft.resources[name].amount + amount, 4),
			draft.resources[name].limit,
		);
		draft.resources[name].amount = newAmount;
		return;
	});
};

const createVillager = (game, updateGame) => {
	const spacesAvailable =
		game.resources.villagers.limit - game.resources.villagers.amount;

	let villagersToCreate =
		Math.floor(Math.sqrt(game.resources.villagers.amount)) - 1;
	villagersToCreate = Math.min(villagersToCreate, spacesAvailable);
	if (villagersToCreate < 1) villagersToCreate = 1;

	updateVillagerCount(game, updateGame, villagersToCreate);
	addWorker(game, updateGame, villagersToCreate);
	updateGame((draft) => {
		draft.isIncomingVillager = false;
		return;
	});
};

// Villager
export const updateVillagerCount = (game, updateGame, amount) => {
	updateGame((draft) => {
		draft.resources.villagers.amount += amount;
		return;
	});
};

// Worker
export const addWorker = (game, updateGame, amount) => {
	updateGame((draft) => {
		draft.jobs[game.defaultJob].amount += amount;
		return;
	});
};

export const removeWorker = (game, updateGame) => {
	if (game.jobs.idlers.amount > 0) {
		updateGame((draft) => {
			draft.jobs.idlers.amount -= 1;
			return;
		});
		return;
	}

	const job = Object.values(game.jobs).find((job) => job.amount > 0);
	if (job)
		updateGame((draft) => {
			draft.jobs[job.name].amount -= 1;
			return;
		});
};

export const setDefaultJob = (game, updateGame, job) => {
	updateGame((draft) => {
		draft.defaultJob = job;
		return;
	});
};

export const assignJob = (game, updateGame, name, amount) => {
	updateGame((draft) => {
		if (amount > 0 && draft.jobs.idlers.amount >= amount) {
			draft.jobs[name].amount += amount;
			draft.jobs.idlers.amount -= amount;
		} else if (amount < 0 && draft.jobs[name].amount >= amount) {
			draft.jobs[name].amount += amount;
			draft.jobs.idlers.amount -= amount;
		}
		return;
	});
};

export const isCreateVillager = (game, updateGame) => {
	const isVillagerCreationPossible =
		game.resources.villagers.amount < game.resources.villagers.limit &&
		game.resources.food.amount > 0;
	if (isVillagerCreationPossible) {
		if (game.isIncomingVillager === false) {
			updateGame((draft) => {
				draft.isIncomingVillager = true;
				draft.villagerCreatedAt = Date.now();
				return;
			});
		}

		const msSinceLastVillager = Date.now() - game.villagerCreatedAt;

		const rand = Math.random() * (20000 * (1000 / MS_PER_TICK));
		return rand < msSinceLastVillager;
	}
	return false;
};

// todo this also handles technology cost
export const getBuildingCost = (building) => {
	const scalingFactor = building.name === "huts" ? 1.14 : 1.07;
	const cost = building.cost.amount * scalingFactor ** (building.amount || 0);
	return myRound(cost, 2);
};

export const canAffordBuilding = (game, building) => {
	return (
		game.resources[building.cost.resource].amount >= getBuildingCost(building)
	);
};

export const buildBuilding = (game, updateGame, building) => {
	if (canAffordBuilding(game, building)) {
		updateResource(
			game,
			updateGame,
			building.cost.resource,
			-getBuildingCost(building),
		);
		updateGame((draft) => {
			draft.buildings[building.name].amount += 1;
			return;
		});
	}
};

export const sellBuilding = (game, updateGame, building) => {
	if (building.amount >= 1) {
		updateGame((draft) => {
			draft.buildings[building.name].amount -= 1;
			return;
		});
		updateResource(
			game,
			updateGame,
			building.cost.resource,
			getBuildingCost(building),
		);
	}
};

// tech
export const makeDiscovery = (game, updateGame, name) => {
	const canAfford =
		game.resources.research.amount >= game.technologies[name].cost.amount;

	if (!game.technologies[name].discovered && canAfford) {
		updateResource(
			game,
			updateGame,
			"research",
			-game.technologies[name].cost.amount,
		);
		updateGame((draft) => {
			draft.technologies[name].discovered = true;
			return;
		});
	}
};

import { DEFAULT_GAME } from "@/constants/game";
import type { Building, Game, ResourceAmount } from "@/constants/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { myRound } from "./util";

type GameStore = {
	game: Game;
	updateGame: (game: Game) => void;
};

export const useGame = create<GameStore>()(
	immer(
		persist(
			(set, get) => ({
				game: DEFAULT_GAME,
				updateGame: () => set({ game: get().game }),
			}),
			{ name: "ericIdle-storage" },
		),
	),
);

export const resetGame = () => useGame.setState({ game: DEFAULT_GAME });

const checkProgress = () => {
	const { game } = useGame.getState();

	Object.values(game.progress)
		.filter((progress) => progress.goal && !progress.unlocked)
		.forEach((progress) => {
			const goal = progress.goal;

			const shouldUnlock =
				"technology" in goal
					? game.technologies[goal.technology as keyof Game["technologies"]]
							.discovered
					: canAfford({ cost: [goal] });

			if (shouldUnlock) {
				useGame.setState((state) => {
					state.game.progress[
						progress.name as keyof Game["progress"]
					].unlocked = true;
				});

				applyProgress(progress.name);
			}
		});
};

// go through every game object, looking for ones whose prereq = this progressObject. Make it visible
// todo: consider what happens if you have multiple prereqs
const applyProgress = (progressName: string) => {
	const { game } = useGame.getState();

	Object.entries(game).forEach(([categoryKey, category]) => {
		Object.values(category)
			.filter((gameObject) => typeof gameObject === "object")
			.forEach((gameObject) => {
				if (gameObject.prereq === progressName) {
					useGame.setState((state) => {
						state.game[categoryKey][gameObject.name].status = "visible";
					});
				}
			});
	});
};

export const doGameTick = () => {
	checkProgress();
	// updateResourceLimits(game, updateGame);
	updateResources();
	// if (isCreateVillager(game, updateGame)) {
	// 	createVillager(game, updateGame);
	// }
};

export const tick = () => doGameTick();

export const canAfford = ({ cost }: { cost: ResourceAmount[] }) => {
	const resources = useGame.getState().game.resources;

	return cost.every((cost) => {
		const availableResource = resources[cost.resource].amount;
		return cost.amount <= availableResource;
	});
};

// honor limits
export const incrementResource = (
	name: keyof Game["resources"],
	amount: number,
) => {
	const { game } = useGame.getState();

	const newAmount = Math.min(
		game.resources[name].amount + amount,
		game.resources[name].limit,
	);

	useGame.setState((state) => {
		state.game.resources[name].amount = newAmount;
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

		useGame.setState((state) => {
			state.game.resources[resource.name as keyof Game["resources"]].rate =
				newRate;
		});

		incrementResource(
			resource.name as keyof Game["resources"],
			// apply rate per tick
			newRate * (200 / 1000),
		);
	});

	return;

	// handle starvation
	if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0) {
		updateVillagerCount(game, updateGame, -1);
		removeWorker(game, updateGame);
		incrementResource("food", 0.05);
	}

	const workerCount = Object.values(game.jobs).reduce(
		(sum, job) => sum + job.amount,
		0,
	);

	// more workers than villagers
	if (workerCount > game.resources.villagers.amount)
		removeWorker(game, updateGame);
};

export const makeDiscovery = (name: keyof Game["technologies"]) => {
	const { game } = useGame.getState();

	if (game.technologies[name].discovered) return;

	if (canAfford({ cost: game.technologies[name].cost })) {
		incrementResource("research", game.technologies[name].cost[0].amount * -1);
		useGame.setState((state) => {
			state.game.technologies[name].discovered = true;
		});
	}
};

// todo this also handles technology cost
export const getScaledBuildingCost = (
	buildingName: string,
	cost: ResourceAmount,
	buildingCount = 0,
) => {
	const scalingFactor = buildingName === "huts" ? 1.14 : 1.07;
	const scaledCost = cost.amount * scalingFactor ** buildingCount;
	return myRound(scaledCost, 2);
};

export const buildBuilding = (building: Building) => {
	if (canAfford({ cost: building.cost })) {
		building.cost.forEach((cost) =>
			incrementResource(
				cost.resource,
				-getScaledBuildingCost(building.name, cost, building.amount),
			),
		);

		useGame.setState((state) => {
			state.game.buildings[building.name].amount += 1;
		});
	}
};

export const sellBuilding = (building: Building) => {
	if (building.amount === 0) return;

	useGame.setState((state) => {
		state.game.buildings[building.name].amount -= 1;
	});

	building.cost.forEach((cost) =>
		incrementResource(
			cost.resource,
			getScaledBuildingCost(building.name, cost, building.amount - 1),
		),
	);
};

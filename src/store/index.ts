import { DEFAULT_GAME } from "@/constants/game";
import type { Building, Game, ResourceAmount } from "@/constants/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type GameStore = {
	game: Game;
	updateGame: (game: Game) => void;
	resetGame: () => void;
};

export const useGame = create<GameStore>()(
	immer(
		persist(
			(set, _get) => ({
				game: DEFAULT_GAME,
				updateGame: (game) => set({ game: game }),
				resetGame: () => set({ game: DEFAULT_GAME }),
			}),
			{ name: "ericIdle-storage" },
		),
	),
);

/**
 * Compare `game.resources` against a list of resource costs.
 */
export const canAfford = ({ cost }: { cost: ResourceAmount[] }) => {
	const resources = useGame.getState().game.resources;

	return cost.every((cost) => {
		const availableResource = resources[cost.resource].amount;
		return cost.amount <= availableResource;
	});
};

/**
 * Respects `resource.limit`.
 */
export const incrementResource = (
	name: keyof Game["resources"],
	amount: number,
) => {
	const { resources } = useGame.getState().game;

	const newAmount = Math.min(
		resources[name].amount + amount,
		resources[name].limit,
	);

	useGame.setState(({ game }) => {
		game.resources[name].amount = newAmount;
	});
};

/**
 * Calculate the rising cost of each building.
 */
export const getScaledBuildingCost = (
	buildingName: keyof Game["buildings"],
	buildingCount: number,
	cost: ResourceAmount,
) => {
	const scalingFactor = buildingName === "huts" ? 1.14 : 1.07;
	const scaledCost = cost.amount * scalingFactor ** buildingCount;
	return scaledCost;
};

/**
 * Take each resource cost, and scale it up
 */
export const scaleBuildingCosts = (building: Building) => {
	return building.cost.map((cost) => ({
		...cost,
		amount: getScaledBuildingCost(building.name, building.amount, cost),
	}));
};

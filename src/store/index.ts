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
 * Take each resource cost, and map it to a scaled version of itself.
 */
export const scaleBuildingCosts = (building: Building, isSale = false) => {
	const scalingFactor = building.name === "huts" ? 1.14 : 1.07;
	const buildingAmount = building.amount - (isSale ? 1 : 0);
	return building.cost.map((cost) => ({
		...cost,
		amount: cost.amount * scalingFactor ** buildingAmount,
	}));
};

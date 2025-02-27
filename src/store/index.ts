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

	useGame.setState(({ game }) => {
		game.resources[name].amount = newAmount;
	});
};

// todo this also handles technology cost
export const getScaledBuildingCost = (
	buildingName: string,
	cost: ResourceAmount,
	buildingCount = 0,
) => {
	const scalingFactor = buildingName === "huts" ? 1.14 : 1.07;
	const scaledCost = cost.amount * scalingFactor ** buildingCount;
	return scaledCost;
};

export const scaleBuildingCosts = (building: Building) => {
	return building.cost.map((cost) => ({
		...cost,
		amount: getScaledBuildingCost(building.name, cost, building.amount),
	}));
};

import { useGame } from ".";

// Villager
export const updateVillagerCount = (amount: number) => {
	useGame.setState(({ game }) => {
		game.resources.villagers.amount += amount;
	});
};

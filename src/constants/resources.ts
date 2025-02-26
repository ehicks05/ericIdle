import type { Game, Resource } from "./types";

export const resources: Record<keyof Game["resources"], Resource> = {
	food: {
		name: "food",
		image: "wheat.png",
		status: "visible",
		prereq: "",
		baseLimit: 40,
		limit: 40,
		amount: 0,
		rate: 0,
	},
	lumber: {
		name: "lumber",
		image: "wood-pile.png",
		status: "hidden",
		prereq: "unlockWoodConstruction",
		baseLimit: 24,
		limit: 24,
		amount: 0,
		rate: 0,
	},
	leather: {
		name: "leather",
		image: "animal-hide.png",
		status: "hidden",
		prereq: "unlockHunting",
		baseLimit: 20,
		limit: 20,
		amount: 0,
		rate: 0,
	},
	stone: {
		name: "stone",
		image: "stone-pile.png",
		status: "hidden",
		prereq: "unlockStoneConstruction",
		baseLimit: 10,
		limit: 10,
		amount: 0,
		rate: 0,
	},
	research: {
		name: "research",
		image: "coma.png",
		status: "hidden",
		prereq: "unlockVillagers",
		baseLimit: 20,
		limit: 20,
		amount: 0,
		rate: 0,
	},
	villagers: {
		name: "villagers",
		image: "backup.png",
		status: "hidden",
		prereq: "unlockVillagers",
		baseLimit: 0,
		limit: 0,
		amount: 0,
		rate: 0,
	},
};

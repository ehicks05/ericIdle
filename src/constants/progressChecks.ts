import type { Game, ProgressCheck } from "./types";

export const progressChecks: Record<keyof Game["progress"], ProgressCheck> = {
	unlockHuts: {
		name: "unlockHuts",
		goal: { resource: "food", amount: 1 },
		unlocked: false,
	},
	unlockVillagers: {
		name: "unlockVillagers",
		goal: { resource: "villagers", amount: 1 },
		unlocked: false,
	},
	unlockLevelOneTech: {
		name: "unlockLevelOneTech",
		goal: { resource: "research", amount: 1 },
		unlocked: false,
	},
	unlockFarming: {
		name: "unlockFarming",
		goal: { technology: "farming" },
		unlocked: false,
	},
	unlockWoodConstruction: {
		name: "unlockWoodConstruction",
		goal: { technology: "woodConstruction" },
		unlocked: false,
	},
	unlockStoneConstruction: {
		name: "unlockStoneConstruction",
		goal: { technology: "stoneConstruction" },
		unlocked: false,
	},
	unlockWheel: {
		name: "unlockWheel",
		goal: { technology: "wheel" },
		unlocked: false,
	},
	unlockSchools: {
		name: "unlockSchools",
		goal: { resource: "villagers", amount: 30 },
		unlocked: false,
	},
	unlockLibraries: {
		name: "unlockLibraries",
		goal: { resource: "villagers", amount: 50 },
		unlocked: false,
	},
	unlockBuilders: {
		name: "unlockBuilders",
		goal: { resource: "villagers", amount: 50 },
		unlocked: false,
	},
	unlockSmithies: {
		name: "unlockSmithies",
		goal: { resource: "villagers", amount: 50 },
		unlocked: false,
	},
};

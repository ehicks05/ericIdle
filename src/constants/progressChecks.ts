import type { ProgressCheck } from "./types";

export const progressChecks: ProgressCheck[] = [
	{
		name: "unlockHuts",
		goal: [{ resource: "food", amount: 1 }],
		unlocked: false,
	},
	{
		name: "unlockVillagers",
		goal: [{ resource: "villagers", amount: 1 }],
		unlocked: false,
	},
	{
		name: "unlockLevelOneTech",
		goal: [{ resource: "research", amount: 1 }],
		unlocked: false,
	},
	{
		name: "unlockFarming",
		goal: [{ technology: "farming" }],
		unlocked: false,
	},
	{
		name: "unlockWoodConstruction",
		goal: [{ technology: "woodConstruction" }],
		unlocked: false,
	},
	{
		name: "unlockStoneConstruction",
		goal: [{ technology: "stoneConstruction" }],
		unlocked: false,
	},
	{
		name: "unlockWheel",
		goal: [{ technology: "wheel" }],
		unlocked: false,
	},
	{
		name: "unlockSchools",
		goal: [{ resource: "villagers", amount: 30 }],
		unlocked: false,
	},
	{
		name: "unlockLibraries",
		goal: [{ resource: "villagers", amount: 50 }],
		unlocked: false,
	},
];

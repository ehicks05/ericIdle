import type { ProgressCheck } from "./types";

export const progressChecks: ProgressCheck[] = [
	{
		name: "unlockHuts",
		goal: [{ resource: "food", amount: 1 }],
	},
	{
		name: "unlockVillagers",
		goal: [{ resource: "villagers", amount: 1 }],
	},
	{
		name: "unlockLevelOneTech",
		goal: [{ resource: "research", amount: 1 }],
	},
	{
		name: "unlockFarming",
		goal: [{ technology: "farming" }],
	},
	{
		name: "unlockWoodConstruction",
		goal: [{ technology: "woodConstruction" }],
	},
	{
		name: "unlockStoneConstruction",
		goal: [{ technology: "stoneConstruction" }],
	},
	{
		name: "unlockWheel",
		goal: [{ technology: "wheel" }],
	},
	{
		name: "unlockSchools",
		goal: [{ resource: "villagers", amount: 30 }],
	},
	{
		name: "unlockLibraries",
		goal: [{ resource: "villagers", amount: 50 }],
	},
];

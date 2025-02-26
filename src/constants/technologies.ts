import type { Technology } from "./types";

export const technologies: Technology[] = [
	{
		name: "farming",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 1 }],
	},
	{
		name: "woodConstruction",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 2 }],
	},
	{
		name: "stoneConstruction",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 5 }],
	},
	{
		name: "wheel",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 5 }],
	},
];

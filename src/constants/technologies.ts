import type { Game, Technology } from "./types";

export const technologies: Record<keyof Game["technologies"], Technology> = {
	farming: {
		name: "farming",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 1 }],
	},
	woodConstruction: {
		name: "woodConstruction",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 2 }],
	},
	stoneConstruction: {
		name: "stoneConstruction",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 5 }],
	},
	wheel: {
		name: "wheel",
		image: "",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 5 }],
	},
};

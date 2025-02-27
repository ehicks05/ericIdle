import type { Game, Technology } from "./types";

export const technologies: Record<keyof Game["technologies"], Technology> = {
	farming: {
		name: "farming",
		image: "tractor",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 1 }],
	},
	woodConstruction: {
		name: "woodConstruction",
		image: "fence",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 2 }],
	},
	stoneConstruction: {
		name: "stoneConstruction",
		image: "brickWall",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 5 }],
	},
	wheel: {
		name: "wheel",
		image: "circle",
		prereq: "unlockLevelOneTech",
		status: "hidden",
		discovered: false,
		cost: [{ resource: "research", amount: 5 }],
	},
};

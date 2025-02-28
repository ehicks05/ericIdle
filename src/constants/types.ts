import type { ICONS } from "./icons";

export type UnlockStatus = "hidden" | "visible";
export type ModifierType = "add" | "mult";
export interface ResourceAmount {
	resource: keyof Game["resources"];
	amount: number;
}
export interface Event {
	date: number;
	tick: number;
	text: string;
}

export interface Resource {
	name: keyof Game["resources"];
	prereq: keyof Game["progress"];
	status: UnlockStatus;
	image: keyof typeof ICONS;
	amount: number;
	limit: number;
	baseLimit: number;
	rate: number;
}

export interface Job {
	name: keyof Game["jobs"];
	prereq: keyof Game["progress"];
	status: UnlockStatus;
	image: keyof typeof ICONS;
	amount: number;
	production: ResourceAmount[];
}

export interface Building {
	name: keyof Game["buildings"];
	prereq: keyof Game["progress"];
	status: UnlockStatus;
	image: keyof typeof ICONS;
	amount: number;
	cost: ResourceAmount[];
	resourceLimitModifier: {
		resource: string;
		amount: number;
		type: ModifierType;
	}[];
	bonus: ResourceAmount[];
	sellable: boolean;
}

export interface Technology {
	name: keyof Game["technologies"];
	prereq: keyof Game["progress"];
	status: UnlockStatus;
	image: keyof typeof ICONS;
	discovered: boolean;
	cost: ResourceAmount[];
}

export interface ProgressCheck {
	name: keyof Game["progress"];
	goal: ResourceAmount | { technology: keyof Game["technologies"] };
	unlocked: boolean;
}

export interface Game {
	resources: {
		villagers: Resource;
		food: Resource;
		lumber: Resource;
		stone: Resource;
		research: Resource;
		leather: Resource;
	};
	jobs: {
		idlers: Job;
		farmers: Job;
		thinkers: Job;
		foresters: Job;
		hunters: Job;
		miners: Job;
		builders: Job;
	};
	buildings: {
		huts: Building;
		farms: Building;
		lumberMills: Building;
		storerooms: Building;
		quarries: Building;
		schools: Building;
		libraries: Building;
		huntingCamps: Building;
		smithies: Building;
	};
	technologies: {
		farming: Technology;
		woodConstruction: Technology;
		stoneConstruction: Technology;
		wheel: Technology;
	};
	progress: {
		unlockHuts: ProgressCheck;
		unlockVillagers: ProgressCheck;
		unlockLevelOneTech: ProgressCheck;
		unlockFarming: ProgressCheck;
		unlockWoodConstruction: ProgressCheck;
		unlockStoneConstruction: ProgressCheck;
		unlockWheel: ProgressCheck;
		unlockSchools: ProgressCheck;
		unlockLibraries: ProgressCheck;
		unlockBuilders: ProgressCheck;
		unlockSmithies: ProgressCheck;
	};

	log: Event[];
	tickCount: number;
	defaultJob: keyof Game["jobs"];
	villagerCreatedAt: number;
	isIncomingVillager: boolean;
	huntingPartyReturnedAt: number;
	isHuntingPartyActive: boolean;
}

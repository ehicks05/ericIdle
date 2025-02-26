export type UnlockStatus = "hidden" | "visible";
export type ModifierType = "add" | "mult";
export interface ResourceAmount {
	resource: keyof Game["resources"];
	amount: number;
}

export interface Resource {
	name: string;
	limit: number;
	baseLimit: number;
	image: string;
	prereq: string;
	status: UnlockStatus;
	amount: number;
	rate: number;
}

export interface Job {
	name: string;
	image: string;
	prereq: string;
	status: UnlockStatus;
	production: ResourceAmount[];
	amount: number;
}

export interface Building {
	name: keyof Game["buildings"];
	image: string;
	prereq: string;
	cost: ResourceAmount[];
	resourceLimitModifier: {
		resource: string;
		amount: number;
		type: ModifierType;
	}[];
	bonus: ResourceAmount[];
	status: UnlockStatus;
	amount: number;
	sellable: boolean;
}

export interface Technology {
	name: string;
	image: string;
	prereq: string;
	status: UnlockStatus;
	discovered: boolean;
	cost: ResourceAmount[];
}

export interface ProgressCheck {
	name: string;
	goal: ResourceAmount | { technology: string };
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
	};

	defaultJob: string;
	villagerCreatedAt: number;
	isIncomingVillager: boolean;
}

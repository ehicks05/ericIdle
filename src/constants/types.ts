export type UnlockStatus = "hidden" | "visible";
export type ModifierType = "add" | "mult";
export interface ResourceAmount {
	resource: string;
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
	name: string;
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
	goal: (ResourceAmount | { technology: string })[];
}

export interface Game {
	resources: Resource[];
	jobs: Job[];
	buildings: Building[];
	technologies: Technology[];
	progress: ProgressCheck[];
}

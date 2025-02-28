import { buildings } from "./buildings";
import { jobs } from "./jobs";
import { progressChecks } from "./progressChecks";
import { resources } from "./resources";
import { technologies } from "./technologies";
import type { Game } from "./types";

export const DEFAULT_GAME: Game = {
	resources: resources,
	buildings: buildings,
	jobs: jobs,
	technologies: technologies,
	progress: progressChecks,

	log: [],
	tickCount: 0,
	defaultJob: "idlers",
	villagerCreatedAt: Date.now(),
	isIncomingVillager: false,
	huntingPartyReturnedAt: Date.now(),
	isHuntingPartyActive: false,
};

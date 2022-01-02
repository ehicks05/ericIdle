import {
  buildings,
  milestones,
  resources,
  techs,
  villagers,
} from "./default_state";

export interface Entity {
  name: string;
  image: string;
  // effects: Effect[];
  prereq: string;
  status: "hidden" | "visible";
}
export interface Resource extends Entity {
  amount: number;
  rate: number;
  baseLimit: number;
  limit: number;
}
export interface Villager extends Entity {
  amount: number;
  production: ResourceAmount[]; // replace with effects?
}
export interface Building extends Entity {
  amount: number;
  basePrice: ResourceAmount[];
  resourceLimitModifiers: ResourceLimitModifier[]; // replace with effects?
  bonus: ProductionBonus[]; // replace with effects?
  sellable: boolean;
}
export interface Tech extends Entity {
  price: ResourceAmount[];
  discovered: boolean;
}
export interface Milestone {
  name: string;
  predicate: Predicate;
  reached: boolean;
}

export interface ResourceAmount {
  resource: keyof typeof resources;
  amount: number;
}

export interface ResourceLimitModifier {
  resource: keyof typeof resources;
  amount: number;
  type: "add" | "mult";
}
export interface ProductionBonus {
  resource: keyof typeof resources;
  amount: number;
}
export interface Effect {
  type: "production" | "resourceLimitModifier" | "bonus";
}
export type Predicate = ResourceAmount | { tech: keyof typeof techs };

export interface GameState {
  resources: typeof resources;
  villagers: typeof villagers;
  buildings: typeof buildings;
  techs: typeof techs;
  milestones: typeof milestones;

  defaultJob: keyof typeof villagers;
  villagerCreatedAt: number;
  isIncomingVillager: boolean;
}

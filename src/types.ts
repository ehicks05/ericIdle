export interface Entity {
  readonly name: string;
  readonly image: string;
  // readonly effects: Effect[];
  readonly prereq: Predicate;
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
  production: Production[]; // replace with effects?
}
export interface Building extends Entity {
  amount: number;
  price: ResourceAmount[];
  resourceLimitModifiers: ResourceLimitModifier[]; // replace with effects?
  bonus: ProductionBonus[]; // replace with effects?
  sellable: boolean;
}
export interface Tech extends Entity {
  price: ResourceAmount[];
  discovered: boolean;
}
export interface Milestone extends Entity {
  reached: boolean;
}

export interface ResourceAmount {
  resource: string;
  amount: number;
}

export interface Production {
  resource: string;
  amount: number;
}
export interface ResourceLimitModifier {
  resource: string;
  amount: number;
  type: "add" | "mult";
}
export interface ProductionBonus {
  resource: string;
  amount: number;
}
export interface Effect {
  type: "production" | "resourceLimitModifier" | "bonus";
}
export type Predicate =
  | { resource: string; amount: number }
  | { tech: string }
  | string; // tech name

export interface GameState {
  resources: Resource[];
  villagers: Villager[];
  buildings: Building[];
  techs: Tech[];
  milestones: Milestone[];
}

export interface Entity {
  name: string;
  image: string;
  effects: Effect[];
  prereq: string;

  // game state
  status: string; // visible | hidden
  amount: number;
}
export interface Resource extends Entity {
  rate: number;
  baseLimit: number;
  limit: number;
}
export interface Villager extends Entity {
  production: string[]; // replace with effects?
}
export interface Building extends Entity {
  cost: number;
  resourceLimitModifier: string[]; // replace with effects?
  bonus: string[]; // replace with effects?
}
export interface Tech extends Entity {
  cost: number;
  discovered: boolean;
}
export interface Milestone extends Entity {
  prereq: string;
  prereqReached: boolean;
}

// sample production: { resource: "food", amount: 0.05 }
// sample resourceLimitModifier: { resource: "villagers", amount: 2, type: "additive" }
// sample bonus (multiplier on base production): { resource: "food", amount: 0.05 }
export interface Effect {
  type: "production" | "resourceLimitModifier" | "bonus";
}
export interface Predicate {
  temp: string;
}

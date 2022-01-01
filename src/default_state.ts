import * as R from "ramda";
import { Building, Milestone, Resource, Tech, Villager } from "./types";

type PartialResource = Pick<
  Resource,
  "name" | "baseLimit" | "image" | "prereq"
>;
const hydrateResource = (resource: PartialResource): Resource => ({
  ...resource,
  limit: resource.baseLimit,
  status: resource.name === "food" ? "visible" : "hidden",
  amount: 0,
  rate: 0,
});

export const resources = {
  food: hydrateResource({
    name: "food",
    baseLimit: 40,
    image: "wheat.png",
    prereq: "",
  }),
  lumber: hydrateResource({
    name: "lumber",
    baseLimit: 24,
    image: "wood-pile.png",
    prereq: "unlockWoodConstruction",
  }),
  leather: hydrateResource({
    name: "leather",
    baseLimit: 20,
    image: "animal-hide.png",
    prereq: "unlockHunting",
  }),
  stone: hydrateResource({
    name: "stone",
    baseLimit: 10,
    image: "stone-pile.png",
    prereq: "unlockStoneConstruction",
  }),
  research: hydrateResource({
    name: "research",
    baseLimit: 20,
    image: "coma.png",
    prereq: "unlockVillagers",
  }),
  villagers: hydrateResource({
    name: "villagers",
    baseLimit: 0,
    image: "backup.png",
    prereq: "unlockVillagers",
  }),
} as const;

type PartialVillager = Pick<
  Villager,
  "name" | "image" | "prereq" | "production"
>;
const hydrateVillagers = (villager: PartialVillager): Villager => ({
  ...villager,
  status: "hidden",
  amount: 0,
});

export const villagers = {
  idlers: hydrateVillagers({
    name: "idlers",
    image: "watch.png",
    prereq: "unlockVillagers",
    production: [],
  }),
  farmers: hydrateVillagers({
    name: "farmers",
    image: "farmer.png",
    prereq: "unlockVillagers",
    production: [{ resource: "food", amount: 0.05 }],
  }),
  thinkers: hydrateVillagers({
    name: "thinkers",
    image: "think.png",
    prereq: "unlockVillagers",
    production: [{ resource: "research", amount: 0.02 }],
  }),
  foresters: hydrateVillagers({
    name: "foresters",
    image: "hand-saw.png",
    prereq: "unlockWoodConstruction",
    production: [{ resource: "lumber", amount: 0.03 }],
  }),
  hunters: hydrateVillagers({
    name: "hunters",
    image: "watch.png",
    prereq: "unlockHunting",
    production: [{ resource: "food", amount: 0.08 }],
  }),
  miners: hydrateVillagers({
    name: "miners",
    image: "watch.png",
    prereq: "unlockStoneConstruction",
    production: [{ resource: "stone", amount: 0.01 }],
  }),
  builders: hydrateVillagers({
    name: "builders",
    image: "watch.png",
    prereq: "unlockBuilders",
    production: [{ resource: "food", amount: 0.05 }],
  }),
} as const;

type PartialBuilding = Pick<
  Building,
  "name" | "image" | "prereq" | "basePrice" | "resourceLimitModifiers" | "bonus"
>;
const hydrateBuilding = (building: PartialBuilding): Building => ({
  ...building,
  status: "hidden",
  amount: 0,
  sellable: false,
});

export const buildings = {
  huts: hydrateBuilding({
    name: "huts",
    image: "tipi.png",
    prereq: "unlockHuts",
    basePrice: [{ resource: "food", amount: 1 }],
    resourceLimitModifiers: [{ resource: "villagers", amount: 2, type: "add" }],
    bonus: [],
  }),
  farms: hydrateBuilding({
    name: "farms",
    image: "barn.png",
    prereq: "unlockFarming",
    basePrice: [{ resource: "lumber", amount: 1 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "food", amount: 0.05 }],
  }),
  lumberMills: hydrateBuilding({
    name: "lumberMills",
    image: "circular-saw.png",
    prereq: "unlockWoodConstruction",
    basePrice: [{ resource: "lumber", amount: 2 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "lumber", amount: 0.1 }],
  }),
  storerooms: hydrateBuilding({
    name: "storerooms",
    image: "block-house.png",
    prereq: "unlockStoneConstruction",
    basePrice: [
      { resource: "lumber", amount: 5 },
      { resource: "stone", amount: 1 },
    ],
    resourceLimitModifiers: [
      { resource: "food", amount: 5, type: "add" },
      { resource: "lumber", amount: 5, type: "add" },
      { resource: "stone", amount: 5, type: "add" },
    ],
    bonus: [],
  }),
  quarries: hydrateBuilding({
    name: "quarries",
    image: "gold-mine.png",
    prereq: "unlockStoneConstruction",
    basePrice: [{ resource: "lumber", amount: 2 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "stone", amount: 0.06 }],
  }),
  schools: hydrateBuilding({
    name: "schools",
    image: "graduate-cap.png",
    prereq: "unlockSchools",
    basePrice: [{ resource: "lumber", amount: 3 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "research", amount: 0.06 }],
  }),
  libraries: hydrateBuilding({
    name: "libraries",
    image: "book-cover.png",
    prereq: "unlockLibraries",
    basePrice: [{ resource: "lumber", amount: 4 }],
    resourceLimitModifiers: [{ resource: "research", amount: 5, type: "add" }],
    bonus: [],
  }),
} as const;

type PartialTech = Pick<Tech, "name" | "price" | "prereq">;
const hydrateTech = (tech: PartialTech): Tech => ({
  ...tech,
  image: "enlightenment.png",
  status: "hidden",
  discovered: false,
});

export const techs = {
  farming: hydrateTech({
    name: "farming",
    price: [{ resource: "research", amount: 1 }],
    prereq: "unlockLevelOneTech",
  }),
  woodConstruction: hydrateTech({
    name: "woodConstruction",
    price: [{ resource: "research", amount: 2 }],
    prereq: "unlockLevelOneTech",
  }),
  stoneConstruction: hydrateTech({
    name: "stoneConstruction",
    price: [{ resource: "research", amount: 5 }],
    prereq: "unlockLevelOneTech",
  }),
  wheel: hydrateTech({
    name: "wheel",
    price: [{ resource: "research", amount: 5 }],
    prereq: "unlockLevelOneTech",
  }),
} as const;

type PartialMilestone = Pick<Milestone, "name" | "prereq">;
const hydrateMilestone = (milestone: PartialMilestone): Milestone => ({
  ...milestone,
  reached: false,
  image: "", // has no effect
  status: "hidden", // has no effect
});

export const milestones = {
  unlockHuts: hydrateMilestone({
    name: "unlockHuts",
    prereq: { resource: "food", amount: 1 },
    // predicate: (gameState: GameState) => gameState.resources.find(r => r.name === 'food')?.amount || 0 >= 1,
  }),
  unlockVillagers: hydrateMilestone({
    name: "unlockVillagers",
    prereq: { resource: "villagers", amount: 1 },
  }),
  unlockLevelOneTech: hydrateMilestone({
    name: "unlockLevelOneTech",
    prereq: { resource: "research", amount: 1 },
  }),
  unlockFarming: hydrateMilestone({
    name: "unlockFarming",
    prereq: { tech: "farming" },
  }),
  unlockWoodConstruction: hydrateMilestone({
    name: "unlockWoodConstruction",
    prereq: { tech: "woodConstruction" },
  }),
  unlockStoneConstruction: hydrateMilestone({
    name: "unlockStoneConstruction",
    prereq: { tech: "stoneConstruction" },
  }),
  unlockWheel: hydrateMilestone({
    name: "unlockWheel",
    prereq: { tech: "wheel" },
  }),
  unlockSchools: hydrateMilestone({
    name: "unlockSchools",
    prereq: { resource: "villagers", amount: 30 },
  }),
  unlockLibraries: hydrateMilestone({
    name: "unlockLibraries",
    prereq: { resource: "villagers", amount: 50 },
  }),
} as const;

export const getDefaultGameState = () => {
  return {
    resources,
    villagers,
    buildings,
    techs,
    milestones,

    defaultJob: "idlers" as keyof typeof villagers,
    villagerCreatedAt: Date.now(),
    isIncomingVillager: false,
  };
};

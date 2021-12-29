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

const resources: PartialResource[] = [
  {
    name: "food",
    baseLimit: 40,
    image: "wheat.png",
    prereq: "",
  },
  {
    name: "lumber",
    baseLimit: 24,
    image: "wood-pile.png",
    prereq: "unlockWoodConstruction",
  },
  {
    name: "leather",
    baseLimit: 20,
    image: "animal-hide.png",
    prereq: "unlockHunting",
  },
  {
    name: "stone",
    baseLimit: 10,
    image: "stone-pile.png",
    prereq: "unlockStoneConstruction",
  },
  {
    name: "research",
    baseLimit: 20,
    image: "coma.png",
    prereq: "unlockVillagers",
  },
  {
    name: "villagers",
    baseLimit: 0,
    image: "backup.png",
    prereq: "unlockVillagers",
  },
];

type PartialVillager = Pick<
  Villager,
  "name" | "image" | "prereq" | "production"
>;
const hydrateVillagers = (villager: PartialVillager): Villager => ({
  ...villager,
  status: "hidden",
  amount: 0,
});

const villagers: PartialVillager[] = [
  {
    name: "idlers",
    image: "watch.png",
    prereq: "unlockVillagers",
    production: [],
  },
  {
    name: "farmers",
    image: "farmer.png",
    prereq: "unlockVillagers",
    production: [{ resource: "food", amount: 0.05 }],
  },
  {
    name: "thinkers",
    image: "think.png",
    prereq: "unlockVillagers",
    production: [{ resource: "research", amount: 0.02 }],
  },
  {
    name: "foresters",
    image: "hand-saw.png",
    prereq: "unlockWoodConstruction",
    production: [{ resource: "lumber", amount: 0.03 }],
  },
  {
    name: "hunters",
    image: "watch.png",
    prereq: "unlockHunting",
    production: [{ resource: "food", amount: 0.08 }],
  },
  {
    name: "miners",
    image: "watch.png",
    prereq: "unlockStoneConstruction",
    production: [{ resource: "stone", amount: 0.01 }],
  },
  {
    name: "builders",
    image: "watch.png",
    prereq: "unlockBuilders",
    production: [{ resource: "food", amount: 0.05 }],
  },
];

type PartialBuilding = Pick<
  Building,
  "name" | "image" | "prereq" | "price" | "resourceLimitModifiers" | "bonus"
>;
const hydrateBuildings = (building: PartialBuilding): Building => ({
  ...building,
  status: "hidden",
  amount: 0,
  sellable: false,
});

const buildings: PartialBuilding[] = [
  {
    name: "huts",
    image: "tipi.png",
    prereq: "unlockHuts",
    price: [{ resource: "food", amount: 1 }],
    resourceLimitModifiers: [{ resource: "villagers", amount: 2, type: "add" }],
    bonus: [],
  },
  {
    name: "farms",
    image: "barn.png",
    prereq: "unlockFarming",
    price: [{ resource: "lumber", amount: 1 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "food", amount: 0.05 }],
  },
  {
    name: "lumberMills",
    image: "circular-saw.png",
    prereq: "unlockWoodConstruction",
    price: [{ resource: "lumber", amount: 2 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "lumber", amount: 0.1 }],
  },
  {
    name: "storerooms",
    image: "block-house.png",
    prereq: "unlockStoneConstruction",
    price: [{ resource: "lumber", amount: 5 }],
    resourceLimitModifiers: [
      { resource: "food", amount: 5, type: "add" },
      { resource: "lumber", amount: 5, type: "add" },
      { resource: "stone", amount: 5, type: "add" },
    ],
    bonus: [],
  },
  {
    name: "quarries",
    image: "gold-mine.png",
    prereq: "unlockStoneConstruction",
    price: [{ resource: "lumber", amount: 2 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "stone", amount: 0.06 }],
  },
  {
    name: "schools",
    image: "graduate-cap.png",
    prereq: "unlockSchools",
    price: [{ resource: "lumber", amount: 3 }],
    resourceLimitModifiers: [],
    bonus: [{ resource: "research", amount: 0.06 }],
  },
  {
    name: "libraries",
    image: "book-cover.png",
    prereq: "unlockLibraries",
    price: [{ resource: "lumber", amount: 4 }],
    resourceLimitModifiers: [{ resource: "research", amount: 5, type: "add" }],
    bonus: [],
  },
  {
    name: "huntingCamps",
    image: "watch.png",
    prereq: "unlockHunting",
    price: [{ resource: "lumber", amount: 2 }],
    resourceLimitModifiers: [],
    bonus: [],
  },
  {
    name: "smithies",
    image: "watch.png",
    prereq: "unlockSmithies",
    price: [{ resource: "lumber", amount: 3 }],
    resourceLimitModifiers: [],
    bonus: [],
  },
];

type PartialTech = Pick<Tech, "name" | "price" | "prereq">;
const hydrateTechs = (tech: PartialTech): Tech => ({
  ...tech,
  image: "enlightenment.png",
  status: "hidden",
  discovered: false,
});
const techs: PartialTech[] = [
  {
    name: "farming",
    price: [{ resource: "research", amount: 1 }],
    prereq: "unlockLevelOneTech",
  },
  {
    name: "woodConstruction",
    price: [{ resource: "research", amount: 2 }],
    prereq: "unlockLevelOneTech",
  },
  {
    name: "stoneConstruction",
    price: [{ resource: "research", amount: 5 }],
    prereq: "unlockLevelOneTech",
  },
  {
    name: "wheel",
    price: [{ resource: "research", amount: 5 }],
    prereq: "unlockLevelOneTech",
  },
];

type PartialMilestone = Pick<Milestone, "name" | "prereq">;
const hydrateMilestones = (milestone: PartialMilestone): Milestone => ({
  ...milestone,
  reached: false,
  image: "", // has no effect
  status: "hidden", // has no effect
});
const milestones: PartialMilestone[] = [
  {
    name: "unlockHuts",
    prereq: { resource: "food", amount: 1 },
    // predicate: (gameState: GameState) => gameState.resources.find(r => r.name === 'food')?.amount || 0 >= 1,
  },
  {
    name: "unlockVillagers",
    prereq: { resource: "villagers", amount: 1 },
  },
  {
    name: "unlockLevelOneTech",
    prereq: { resource: "research", amount: 1 },
  },
  {
    name: "unlockFarming",
    prereq: { tech: "farming" },
  },
  {
    name: "unlockWoodConstruction",
    prereq: { tech: "woodConstruction" },
  },
  {
    name: "unlockStoneConstruction",
    prereq: { tech: "stoneConstruction" },
  },
  {
    name: "unlockWheel",
    prereq: { tech: "wheel" },
  },
  {
    name: "unlockSchools",
    prereq: { resource: "villagers", amount: 30 },
  },
  {
    name: "unlockLibraries",
    prereq: { resource: "villagers", amount: 50 },
  },
];

export const getDefaultGameState = () => {
  return {
    resources: R.indexBy(R.prop("name"), resources.map(hydrateResource)),
    buildings: R.indexBy(R.prop("name"), buildings.map(hydrateBuildings)),
    jobs: R.indexBy(R.prop("name"), villagers.map(hydrateVillagers)),
    techs: R.indexBy(R.prop("name"), techs.map(hydrateTechs)),
    milestones: R.indexBy(R.prop("name"), milestones.map(hydrateMilestones)),

    defaultJob: "idlers",
    villagerCreatedAt: Date.now(),
    isIncomingVillager: false,
  };
};

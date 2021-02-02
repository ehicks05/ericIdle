import { MS_PER_TICK } from "./constants";
import * as util from "./util.js";

export const doGameTick = (game, updateGame) => {
  checkProgress(game, updateGame);
  updateResourceLimits(game, updateGame);
  updateResources(game, updateGame);
  if (isCreateVillager(game, updateGame)) createVillager(game, updateGame);
};

const checkProgress = (game, updateGame) => {
  Object.values(game.progress)
    .filter(
      (progress) => progress.requirement && !progress.requirement.unlocked
    )
    .forEach((progress) => {
      const requirement = progress.requirement;

      const unlockIt =
        (requirement.resource &&
          game.resources[requirement.resource].amount >= requirement.amount) ||
        (requirement.technology &&
          game.technologies[requirement.technology].discovered);

      if (unlockIt) {
        updateGame((draft) => {
          draft.progress[progress.name].unlocked = true;
          return;
        });
        applyProgress(game, updateGame, progress.name);
      }
    });
};

// go through every game object, looking for ones whose prereq = this progressObject. Make it visible
// todo: consider what happens if you have multiple prereqs
const applyProgress = (game, updateGame, progressObject) => {
  Object.entries(game).forEach(([categoryKey, category]) => {
    Object.entries(category)
      .filter(([gameObjectKey, gameObject]) => typeof gameObject === "object")
      .forEach(([gameObjectKey, gameObject]) => {
        if (gameObject.prereq === progressObject)
          updateGame((draft) => {
            draft[categoryKey][gameObjectKey].status = "visible";
            return;
          });
      });
  });
};

const updateResourceLimits = (game, updateGame) => {
  Object.entries(game.resources).forEach(([resourceKey, resource]) => {
    let multiplicativeMod = 0;
    let additiveMod = 0;
    Object.values(game.buildings)
      .filter((building) => building.resourceLimitModifier)
      .forEach((building) => {
        building.resourceLimitModifier
          .filter(
            (resourceLimitMod) => resourceLimitMod.resource === resource.name
          )
          .forEach((resourceLimitMod) => {
            if (resourceLimitMod.type === "multi")
              multiplicativeMod += building.amount * resourceLimitMod.amount;
            if (resourceLimitMod.type === "additive")
              additiveMod += building.amount * resourceLimitMod.amount;
          });
      });

    const newLimit =
      (resource.baseLimit + additiveMod) * (1 + multiplicativeMod);
    updateGame((draft) => {
      draft.resources[resourceKey].limit = newLimit;
      return;
    });
  });
};

const updateResources = (game, updateGame) => {
  Object.values(game.resources).forEach((resource) => {
    let multiplicativeMod = 0;
    Object.values(game.buildings).forEach((building) => {
      building.bonus.forEach((bonus) => {
        if (bonus.resource === resource.name)
          multiplicativeMod += building.amount * bonus.amount;
      });
    });

    let additiveMod = 0;
    Object.values(game.jobs).forEach((job) => {
      job.production &&
        job.production.forEach((production) => {
          if (production.resource === resource.name)
            additiveMod += job.amount * production.amount;
        });
    });

    let newRate = additiveMod * (1 + multiplicativeMod);

    // villagers gotta eat
    if (resource.name === "food")
      newRate = newRate - 0.45 * game?.resources?.villagers?.amount;

    // apply arbitrary global multiplier
    newRate = 0.1 * newRate;
    updateGame((draft) => {
      draft.resources[resource.name].rate = util.formatRate(newRate);
      return;
    });
    updateResource(game, updateGame, resource.name, newRate * (200 / 1000)); // apply rate per tick
  });

  // Starvation
  if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0) {
    updateVillagerCount(game, updateGame, -1);
    removeWorker(game, updateGame);
    game.resources.food.amount = 0.5; // ...
  }

  const workerCount = Object.values(game.jobs).reduce(
    (sum, job) => sum + job.amount,
    0
  );

  // more workers than villagers
  if (workerCount > game.resources.villagers.amount)
    removeWorker(game, updateGame);
};

export const updateResource = (game, updateGame, name, amount) => {
  updateGame((draft) => {
    const newAmount = Math.min(
      util.myRound(draft.resources[name].amount + amount, 4),
      draft.resources[name].limit
    );
    draft.resources[name].amount = newAmount;
    return;
  });
};

const createVillager = (game, updateGame) => {
  const spacesAvailable =
    game.resources.villagers.limit - game.resources.villagers.amount;

  let villagersToCreate =
    Math.floor(Math.sqrt(game.resources.villagers.amount)) - 1;
  villagersToCreate = Math.min(villagersToCreate, spacesAvailable);
  if (villagersToCreate < 1) villagersToCreate = 1;

  updateVillagerCount(game, updateGame, villagersToCreate);
  addNewIdler(game, updateGame, villagersToCreate);
  updateGame((draft) => {
    draft.isIncomingVillager = false;
    return;
  });
};

export const removeWorker = (game, updateGame) => {
  if (game.jobs.idlers.amount > 0) {
    updateGame((draft) => {
      draft.jobs.idlers.amount -= 1;
      return;
    });
    return;
  }

  const job = Object.values(game.jobs).find(
    (job) => job.name !== "idler" && job.amount > 0
  );
  if (job)
    updateGame((draft) => {
      draft.jobs[job.name].amount -= 1;
      return;
    });
};

// Villager
export const updateVillagerCount = (game, updateGame, amount) => {
  updateGame((draft) => {
    draft.resources.villagers.amount += amount;
    return;
  });
};

// Worker
export const addNewIdler = (game, updateGame, amount) => {
  updateGame((draft) => {
    draft.jobs.idlers.amount += amount;
    return;
  });
};

export const assignJob = (game, updateGame, name, amount) => {
  updateGame((draft) => {
    if (amount > 0 && draft.jobs.idlers.amount >= amount) {
      draft.jobs[name].amount += amount;
      draft.jobs.idlers.amount -= amount;
    } else if (amount < 0 && draft.jobs[name].amount >= amount) {
      draft.jobs[name].amount += amount;
      draft.jobs.idlers.amount -= amount;
    }
    return;
  });
};

export const isCreateVillager = (game, updateGame) => {
  const isVillagerCreationPossible =
    game.resources.villagers.amount < game.resources.villagers.limit &&
    game.resources.food.amount > 0;
  if (isVillagerCreationPossible) {
    if (game.isIncomingVillager === false) {
      updateGame((draft) => {
        draft.isIncomingVillager = true;
        draft.villagerCreatedAt = Date.now();
        return;
      });
    }

    const msSinceLastVillager = Date.now() - game.villagerCreatedAt;

    const rand = Math.random() * (20000 * (1000 / MS_PER_TICK));
    return rand < msSinceLastVillager;
  }
  return false;
};

// todo this also handles technology cost
export const getBuildingCost = (building) => {
  const scalingFactor = building.name === "huts" ? 1.14 : 1.07;
  const cost =
    building.cost.amount * Math.pow(scalingFactor, building.amount || 0);
  return util.myRound(cost, 2);
};

export const canAffordBuilding = (game, building) => {
  return (
    game.resources[building.cost.resource].amount >= getBuildingCost(building)
  );
};

export const buildBuilding = (game, updateGame, building) => {
  if (canAffordBuilding(game, building)) {
    updateResource(
      game,
      updateGame,
      building.cost.resource,
      -getBuildingCost(building)
    );
    updateGame((draft) => {
      draft.buildings[building.name].amount += 1;
      return;
    });
  }
};

export const reclaimBuilding = (game, updateGame, building) => {
  if (building.amount >= 1) {
    updateGame((draft) => {
      draft.buildings[building.name].amount -= 1;
      return;
    });
    updateResource(
      game,
      updateGame,
      building.cost.resource,
      getBuildingCost(building)
    );
  }
};

// tech
export const makeDiscovery = (game, updateGame, name) => {
  const canAfford =
    game.resources.research.amount >= game.technologies[name].cost.amount;

  if (!game.technologies[name].discovered && canAfford) {
    updateResource(
      game,
      updateGame,
      "research",
      -game.technologies[name].cost.amount
    );
    updateGame((draft) => {
      draft.technologies[name].discovered = true;
      return;
    });
  }
};

export const getDefaultGameState = () => {
  function Resource(name, baseLimit, image, prereq) {
    this.name = name;
    this.limit = baseLimit;
    this.baseLimit = baseLimit;
    this.image = image;
    this.prereq = prereq;
    this.status = name === "food" ? "visible" : "hidden";
    this.amount = 0;
    this.rate = 0;
  }

  // resources
  const food = new Resource("food", 40, "wheat.png", "");
  const lumber = new Resource(
    "lumber",
    24,
    "wood-pile.png",
    "unlockWoodConstruction"
  );
  const leather = new Resource(
    "leather",
    20,
    "animal-hide.png",
    "unlockHunting"
  );
  const stone = new Resource(
    "stone",
    10,
    "stone-pile.png",
    "unlockStoneConstruction"
  );
  const research = new Resource("research", 20, "coma.png", "unlockVillagers");
  const villagers = new Resource(
    "villagers",
    0,
    "backup.png",
    "unlockVillagers"
  );

  function Job(name, image, prereq, productionList) {
    this.name = name;
    this.image = image;
    this.prereq = prereq;
    this.status = "hidden";
    this.production = productionList || [];
    this.amount = 0;
  }

  // workers
  const idlers = new Job("idlers", "watch.png", "unlockVillagers");
  const farmers = new Job("farmers", "farmer.png", "unlockVillagers", [
    { resource: "food", amount: 0.5 },
  ]);
  const thinkers = new Job("thinkers", "think.png", "unlockVillagers", [
    { resource: "research", amount: 0.2 },
  ]);
  const foresters = new Job(
    "foresters",
    "hand-saw.png",
    "unlockWoodConstruction",
    [{ resource: "lumber", amount: 0.3 }]
  );
  const hunters = new Job("hunters", "watch.png", "unlockHunting");
  const miners = new Job("miners", "watch.png", "unlockStoneConstruction", [
    { resource: "stone", amount: 0.1 },
  ]);
  const builders = new Job("builders", "watch.png", "unlockBuilders");

  function Building(name, image, prereq, cost, limitModifiers, bonusList) {
    this.name = name;
    this.image = image;
    this.prereq = prereq;
    this.cost = cost;
    this.resourceLimitModifier = limitModifiers || [];
    this.bonus = bonusList || [];
    this.status = "hidden";
    this.amount = 0;
  }

  // buildings
  const huts = new Building(
    "huts",
    "tipi.png",
    "unlockHuts",
    { resource: "food", amount: 1 },
    [{ resource: "villagers", amount: 2, type: "additive" }],
    []
  );
  const farms = new Building(
    "farms",
    "barn.png",
    "unlockFarming",
    { resource: "lumber", amount: 1 },
    [],
    [{ resource: "food", amount: 0.05 }]
  );
  const lumberMills = new Building(
    "lumberMills",
    "circular-saw.png",
    "unlockWoodConstruction",
    { resource: "lumber", amount: 2 },
    [],
    [{ resource: "lumber", amount: 0.1 }]
  );
  const storerooms = new Building(
    "storerooms",
    "block-house.png",
    "unlockStoneConstruction",
    { resource: "lumber", amount: 5 },
    [
      { resource: "food", amount: 5, type: "additive" },
      { resource: "lumber", amount: 5, type: "additive" },
      { resource: "stone", amount: 5, type: "additive" },
    ],
    []
  );
  const quarries = new Building(
    "quarries",
    "gold-mine.png",
    "unlockStoneConstruction",
    { resource: "lumber", amount: 2 },
    [],
    [{ resource: "stone", amount: 0.06 }]
  );
  const schools = new Building(
    "schools",
    "graduate-cap.png",
    "unlockSchools",
    { resource: "lumber", amount: 3 },
    [],
    [{ resource: "research", amount: 0.06 }]
  );
  const libraries = new Building(
    "libraries",
    "book-cover.png",
    "unlockLibraries",
    { resource: "lumber", amount: 4 },
    [{ resource: "research", amount: 5, type: "additive" }],
    []
  );
  const huntingCamps = new Building(
    "huntingCamps",
    "watch.png",
    "unlockHunting",
    { resource: "lumber", amount: 2 },
    [],
    []
  );
  const smithies = new Building(
    "smithies",
    "watch.png",
    "unlockSmithies",
    { resource: "lumber", amount: 3 },
    [],
    []
  );

  function Technology(name, cost, prereq) {
    this.name = name;
    this.cost = cost;
    this.prereq = prereq;
    this.status = "hidden";
    this.image = "enlightenment.png";
    this.buttonLabel = "Discover";
    this.discovered = false;
  }

  //technologies
  const farming = new Technology(
    "farming",
    { resource: "research", amount: 1 },
    "unlockLevelOneTech"
  );
  const woodConstruction = new Technology(
    "woodConstruction",
    { resource: "research", amount: 2 },
    "unlockLevelOneTech"
  );
  const stoneConstruction = new Technology(
    "stoneConstruction",
    { resource: "research", amount: 5 },
    "unlockLevelOneTech"
  );
  const wheel = new Technology(
    "wheel",
    { resource: "research", amount: 5 },
    "unlockLevelOneTech"
  );

  function Prereq(name, requirement) {
    this.name = name;
    this.requirement = requirement;
    this.unlocked = false;
  }

  //prereqs
  const unlockHuts = new Prereq("unlockHuts", { resource: "food", amount: 1 });
  const unlockVillagers = new Prereq("unlockVillagers", {
    resource: "villagers",
    amount: 1,
  });
  const unlockLevelOneTech = new Prereq("unlockLevelOneTech", {
    resource: "research",
    amount: 1,
  });
  const unlockFarming = new Prereq("unlockFarming", { technology: "farming" });
  const unlockWoodConstruction = new Prereq("unlockWoodConstruction", {
    technology: "woodConstruction",
  });
  const unlockStoneConstruction = new Prereq("unlockStoneConstruction", {
    technology: "stoneConstruction",
  });
  const unlockWheel = new Prereq("unlockWheel", { technology: "wheel" });
  const unlockSchools = new Prereq("unlockSchools", {
    resource: "villagers",
    amount: 30,
  });
  const unlockLibraries = new Prereq("unlockLibraries", {
    resource: "villagers",
    amount: 50,
  });

  const resources = {
    food: food,
    lumber: lumber,
    research: research,
    villagers: villagers,
    stone: stone,
  };
  const buildings = {
    huts: huts,
    farms: farms,
    lumberMills: lumberMills,
    storerooms: storerooms,
    quarries: quarries,
    schools: schools,
    libraries: libraries,
  };
  const jobs = {
    idlers: idlers,
    farmers: farmers,
    foresters: foresters,
    hunters: hunters,
    miners: miners,
    builders: builders,
    thinkers: thinkers,
  };
  const technologies = {
    farming: farming,
    woodConstruction: woodConstruction,
    stoneConstruction: stoneConstruction,
    wheel: wheel,
  };
  const progress = {
    unlockHuts: unlockHuts,
    unlockVillagers: unlockVillagers,
    unlockLevelOneTech: unlockLevelOneTech,
    unlockFarming: unlockFarming,
    unlockWoodConstruction: unlockWoodConstruction,
    unlockStoneConstruction: unlockStoneConstruction,
    unlockSchools: unlockSchools,
    unlockLibraries: unlockLibraries,
  };

  return {
    resources: resources,
    buildings: buildings,
    jobs: jobs,
    technologies: technologies,
    progress: progress,
  };
};

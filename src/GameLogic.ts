import React from "react";
import { MS_PER_TICK } from "./constants";
import { resources, villagers, buildings, techs } from "./default_state";
import useInterval from "./hooks/useInterval";
import useStore from "./store";
import shallow from "zustand/shallow";
import { Milestone, ResourceAmount } from "./types";

export interface Perf {
  max: number;
  recent: number[];
}

function GameLogic() {
  const { perf, setPerf } = useStore(
    (state) => ({
      perf: state.perf,
      setPerf: state.setPerf,
    }),
    shallow
  );

  const game = useStore((state) => ({
    resources: state.resources,
    villagers: state.villagers,
    buildings: state.buildings,
    techs: state.techs,
    milestones: state.milestones,

    defaultJob: state.defaultJob,
    villagerCreatedAt: state.villagerCreatedAt,
    isIncomingVillager: state.isIncomingVillager,
  }));
  const adjustVillager = useStore((state) => state.adjustVillager);
  const adjustResource = useStore((state) => state.adjustResource);
  const setMilestones = useStore((state) => state.setMilestones);
  const setVillagerCreatedAt = useStore((state) => state.setVillagerCreatedAt);
  const setIsIncomingVillager = useStore(
    (state) => state.setIsIncomingVillager
  );

  const setResources = useStore((state) => state.setResources);
  const setVillagers = useStore((state) => state.setVillagers);
  const setBuildings = useStore((state) => state.setBuildings);
  const setTechs = useStore((state) => state.setTechs);

  const checkMilestones = () => {
    Object.values(game.milestones)
      .filter((milestone) => !milestone.reached)
      .forEach((milestone) => {
        const requirement = milestone.prereq;

        const unlockIt =
          (typeof requirement === "string" &&
            game.techs[requirement as keyof typeof techs].discovered) ||
          ((requirement as { tech: string }).tech &&
            game.techs[(requirement as { tech: keyof typeof techs }).tech]
              .discovered) ||
          ((requirement as ResourceAmount).resource &&
            game.resources[(requirement as ResourceAmount).resource].amount >=
              (requirement as ResourceAmount).amount);

        if (unlockIt) {
          setMilestones({
            ...game.milestones,
            [milestone.name]: { ...milestone, reached: true },
          });
          applyMilestone(milestone);
        }
      });
  };

  // go through every game object, looking for ones whose prereq = this progressObject. Make it visible
  // todo: consider what happens if you have multiple prereqs
  const applyMilestone = (milestone: Milestone) => {
    Object.values(game.resources).forEach((i) => {
      if (i.prereq === milestone.name) {
        setResources({
          ...game.resources,
          [i.name]: {
            ...game.resources[i.name as keyof typeof resources],
            status: "visible",
          },
        });
      }
    });
    Object.values(game.villagers).forEach((i) => {
      if (i.prereq === milestone.name) {
        setVillagers({
          ...game.villagers,
          [i.name]: {
            ...game.villagers[i.name as keyof typeof villagers],
            status: "visible",
          },
        });
      }
    });
    Object.values(game.buildings).forEach((i) => {
      if (i.prereq === milestone.name) {
        setBuildings({
          ...game.buildings,
          [i.name]: {
            ...game.buildings[i.name as keyof typeof buildings],
            status: "visible",
          },
        });
      }
    });
    Object.values(game.techs).forEach((i) => {
      if (i.prereq === milestone.name) {
        setTechs({
          ...game.techs,
          [i.name]: {
            ...game.techs[i.name as keyof typeof techs],
            status: "visible",
          },
        });
      }
    });
  };

  const updateResourceLimits = () => {
    Object.entries(game.resources).forEach(([resourceKey, resource]) => {
      let multiplicativeMod = 0;
      let additiveMod = 0;
      Object.values(game.buildings)
        .filter((building) => building.resourceLimitModifiers.length > 0)
        .forEach((building) => {
          building.resourceLimitModifiers
            .filter((limitMod) => limitMod.resource === resource.name)
            .forEach((limitMod) => {
              if (limitMod.type === "mult")
                multiplicativeMod += building.amount * limitMod.amount;
              if (limitMod.type === "add")
                additiveMod += building.amount * limitMod.amount;
            });
        });

      const newLimit =
        (resource.baseLimit + additiveMod) * (1 + multiplicativeMod);
      setResources({
        ...game.resources,
        [resourceKey]: { ...resource, limit: newLimit },
      });
    });
  };

  // determine resource rates, including villagers eating
  // apply rates to amounts
  // handle starvation
  // handle more workers than villagers
  const updateResources = () => {
    Object.values(game.resources).forEach((resource) => {
      let multiplicativeMod = 0;
      Object.values(game.buildings).forEach((building) => {
        building.bonus.forEach((bonus) => {
          if (bonus.resource === resource.name)
            multiplicativeMod += building.amount * bonus.amount;
        });
      });

      let additiveMod = 0;
      Object.values(game.villagers).forEach((job) => {
        job.production.forEach((production) => {
          if (production.resource === resource.name)
            additiveMod += job.amount * production.amount;
        });
      });

      let newRate = additiveMod * (1 + multiplicativeMod);

      // villagers gotta eat
      if (resource.name === "food")
        newRate = newRate - 0.045 * game.resources.villagers.amount;

      setResources({
        ...game.resources,
        [resource.name]: { ...resource, rate: newRate },
      });
      adjustResource(
        resource.name as keyof typeof resources,
        newRate * (MS_PER_TICK / 1000)
      ); // apply rate per tick
    });

    // Starvation
    if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0) {
      adjustResource("villagers", -1);
      adjustResource("food", 0.05); // slight buffer
      removeWorker();
    }

    const workerCount = Object.values(game.villagers).reduce(
      (sum, job) => sum + job.amount,
      0
    );

    // more workers than villagers
    if (workerCount > game.resources.villagers.amount) removeWorker();
  };

  const removeWorker = () => {
    if (game.villagers.idlers.amount > 0) {
      adjustVillager("idlers", -1);
      return;
    }

    const job = Object.values(game.villagers).find((job) => job.amount > 0);
    if (job) {
      adjustVillager(job.name as keyof typeof villagers, -1);
    }
  };

  const createVillager = () => {
    const spacesAvailable =
      game.resources.villagers.limit - game.resources.villagers.amount;

    let villagersToCreate =
      Math.floor(Math.sqrt(game.resources.villagers.amount)) - 1;
    villagersToCreate = Math.min(villagersToCreate, spacesAvailable);
    if (villagersToCreate < 1) villagersToCreate = 1;

    adjustResource("villagers", villagersToCreate);
    adjustVillager(game.defaultJob, villagersToCreate);
    setIsIncomingVillager(false);
  };

  const isCreateVillager = () => {
    const isVillagerCreationPossible =
      game.resources.villagers.amount < game.resources.villagers.limit &&
      game.resources.food.amount > 0;
    if (isVillagerCreationPossible) {
      if (game.isIncomingVillager === false) {
        setIsIncomingVillager(true);
        setVillagerCreatedAt(Date.now());
      }

      const msSinceLastVillager = Date.now() - game.villagerCreatedAt;

      const rand = Math.random() * (20000 * (1000 / MS_PER_TICK));
      return rand < msSinceLastVillager;
    }
    return false;
  };

  const doGameTick = () => {
    checkMilestones();
    updateResourceLimits();
    updateResources();
    if (isCreateVillager()) createVillager();
  };

  const updatePerf = (start: number) => {
    console.log("tick");
    const tickDuration = Date.now() - start;
    setPerf({
      max: Math.max(perf.max, tickDuration),
      recent: [tickDuration, ...perf.recent].slice(
        perf.recent.length > 100 ? 1 : 0,
        101
      ),
    });
  };

  // useInterval(() => {
  //   const start = Date.now();
  //   doGameTick();
  //   updatePerf(start);
  // }, MS_PER_TICK);

  return null;
}

export default GameLogic;

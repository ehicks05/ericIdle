import create from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { Perf } from "./components/Settings";
import {
  buildings,
  milestones,
  resources,
  techs,
  villagers,
} from "./default_state";
import { GameState } from "./types";

export interface GameStore {
  resources: typeof resources;
  villagers: typeof villagers;
  buildings: typeof buildings;
  techs: typeof techs;
  milestones: typeof milestones;
  setResources: (data: typeof resources) => void;
  setResource: (name: keyof typeof resources, amount: number) => void;
  adjustResource: (name: keyof typeof resources, amount: number) => void;
  setVillagers: (data: typeof villagers) => void;
  adjustVillager: (name: keyof typeof villagers, amount: number) => void;
  setBuildings: (data: typeof buildings) => void;
  setTechs: (data: typeof techs) => void;
  setMilestones: (data: typeof milestones) => void;

  setGame: (data: GameState) => void;

  defaultJob: keyof typeof villagers;
  villagerCreatedAt: number;
  isIncomingVillager: boolean;
  perf: Perf;
  setDefaultJob: (data: keyof typeof villagers) => void;
  setVillagerCreatedAt: (data: number) => void;
  setIsIncomingVillager: (data: boolean) => void;
  setPerf: (data: Perf) => void;
}

const useStore = create<GameStore>(
  subscribeWithSelector(
    persist(
      devtools((set) => ({
        resources,
        villagers,
        buildings,
        techs,
        milestones,
        setResources: (data) => set({ resources: data }),
        setResource: (name, amount) =>
          set((state) => ({
            resources: {
              ...state.resources,
              [name]: {
                ...state.resources[name],
                amount: amount,
              },
            },
          })),
        adjustResource: (name, amount) =>
          set((state) => {
            const newAmount = Math.min(
              state.resources[name].amount + amount,
              state.resources[name].limit
            );
            return {
              resources: {
                ...state.resources,
                [name]: {
                  ...state.resources[name],
                  amount: newAmount,
                },
              },
            };
          }),
        setVillagers: (data) => set({ villagers: data }),
        adjustVillager: (name, amount) =>
          set((state) => ({
            villagers: {
              ...state.villagers,
              [name]: {
                ...state.villagers[name],
                amount: state.villagers[name].amount + amount,
              },
            },
          })),
        setBuildings: (data) => set({ buildings: data }),
        setTechs: (data) => set({ techs: data }),
        setMilestones: (data) => set({ milestones: data }),

        setGame: (data) =>
          set({
            resources: data.resources,
            villagers: data.villagers,
            buildings: data.buildings,
            techs: data.techs,
            milestones: data.milestones,

            defaultJob: data.defaultJob,
            villagerCreatedAt: data.villagerCreatedAt,
            isIncomingVillager: data.isIncomingVillager,
          }),

        defaultJob: "idlers" as keyof typeof villagers,
        villagerCreatedAt: Date.now(),
        isIncomingVillager: false,
        perf: { max: 0, recent: [0] },
        setDefaultJob: (data) => set({ defaultJob: data }),
        setVillagerCreatedAt: (data) => set({ villagerCreatedAt: data }),
        setIsIncomingVillager: (data) => set({ isIncomingVillager: data }),
        setPerf: (data) => set({ perf: data }),
      })),
      {
        name: "store",
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => !["perf"].includes(key))
          ),
      }
    )
  )
);

export default useStore;

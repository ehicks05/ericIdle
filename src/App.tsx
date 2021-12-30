import React, { useState } from "react";
import {
  Resources,
  Buildings,
  Villagers,
  Technologies,
  Settings,
} from "./components";
import GameLogic from "./GameLogic";
import useStore from "./store";

function App() {
  const milestones = useStore((state) => state.milestones);
  const [activeTab, setActiveTab] = useState("Buildings");

  const tabs = [
    {
      name: "Buildings",
      unlocked: milestones.unlockHuts.reached,
      component: <Buildings />,
    },
    {
      name: "Villagers",
      unlocked: milestones.unlockVillagers.reached,
      component: <Villagers />,
    },
    {
      name: "Technologies",
      unlocked: milestones.unlockLevelOneTech.reached,
      component: <Technologies />,
    },
    {
      name: "Settings",
      unlocked: true,
      component: <Settings />,
    },
  ];

  return (
    <div className="font-mono text-black dark:text-white bg-white dark:bg-gray-900">
      <GameLogic />
      <div className="min-h-screen p-6 flex flex-col mx-auto space-y-6">
        <section>
          <div className="text-5xl font-bold">
            <span>Eric</span>
            <span style={{ color: "green" }}>Idle</span>
          </div>
        </section>
        <section>
          <div>
            <div className="md:flex md:flex-row space-y-6 md:space-y-0 md:space-x-12">
              <div>
                <Resources />
              </div>
              <div>
                <div className="max-w-full overflow-x-auto flex space-x-5 mb-2 border-b">
                  {tabs
                    .filter((tab) => tab.unlocked)
                    .map((tab) => {
                      return (
                        <a
                          href="/#"
                          key={tab.name}
                          className={`mb-2
                              ${tab.name !== activeTab ? "opacity-50" : ""}
                            `}
                          onClick={() => setActiveTab(tab.name)}
                        >
                          {tab.name}
                        </a>
                      );
                    })}
                </div>
                {tabs.find((tab) => tab.unlocked && tab.name === activeTab)
                  ?.component || <div />}
              </div>
            </div>
          </div>
        </section>
        <section className="flex-grow"></section>
        <footer className="p-6 text-center">hi</footer>
      </div>
    </div>
  );
}

export default App;

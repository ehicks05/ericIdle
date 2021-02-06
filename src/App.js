import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { MS_PER_TICK } from "./constants";
import useInterval from "./hooks/useInterval";
import {
  Resources,
  Buildings,
  Villagers,
  Technologies,
  Settings,
} from "./components";
import * as gameLogic from "./game";

function App() {
  const [game, updateGame] = useImmer({ ...gameLogic.getDefaultGameState() });

  // ui state
  const [activeTab, setActiveTab] = useState("Buildings");
  let [perf, setPerf] = useState({ max: 0, recent: [] });

  const updatePerf = (start) => {
    console.log("tick");
    const tickDuration = Date.now() - start;
    const draft = { ...perf };
    draft.recent.push(tickDuration);
    if (draft.recent.length > 100) draft.recent = draft.recent.slice(1, 101);
    if (tickDuration > perf.max) draft.max = tickDuration;
    setPerf(draft);
  };

  useInterval(() => {
    let start = Date.now();
    gameLogic.doGameTick(game, updateGame);
    localStorage.setItem("persistedGame", JSON.stringify(game));
    updatePerf(start);
  }, MS_PER_TICK);

  useEffect(() => {
    if (localStorage.getItem("persistedGame"))
      updateGame((draft) => {
        return JSON.parse(localStorage.getItem("persistedGame"));
      });
  }, [updateGame]);

  const tabs = [
    {
      name: "Buildings",
      unlocked: game.progress.unlockHuts.unlocked,
    },
    {
      name: "Villagers",
      unlocked: game.progress.unlockVillagers.unlocked,
    },
    {
      name: "Technologies",
      unlocked: game.progress.unlockLevelOneTech.unlocked,
    },
    {
      name: "Settings",
      unlocked: true,
    },
  ];

  return (
    <div className="font-mono text-black dark:text-white bg-white dark:bg-gray-900">
      <div className="min-h-screen flex flex-col container mx-auto space-y-6">
        <section>
          <div>
            <div className="text-5xl font-bold p-4">
              <span>Eric</span>
              <span style={{ color: "green" }}>Idle</span>
            </div>
          </div>
        </section>
        <section>
          <div>
            <div className="md:flex md:flex-row">
              <div className="p-4">
                <div className="pb-2 border-b">
                  <a href="/#">Resources</a>
                </div>
                <Resources game={game} updateGame={updateGame} />
              </div>
              <div className="p-4">
                <div className="flex space-x-5 border-b">
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
                {game.progress.unlockHuts.unlocked &&
                  activeTab === "Buildings" && (
                    <Buildings game={game} updateGame={updateGame} />
                  )}
                {game.progress.unlockVillagers.unlocked &&
                  activeTab === "Villagers" && (
                    <Villagers game={game} updateGame={updateGame} />
                  )}
                {game.progress.unlockLevelOneTech.unlocked &&
                  activeTab === "Technologies" && (
                    <Technologies game={game} updateGame={updateGame} />
                  )}
                {activeTab === "Settings" && (
                  <Settings game={game} updateGame={updateGame} perf={perf} />
                )}
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

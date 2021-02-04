import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import ReactJson from "react-json-view";
import { MS_PER_TICK } from "./constants";
import useInterval from "./hooks/useInterval";
import Buildings from "./components/Buildings";
import Resources from "./components/Resources";
import Technologies from "./components/Technologies";
import Villagers from "./components/Villagers";
import * as gameLogic from "./game.js";
import Button from "./components/Button";
import "./App.css";

function App() {
  const [game, updateGame] = useImmer({ ...gameLogic.getDefaultGameState() });

  // ui state
  const [activeTab, setActiveTab] = useState("Buildings");
  // let tickDurations = useRef({ max: 0, recent: [] });
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
    <div className="text-black dark:text-white bg-white dark:bg-gray-900">
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
            <div className="flex flex-row columns is-variable is-0-mobile">
              <div className="p-4">
                <div className="border-b">
                  <a href="/#">Resources</a>
                </div>
                <Resources game={game} updateGame={updateGame} />
              </div>
              <div className="p-4">
                <div className="border-b">
                  <ul className="flex flex-row space-x-4">
                    {tabs
                      .filter((tab) => tab.unlocked)
                      .map((tab) => {
                        return (
                          <li
                            key={tab.name}
                            className={
                              activeTab === tab.name ? "" : "text-gray-400"
                            }
                          >
                            <a href="/#" onClick={() => setActiveTab(tab.name)}>
                              {tab.name}
                            </a>
                          </li>
                        );
                      })}
                  </ul>
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

const Settings = ({ game, updateGame, perf }) => {
  const [copyResult, setCopyResult] = useState("unknown");
  const [importText, setImportText] = useState("");
  const [isImportTextValid, setIsImportTextValid] = useState(false);

  useEffect(() => {
    if (["success", "error"].includes(copyResult))
      setTimeout(() => setCopyResult("unknown"), 750);
  }, [copyResult]);

  useEffect(() => {
    try {
      JSON.parse(atob(importText));
      setIsImportTextValid(true);
    } catch (e) {
      setIsImportTextValid(false);
    }
  }, [importText]);

  function exportState(state) {
    return btoa(JSON.stringify(state));
  }

  function importState(state) {
    updateGame((_draft) => JSON.parse(atob(state)));
  }

  const reset = () => {
    if (window.confirm("Are you sure you? All progress will be lost.")) {
      importState(exportState(gameLogic.getDefaultGameState()));
    }
  };

  const performImport = () => {
    importState(importText);
    setImportText("");
  };

  function copy() {
    updateClipboard(exportState(game));
  }

  function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(
      function () {
        setCopyResult("success");
      },
      function () {
        setCopyResult("error");
      }
    );
  }

  return (
    <>
      <h1 className="subtitle mt-4">Import/Export/Reset</h1>
      <textarea
        className="text-black dark:text-white bg-white dark:bg-gray-800"
        placeholder="Paste save here..."
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
      />
      <div className="mt-4 space-x-2">
        <Button
          className={`${
            importText && !isImportTextValid ? "bg-red-700" : undefined
          }`}
          title={importText && !isImportTextValid ? "Invalid input" : undefined}
          disabled={!importText || !isImportTextValid}
          onClick={performImport}
        >
          Import
        </Button>
        <Button
          className={`${
            copyResult === "success"
              ? "bg-green-700"
              : copyResult === "error"
              ? "bg-red-700"
              : undefined
          }`}
          onClick={copy}
        >
          Export
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
      <h1 className="subtitle mt-4">Debug Info</h1>
      <p>
        Average tick duration:{" "}
        {(
          perf.recent.reduce((agg, cur) => agg + cur) / perf.recent.length
        ).toFixed(2)}{" "}
        ms (max: {perf.max} ms)
      </p>
      {/* State: <ReactJson src={game} collapsed={1} theme="monokai" /> */}
      {/* State: <pre>{JSON.stringify(game, null, 2)}</pre> */}
    </>
  );
};

export default App;

import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { MS_PER_TICK } from "./constants";
import useInterval from "./hooks/useInterval";
import Buildings from "./components/Buildings";
import Resources from "./components/Resources";
import Technologies from "./components/Technologies";
import Villagers from "./components/Villagers";
import * as gameLogic from "./game.js";
import "./App.css";

function App() {
  const [game, updateGame] = useImmer({
    ...gameLogic.getDefaultGameState(),
    villagerCreatedAt: Date.now(),
    isIncomingVillager: false,
  });

  // ui state
  const [activeTab, setActiveTab] = useState("Buildings");
  // let tickDurations = useRef({ max: 0, recent: [] });
  let [perf, setPerf] = useState({ max: 0, recent: [] });

  const updatePerf = (start) => {
    console.log("tick");
    const tickDuration = Date.now() - start;
    const newRecent = [...perf.recent];
    newRecent.push(tickDuration);
    setPerf({ ...perf, recent: newRecent });
    if (perf.recent.length > 100)
      setPerf({ ...perf, recent: [...perf.recent].slice(1, 101) });
    if (tickDuration > perf.max) setPerf({ ...perf, max: tickDuration });
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

  return (
    <>
      <section className="section">
        <div>
          <div className="title">
            <span>Eric</span>
            <span style={{ color: "green" }}>Idle</span>
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div>
          <div className="columns is-variable is-0-mobile">
            <div className="column" style={{ maxWidth: "24rem" }}>
              <div className="tabs is-small">
                <ul>
                  <li className="is-active">
                    <a href="/#">Resources</a>
                  </li>
                </ul>
              </div>
              <Resources game={game} updateGame={updateGame} />
            </div>
            <div className="column">
              <div className="tabs is-small">
                <ul>
                  {[
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
                  ]
                    .filter((tab) => tab.unlocked)
                    .map((tab) => {
                      return (
                        <li
                          key={tab.name}
                          className={
                            activeTab === tab.name ? "is-active" : undefined
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
    </>
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
        className="textarea is-small"
        placeholder="Paste save here..."
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
      />
      <div className="mt-4 buttons">
        <button
          className={`button is-small ${
            importText && !isImportTextValid ? "is-danger" : undefined
          }`}
          title={importText && !isImportTextValid ? "Invalid input" : undefined}
          disabled={!importText || !isImportTextValid}
          onClick={performImport}
        >
          Import
        </button>
        <button
          className={`button is-small ${
            copyResult === "success"
              ? "is-success"
              : copyResult === "error"
              ? "is-danger"
              : undefined
          }`}
          onClick={copy}
        >
          Export
        </button>
        <button className="button is-small" onClick={reset}>
          Reset
        </button>
      </div>
      <h1 className="subtitle mt-4">Debug Info</h1>
      <p>
        Average tick duration:{" "}
        {(
          perf.recent.reduce((agg, cur) => agg + cur) / perf.recent.length
        ).toFixed(2)}{" "}
        ms
        <br />
        Max: {perf.max} ms
      </p>
    </>
  );
};

export default App;

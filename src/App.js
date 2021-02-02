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
  let longestTickInMs = useRef(0);

  useInterval(() => {
    let start = Date.now();

    gameLogic.doGameTick(game, updateGame);
    localStorage.setItem("persistedGame", JSON.stringify(game));
    console.log("tick");

    let end = Date.now();
    if (end - start > longestTickInMs.current)
      longestTickInMs.current = end - start;
  }, MS_PER_TICK);

  useEffect(() => {
    if (localStorage.getItem("persistedGame"))
      updateGame((draft) => {
        return JSON.parse(localStorage.getItem("persistedGame"));
      });
  }, [updateGame]);

  return (
    <>
      <section>
        <div className="container">
          <div className="title">
            <span>Eric</span>
            <span style={{ color: "green" }}>Idle</span>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="columns">
            <div className="column">
              <Resources game={game} updateGame={updateGame} />
            </div>
            <div className="column">
              <section>
                <div className="tabs">
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
              </section>
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
                <Settings
                  game={game}
                  updateGame={updateGame}
                  longestTickInMs={longestTickInMs}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const Settings = ({ game, updateGame, longestTickInMs }) => {
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
    if (
      window.confirm(
        "Are you sure you want to reset the game? All progress will be lost."
      )
    ) {
      updateGame((_draft) => gameLogic.getDefaultGameState());
      window.location.reload(); // otherwise view detaches from state
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
        className="textarea"
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
        Longest time taken in a single game tick: {longestTickInMs.current} ms
      </p>
    </>
  );
};

export default App;

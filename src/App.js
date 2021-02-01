import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { BsMoon, BsSun } from "react-icons/bs";
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
    darkMode: false,
    paused: false,
  });

  // ui state
  const [activeTab, setActiveTab] = useState("Buildings");
  let longestTickInMs = useRef(0);

  useInterval(
    () => {
      let start = Date.now();

      gameLogic.doGameTick(game, updateGame);
      localStorage.setItem("persistedGame", JSON.stringify(game));
      console.log(game.resources.food.amount);

      let end = Date.now();
      if (end - start > longestTickInMs.current)
        longestTickInMs.current = end - start;
    },
    game.paused ? null : MS_PER_TICK
  );

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

  useEffect(() => {
    if (["success", "error"].includes(copyResult))
      setTimeout(() => setCopyResult("unknown"), 750);
  }, [copyResult]);

  function pause() {
    updateGame((draft) => {
      draft.paused = !draft.paused;
      return;
    });
  }

  function toggleDarkMode() {
    updateGame((draft) => {
      draft.darkMode = !draft.darkMode;
      return;
    });
  }

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
    importState(document.getElementById("importTextField").value);
    document.getElementById("importTextField").value = "";
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
      <hr />
      <div className="buttons">
        <button className="button is-small" onClick={pause}>
          {game.paused ? "Resume" : "Pause"}
        </button>
        <button className="button is-small" onClick={reset}>
          Reset
        </button>
        <button className="button is-small" onClick={toggleDarkMode}>
          <span className="icon">{game.darkMode ? <BsSun /> : <BsMoon />}</span>
        </button>
      </div>
      <hr />
      <p>
        Longest time taken in a single game tick: {longestTickInMs.current} ms
      </p>
      <hr />
      <h1>Export Save</h1>
      <button
        className={`button is-small ${
          copyResult === "success"
            ? "is-success"
            : copyResult === "error"
            ? "is-danger"
            : "is-info"
        }`}
        onClick={copy}
      >
        Export
      </button>
      <input type="hidden" />
      <hr />
      <h1>Import Save</h1>
      <textarea
        id="importTextField"
        rows="6"
        cols="44"
        placeholder="Paste save here..."
      />
      <br />
      <button className="button is-small" onClick={performImport}>
        Import
      </button>
    </>
  );
};

export default App;

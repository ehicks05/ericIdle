import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import useInterval from "./useInterval";
import Buildings from "./Buildings";
import Resources from "./Resources";
import Technologies from "./Technologies";
import Villagers from "./Villagers";
import * as gameLogic from "./game.js";
import { BsMoon, BsSun } from "react-icons/bs";
import "./App.css";

const MS_PER_TICK = 200;

function App() {
  const [game, updateGame] = useImmer({
    ...gameLogic.getDefaultGameState(),
    villagerCreatedAt: Date.now(),
    isIncomingVillager: false,
    msPerTick: MS_PER_TICK,
  });

  // ui state
  const [activeTab, setActiveTab] = useState("Buildings");
  const [darkMode, setDarkMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [copyResult, setCopyResult] = useState("unknown");
  let longestTickInMs = useRef(0);

  useEffect(() => {
    if (["success", "error"].includes(copyResult))
      setTimeout(() => setCopyResult("unknown"), 750);
  }, [copyResult]);

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
    paused ? null : game.msPerTick
  );

  useEffect(() => {
    if (localStorage.getItem("persistedGame"))
      updateGame((draft) => {
        return JSON.parse(localStorage.getItem("persistedGame"));
      });
  }, [updateGame]);

  function pause() {
    setPaused(!paused);
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
    )
      updateGame((_draft) => gameLogic.getDefaultGameState());
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
                    {["Buildings", "Villagers", "Technologies", "Settings"].map(
                      (tab) => {
                        return (
                          <li
                            key={tab}
                            className={
                              activeTab === tab ? "is-active" : undefined
                            }
                          >
                            <a href="/#" onClick={() => setActiveTab(tab)}>
                              {tab}
                            </a>
                          </li>
                        );
                      }
                    )}
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
                <>
                  <div className="buttons">
                    <button className="button" onClick={pause}>
                      {paused ? "Resume" : "Pause"}
                    </button>
                    <button className="button" onClick={reset}>
                      Reset
                    </button>
                    <button
                      className="button"
                      onClick={() => setDarkMode(!darkMode)}
                    >
                      <a className="icon">
                        {darkMode ? <BsSun /> : <BsMoon />}
                      </a>
                    </button>
                  </div>
                  <hr />
                  <p>
                    Longest time taken in a single game tick:{" "}
                    {longestTickInMs.current} ms
                  </p>
                  <hr />
                  <h1>Export Save</h1>
                  <button
                    className={`button ${
                      copyResult === "success"
                        ? "is-success"
                        : copyResult === "error"
                        ? "is-danger"
                        : "is-info"
                    }`}
                    onClick={copy}
                  >
                    Click Here
                  </button>
                  <input type="hidden" />
                  <hr />
                  <h1>Import Save</h1>
                  <label htmlFor="exportTextField">Paste save here:</label>
                  <br />
                  <textarea id="importTextField" rows="12" cols="44" />
                  <br />
                  <button className="button is-small" onClick={performImport}>
                    Import
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const Settings = () => {
  return (
    
  );
}

export default App;

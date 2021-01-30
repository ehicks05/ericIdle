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

  const showExport = () => {
    document.getElementById("exportTextField").val(exportState(game));
  };
  const showImport = () => {
    // document.getElementById("exportTextField").val(exportState(game));
  };
  const showDebug = () => {
    // document.getElementById("exportTextField").val(exportState(game));
  };
  const performImport = () => {
    const textAreaValue = document.getElementById("importTextField").val();
    importState(textAreaValue);
    document.getElementById("importTextField").val("");
    document.getElementById("dialog-import").modal("hide");
  };

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
                    <button className="button" onClick={showExport}>
                      Export
                    </button>
                    <button className="button" onClick={showImport}>
                      Import
                    </button>
                    <button className="button" onClick={reset}>
                      Reset
                    </button>
                    <button className="button" onClick={showDebug}>
                      Debug
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
                  <label htmlFor="exportTextField">Copy this:</label>
                  <br />
                  <textarea
                    id="exportTextField"
                    rows="12"
                    cols="44"
                    readOnly
                    value={exportState(game)}
                  />
                  <hr />
                  <h1>Import Save</h1>
                  <label htmlFor="exportTextField">Paste save here:</label>
                  <br />
                  <textarea id="importTextField" rows="12" cols="44" />
                  <br />
                  <button
                    className="button is-small"
                    onClick={() =>
                      importState(
                        document.getElementById("importTextField").value
                      )
                    }
                  >
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

export default App;

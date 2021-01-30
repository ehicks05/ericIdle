import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import useInterval from "./useInterval";
import Buildings from "./Buildings";
import Resources from "./Resources";
import Technologies from "./Technologies";
import Villagers from "./Villagers";
import * as gameLogic from "./game.js";
import "./App.css";

function App() {
  const [game, updateGame] = useImmer(gameLogic.getDefaultGameState());
  const msPerTick = 200;
  let timeOfLastVillagerCreation = Date.now();
  let creatingAVillager = false;

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
      if (end - start > longestTickInMs) longestTickInMs.current = end - start;
    },
    paused ? null : msPerTick
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
    <div id="app">
      <nav>
        <span>Eric</span>
        <span style={{ color: "green" }}>Idle</span>
        <button onClick={pause}>{paused ? "Resume" : "Pause"}</button>
        <button onClick={showExport}>export</button>
        <button onClick={showImport}>import</button>
        <button onClick={reset}>reset</button>
        <button onClick={showDebug}>debug</button>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </nav>
      <section>
        Resources:
        <Resources game={game} updateGame={updateGame} />
      </section>
      {game.progress.unlockHuts.unlocked && (
        <section>
          Buildings:
          <Buildings
            game={game}
            updateGame={updateGame}
            buildBuilding="buildBuilding"
            reclaimBuilding="reclaimBuilding"
          />
        </section>
      )}
      {game.progress.unlockVillagers.unlocked && (
        <section>
          Villagers:
          <Villagers
            jobs={Object.values(game.jobs) || []}
            assignWorker="assignWorker"
            unAssignWorker="unAssignWorker"
          />
        </section>
      )}
      {game.progress.unlockLevelOneTech.unlocked && (
        <section>
          Research:
          <Technologies
            technologies={Object.values(game.technologies) || []}
            research="game.resources.research"
            makeDiscovery="makeDiscovery"
          />
        </section>
      )}
      <section>
        Longest time taken in a single game tick: {longestTickInMs.current} ms
      </section>

      {/*<h1>Export Save</h1>*/}
      {/*<label htmlFor="exportTextField">Copy this:</label><br />*/}
      {/*<textarea id="exportTextField" rows="12" cols="44" readOnly />*/}

      {/*<h1>Import Save</h1>*/}
      {/*<label htmlFor="exportTextField">Paste save here:</label><br />*/}
      {/*<textarea id="importTextField" rows="12" cols="44" />*/}
    </div>
  );
}

export default App;

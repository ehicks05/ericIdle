import { useEffect, useRef, useState } from "react";
import Buildings from "./Buildings";
import Resources from "./Resources";
import Technologies from "./Technologies";
import Villagers from "./Villagers";
import * as gameLogic from "./game.js";
import "./App.css";
import { useImmer } from "use-immer";

function App() {
  const [game, updateGame] = useImmer(gameLogic.getDefaultGameState());
  const msPerTick = 200;
  let timeOfLastVillagerCreation = Date.now();
  let creatingAVillager = false;

  const [darkMode, setDarkMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let longestTickInMs = useRef(0);
  const intervalId = useRef(0);

  useEffect(() => {
    function intervalFunction() {
      let start = Date.now();

      gameLogic.doGameTick(game, updateGame);
      console.log("tick");
      localStorage.setItem("persistedGame", JSON.stringify(game));

      let end = Date.now();
      if (end - start > longestTickInMs) longestTickInMs.current = end - start;
    }

    if (isLoading && game.resources) {
      if (localStorage["persistedGame"])
        updateGame((draft) => {
          return JSON.parse(localStorage.getItem("persistedGame"));
        });
      intervalId.current = setInterval(intervalFunction, msPerTick);
      setIsLoading(false);
    }
    if (paused) {
      window.clearInterval(intervalId.current);
      intervalId.current = 0;
    }
    if (!paused) {
      intervalId.current = setInterval(intervalFunction, msPerTick);
    }
  }, [isLoading, game, updateGame, paused]);

  function pause() {
    setPaused(!paused);
  }

  function exportState(state) {
    return btoa(JSON.stringify(state));
  }

  function importState(state) {
    updateGame((draft) => JSON.parse(atob(state)));
  }

  const reset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the game? All progress will be lost."
      )
    )
      updateGame((draft) => gameLogic.getDefaultGameState());
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

  if (
    isLoading ||
    !game.resources ||
    !game.buildings ||
    !game.jobs ||
    !game.technologies ||
    !game.progress
  )
    return "Loading...";

  return (
    <div id="app">
      <nav>
        <span>Eric</span>
        <span style={{ color: "green" }}>Idle</span>
        <button onClick={pause}>pause</button>
        <button onClick={showExport}>export</button>
        <button onClick={showImport}>import</button>
        <button onClick={reset}>reset</button>
        <button onClick={showDebug}>debug</button>
        <button onClick={() => setDarkMode(!darkMode)}>darkMode</button>
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

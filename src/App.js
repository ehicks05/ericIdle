import './App.css';

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as gameLogic from './game.js'
import {useState} from "react";

let game = gameLogic.getDefaultGameState();

if (localStorage['persistedGame'])
{
  const parsedData = JSON.parse(localStorage.getItem('persistedGame'));
  console.log('parsed data');

  // merge saved state on top of the defaults
  mergeStateWorthSaving(game, parsedData);
}

game._intervalId = setInterval(intervalFunction, game.msPerTick);

function intervalFunction()
{
  let start = Date.now();

  gameLogic.checkProgress(game);
  gameLogic.updateResourceLimits(game);
  gameLogic.updateResources(game);
  if (gameLogic.isCreateVillager(game))
    gameLogic.createVillager(game);

  // $('[data-toggle="popover"]').popover();

  if (typeof(Storage) !== "undefined")
    localStorage.setItem('persistedGame', JSON.stringify(getStateWorthSaving(game)));

  let end = Date.now();
  if (end - start > game.longestTickInMs)
    game.longestTickInMs = end - start;
}

function getStateWorthSaving(state)
{
  return {
    resources: state.resources.filter(o => o.amount).map(o => ({[o.name]: o.amount})),
    buildings: state.buildings.filter(o => o.amount).map(o => ({[o.name]: o.amount})),
    jobs: state.jobs.filter(o => o.amount).map(o => ({[o.name]: o.amount})),
    technologies: state.technologies.filter(o => o.discovered).map(o => ({[o.name]: o.discovered})),
    progress: state.progress.filter(o => o.unlocked).map(o => ({[o.name]: o.unlocked})),
  };
}

function mergeStateWorthSaving(gameState, stateWorthSaving)
{
  stateWorthSaving.resources.forEach(o => gameState.resources[o.name].amount = o.amount);
  stateWorthSaving.buildings.forEach(o => gameState.buildings[o.name].amount = o.amount);
  stateWorthSaving.jobs.forEach(o => gameState.jobs[o.name].amount = o.amount);
  stateWorthSaving.technologies.forEach(o => gameState.technologies[o.name].discovered = o.discovered);
  stateWorthSaving.progress.forEach(o => gameState.progress[o.name].unlocked = o.unlocked);
}

function exportState(state)
{
  return btoa(JSON.stringify(getStateWorthSaving(state)));
}

function importState(encodedState)
{
  const parsedGame = JSON.parse(atob(encodedState));
  mergeStateWorthSaving(game, parsedGame);
  console.log('imported game state, food: ' + parsedGame.resources.food.amount);
}

function App() {
  const [game, setGame] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const msPerTick = 200;
  let longestTickInMs = 0;
  let timeOfLastVillagerCreation = Date.now();
  let creatingAVillager = false;
  let _intervalId = null;

  function pause()
  {
    if (!game._intervalId)
    {
      game._intervalId = setInterval(intervalFunction, game.msPerTick);
      setPaused(false);
    }
    else
    {
      window.clearInterval(game._intervalId);
      game._intervalId = null;
      setPaused(true);
    }
  }

  const harvestFood = () => {
    gameLogic.updateResource(game, 'food', 1);
  };
  const buildBuilding = (buildingName) => {
    gameLogic.buildBuilding(game, buildingName);
  };
  const reclaimBuilding = (buildingName) => {
    gameLogic.reclaimBuilding(game, buildingName);
  };
  const assignWorker = (jobName) => {
    if (game.jobs.idlers.amount > 0)
    {
      game.jobs[jobName].amount += 1;
      game.jobs.idlers.amount -= 1;
    }
  };
  const unAssignWorker = (jobName) => {
    if (game.jobs[jobName].amount > 0)
    {
      game.jobs[jobName].amount -= 1;
      game.jobs.idlers.amount += 1;
    }
  };
  const makeDiscovery = (technologyName) => {
    const canAfford = game.resources.research.amount >= game.technologies[technologyName].cost.amount;
    if (canAfford)
    {
      gameLogic.updateResource(game, 'research', -game.technologies[technologyName].cost.amount);
      game.technologies[technologyName].discovered = true;
    }
  };
  const reset = () => {
    if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      const intervalId = game._intervalId;
      setGame({...game, ...gameLogic.getDefaultGameState()})
      game._intervalId = intervalId;
    }
  };

  const showExport = () => {
    document.getElementById( "exportTextField").val(exportState(game));
  };
  const performImport =  () => {
    const textAreaValue = document.getElementById("importTextField").val();
    importState(textAreaValue);
    document.getElementById( "importTextField").val('');

    document.getElementById('dialog-import').modal('hide')
  };

  return (
      <div id="app">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#"><span>Eric</span>
            <span style={{color: 'green'}}>Idle</span></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <input type="button" className="mx-1 btn btn-outline-secondary btn-sm" value="pause" onClick={pause}
                     id="pauseButton"/>
              <input type="button" className="mx-1 btn btn-outline-secondary btn-sm" value="export" data-toggle="modal"
                     data-target="#dialog-export" onClick={showExport}/>
              <input type="button" className="mx-1 btn btn-outline-secondary btn-sm" value="import" data-toggle="modal"
                     data-target="#dialog-import"/>
              <input type="button" className="mx-1 btn btn-outline-danger btn-sm" value="reset" onClick={() => reset()}/>
              <input type="button" className="mx-1 btn btn-outline-secondary btn-sm" value="debug" data-toggle="modal"
                     data-target="#dialog-debug"/>
              <input type="button" className="mx-1 btn btn-outline-info btn-sm" value="night mode" id="nightModeButton"
                     onClick={setDarkMode(!darkMode)}/>
            </ul>
          </div>
        </nav>

        <div className="row" style={{maxWidth: '950px', margin: 'auto'}}>

          <div className="col-md-6" style={{verticalAlign: 'top'}}>
            <div>
              <ul className={"nav nav-fill mt-1" + game.nightMode ? 'nightModeText' : ''} role="tablist">
                <li className="nav-item">
                  <a className={"nav-link active transparent" + game.nightMode ? 'nightModeText': ''}
                     id="resources-tab" href="#resourcesTable" aria-controls="resourcesTable" aria-selected="true"
                     role="tab" data-toggle="tab">Resources</a>
                </li>
              </ul>
            </div>

            <div className="tab-content">
              <div role="tabpanel" className="tab-pane fade show active" id="resourcesTable"
                   aria-labelledby="resources-tab">
                <resource-table
                    v-bind:resources="game.resources"
                    v-on:harvestFood="harvestFood">
                </resource-table>
              </div>
            </div>
          </div>
          <div className="col-md-6" style={{verticalAlign: 'top'}}>
            <div>
              <ul className="nav nav-pills nav-fill mt-1" role="tablist">
                {game.progress.unlockHuts.unlocked && <li className="nav-item">
                  <a className="nav-link active" id="buildings-tab" href="#buildingsTable"
                     aria-controls="buildingsTable" aria-selected="true" role="tab" data-toggle="pill">Buildings</a>
                </li>}
                {game.progress.unlockVillagers.unlocked && <li className="nav-item">
                  <a className="nav-link" id="villagers-tab" href="#villagersTable" aria-controls="villagersTable"
                     aria-selected="false" role="tab" data-toggle="pill">Villagers</a>
                </li>}
                {game.progress.unlockLevelOneTech.unlocked && <li className="nav-item">
                  <a className="nav-link" id="research-tab" href="#researchTable" aria-controls="researchTable"
                     aria-selected="false" role="tab" data-toggle="pill">Research</a>
                </li>}
              </ul>

              <div className="tab-content">
                {game.progress.unlockHuts.unlocked && <div role="tabpanel" className="tab-pane fade show active" id="buildingsTable"
                     aria-labelledby="buildings-tab">
                  <building-table
                      v-bind:buildings="game.buildings"
                      v-on:buildBuilding="buildBuilding"
                      v-on:reclaimBuilding="reclaimBuilding">
                  </building-table>
                </div>}
                <div role="tabpanel" className="tab-pane fade" id="villagersTable" aria-labelledby="villagers-tab">
                  <villager-table
                      v-bind:jobs="game.jobs"
                      v-on:assignWorker="assignWorker"
                      v-on:unAssignWorker="unAssignWorker">
                  </villager-table>
                </div>
                <div role="tabpanel" className="tab-pane fade" id="researchTable" aria-labelledby="research-tab">
                  <technology-table
                      v-bind:technologies="game.technologies"
                      v-bind:research="game.resources.research"
                      v-on:makeDiscovery="makeDiscovery">
                  </technology-table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="dialog-export" className="modal fade" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Export Save</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="exportTextField">Copy this:</label><br />
                <textarea id="exportTextField" rows="12" cols="44" readOnly/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>

        <div id="dialog-debug" className="modal fade" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Debug</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Longest time taken in a single game tick: {game.longestTickInMs} ms
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <div id="dialog-import" className="modal fade" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Import Save</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="importTextField">Paste save here:</label><br/>
                <textarea id="importTextField" rows="12" cols="44"/>
              </div>
              <div className="modal-footer">
                <button type="button" id="importButton" className="btn btn-primary" onClick={performImport}>Import
                </button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      </div>
);
}

export default App;

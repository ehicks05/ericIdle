<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Eric <span style="color: forestgreen">Idle</span></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <input type="button" class="mx-1 btn btn-outline-secondary btn-sm" value="pause" v-on:click="pause()" id="pauseButton" />
                    <input type="button" class="mx-1 btn btn-outline-secondary btn-sm" value="export" v-on:click="showExport()" />
                    <input type="button" class="mx-1 btn btn-outline-secondary btn-sm" value="import" v-on:click="showImport()" />
                    <input type="button" class="mx-1 btn btn-outline-danger btn-sm" value="reset" v-on:click="reset()" />
                </ul>
            </div>
        </nav>

        <div class="row" style="max-width: 950px; margin:auto;">

            <div class="col-md-6" style="vertical-align: top;">
                <div>
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs nav-fill mt-1" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="resources-tab" href="#resourcesTable" aria-controls="resourcesTable" aria-selected="true" role="tab" data-toggle="tab">Resources</a>
                        </li>
                    </ul>
                </div>

                <!-- Tab Panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane fade show active" id="resourcesTable" aria-labelledby="resources-tab">
                        <resource-table
                                v-bind:resources="game.resources"
                                v-on:harvestFood="harvestFood">
                        </resource-table>
                    </div>
                </div>
            </div>
            <div class="col-md-6" style="vertical-align: top;">
                <div>
                    <!-- Nav tabs -->
                    <ul class="nav nav-pills nav-fill mt-1" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="buildings-tab" href="#buildingsTable" aria-controls="buildingsTable" aria-selected="true" role="tab" data-toggle="pill">Buildings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="villagers-tab" href="#villagersTable" aria-controls="villagersTable" aria-selected="false" role="tab" data-toggle="pill">Villagers</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="research-tab" href="#researchTable" aria-controls="researchTable" aria-selected="false" role="tab" data-toggle="pill">Research</a>
                        </li>
                    </ul>

                    <!-- Tab Panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane fade show active" id="buildingsTable" aria-labelledby="buildings-tab">
                            <building-table
                                    v-bind:buildings="game.buildings"
                                    v-on:buildBuilding="buildBuilding"
                                    v-on:reclaimBuilding="reclaimBuilding">
                            </building-table>
                        </div>
                        <div role="tabpanel" class="tab-pane fade" id="villagersTable" aria-labelledby="villagers-tab">
                            <villager-table
                                    v-bind:jobs="game.jobs"
                                    v-on:assignWorker="assignWorker"
                                    v-on:unAssignWorker="unAssignWorker">
                            </villager-table>
                        </div>
                        <div role="tabpanel" class="tab-pane fade" id="researchTable" aria-labelledby="research-tab">
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

        <!-- Export Dialog -->
        <div style="display:none;">
            <div id="dialog-export" title="Export Save">
                <textarea id="exportTextField" rows="12" cols="44" readonly></textarea>
            </div>
        </div>

        <!-- Import Dialog -->
        <div style="display:none;">
            <div id="dialog-import" title="Import Save">
                <textarea id="importTextField" rows="12" cols="44"></textarea>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import merge from 'lodash/merge'
    import $ from 'jquery'

    import 'jquery-ui/ui/widgets/dialog';
    import 'jquery-ui/themes/base/base.css';
    import 'jquery-ui/themes/base/dialog.css';
    import 'jquery-ui/themes/base/all.css';

    import 'bootstrap'
    import 'bootstrap/dist/css/bootstrap.min.css';

    import * as util from './util.js'
    import * as gameLogic from './game.js'

    import ResourceCost from './ResourceCost.vue'
    import ResourceTable from "./ResourceTable.vue";
    import BuildingTable from "./BuildingTable.vue";
    import VillagerTable from "./VillagerTable.vue";
    import TechnologyTable from "./TechnologyTable.vue";

    Vue.component('resource-cost', ResourceCost);

    const game = gameLogic.getDefaultGameState();

    if (localStorage['persistedGame'])
    {
        const parsedData = JSON.parse(localStorage.getItem('persistedGame'));
        console.log('parsed data');

        // merge saved state on top of the defaults
        merge(game, parsedData);
    }

    game._intervalId = setInterval(intervalFunction, 1000 / game.fps);

    export default {
        components: {
            ResourceTable,
            BuildingTable,
            VillagerTable,
            TechnologyTable
        },
        name: 'app',
        data () {
            return {
                game: game
            }
        },
        methods: {
            camelToTitle: function (value) {
                const result = value.replace(/([A-Z])/g, " $1");
                return result.charAt(0).toUpperCase() + result.slice(1);
            },
            myRound: function(value, places) {
                const multiplier = Math.pow(10, places);
                return (Math.round(value * multiplier) / multiplier);
            },
            harvestFood: function() {
                gameLogic.updateResource(game, 'food', 1);
            },
            buildBuilding: function(buildingName){
                const building = game.buildings[buildingName];
                const costResource = building.cost.resource;
                const costAmount = building.cost.amount;

                const priceIncreaseMultiplier = building.name === 'huts' ? 1.14 : 1.07;

                const canAfford = costResource.amount >= costAmount;
                if (canAfford)
                {
                    gameLogic.updateResource(game, costResource.name, -costAmount);
                    building.cost.amount = util.myRound(costAmount * priceIncreaseMultiplier, 2);
                    building.amount += 1;
                }
            },
            reclaimBuilding: function(buildingName){
                const building = game.buildings[buildingName];
                const costResource = building.cost.resource;
                const costAmount = building.cost.amount;

                const priceIncreaseMultiplier = building.name === 'huts' ? 1.14 : 1.07;

                const canReclaim = building.amount >= 1;
                if (canReclaim)
                {
                    //update reclaimed resource
                    let newAmount = building.cost.amount;
                    newAmount = util.myRound(newAmount, 4);
                    game.resources[costResource.name].amount += newAmount;

                    //update reclaimed building cost
                    building.cost.amount = util.myRound(costAmount / priceIncreaseMultiplier, 2);
                    //update reclaimed building amount
                    building.amount -= 1;
                }
            },
            assignWorker: function(jobName){
                if (game.jobs.idlers.amount > 0)
                {
                    game.jobs[jobName].amount += 1;
                    game.jobs.idlers.amount -= 1;
                }
            },
            unAssignWorker: function(jobName){
                if (game.jobs[jobName].amount > 0)
                {
                    game.jobs[jobName].amount -= 1;
                    game.jobs.idlers.amount += 1;
                }
            },
            makeDiscovery: function(technologyName){
                const canAfford = game.resources.research.amount >= game.technologies[technologyName].cost.amount;
                if (canAfford)
                {
                    gameLogic.updateResource(game, 'research', -game.technologies[technologyName].cost.amount);
                    game.technologies[technologyName].discovered = true;
                }
            },
            reset: function() {
                const intervalId = game._intervalId;
                merge(game, gameLogic.getDefaultGameState());
                game._intervalId = intervalId;
            },
            pause: function() {
                pause();
            },
            showImport: function() {
                showImportDialog();
            },
            showExport: function() {
                showExportDialog();
            },

        }
    }

    function intervalFunction()
    {
        if (Date.now() - game.timeOfLastTick >= game.msPerTick)
        {
            gameLogic.updateResources(game);
            gameLogic.updateResourceLimits(game);
            if (gameLogic.isCreateVillager(game))
                gameLogic.createVillager(game);
            gameLogic.checkProgress(game);

            game.timeOfLastTick = Date.now();
        }

        if (typeof(Storage) !== "undefined")
            localStorage.setItem('persistedGame', JSON.stringify(game));
    }

    $(function () {
        $('[data-toggle="popover"]').popover()
    });

    function pause()
    {
        if (!game._intervalId)
        {
            game._intervalId = setInterval(intervalFunction, 1000 / game.fps);
            $('#pauseButton').text('pause').val('pause');
        }
        else
        {
            window.clearInterval(game._intervalId);
            game._intervalId = null;
            $('#pauseButton').text('resume').val('resume');
        }
    }

    function exportState(state)
    {
        const stateAsString = JSON.stringify(state);
        return btoa(stateAsString);
    }

    function importState(encodedState)
    {
        const deEncodedState = atob(encodedState);
        const parsedGame = JSON.parse(deEncodedState);

        merge(game, parsedGame);

        console.log('imported game state, food: ' + parsedGame.resources.food.amount);
    }

    function showExportDialog()
    {
        $( "#dialog-export" ).dialog({
            resizable: false,
            width:480,
            modal: true,
            open: function (event, ui)
            {
                $( "#exportTextField").val(exportState(game));
            },
            buttons:
                {
                    Close: function()
                    {
                        $( this ).dialog( "close" );
                    }
                }
        });
    }

    function showImportDialog()
    {
        $( "#dialog-import" ).dialog({
            resizable: false,
            width:480,
            modal: true,
            open: function (event, ui)
            {
                $( "#importTextField").val('');
            },
            buttons:
                {
                    Import: function()
                    {
                        const textAreaValue = $("#importTextField").val();
                        importState(textAreaValue);
                        $( this ).dialog( "close" );
                    },
                    Close: function()
                    {
                        $( this ).dialog( "close" );
                    }
                }
        });
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');

    body {margin:auto; font-family: 'Open Sans', sans-serif;}
</style>

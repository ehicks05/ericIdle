var game = setGameDefaults();

function init()
{
    if (localStorage['persistedGame'])
        restoreState();

    game._intervalId = setInterval(game.run, 1000 / game.fps);
    game.paused = false;
}

function setGameDefaults() {

    var food = {name: 'food', amount: 0, limit: 0, baseLimit: 40, image: 'wheat.png'};
    var lumber = {name: 'lumber', amount: 0, limit: 0, baseLimit: 24, image: 'wood-pile.png', status: 'hidden'};
    var leather = {name: 'leather', amount: 0, limit: 0, baseLimit: 20, image: 'animal-hide.png', status: 'hidden'};
    var stone = {name: 'stone', amount: 0, limit: 0, baseLimit: 10, image: 'stone-pile.png', status: 'hidden'};
    var research = {name: 'research', amount: 0, limit: 0, baseLimit: 100, image: 'coma.png', status: 'hidden'};
    var villagers = {name: 'villagers', amount: 0, limit: 0, baseLimit: 0, image: 'backup.png', status: 'hidden'};

    var idlers = {name: 'idlers', amount: 0, status: 'hidden'};
    var farmers = {name: 'farmers', amount: 0, status: 'hidden', production : [{resource: food, amount: 0.5}]};
    var foresters = {name: 'foresters', amount: 0, status: 'hidden', production : [{resource: lumber, amount: 0.3}]};
    var hunters = {name: 'hunters', amount: 0, status: 'hidden'};
    var miners = {name: 'miners', amount: 0, status: 'hidden', production : [{resource: stone, amount: 0.1}]};
    var builders = {name: 'builders', amount: 0, status: 'hidden'};
    var thinkers = {name: 'thinkers', amount: 0, status: 'hidden', production : [{resource: research, amount: 0.2}]};

    var huts = {name: 'huts', amount: 0, image: 'tipi.png', status: 'hidden',
        cost: {resource: food, amount: 1},
        resourceLimitModifier : [{resource: villagers, amount: 2, type: 'additive'}]};
    var farms = {name: 'farms', amount: 0, image: 'barn.png', status: 'hidden',
        cost: {resource: lumber, amount: 1},
        bonus: [{resource: food, amount: .05}]};
    var lumberMills = {name: 'lumberMills', amount: 0, image: 'circular-saw.png', status: 'hidden',
        cost: {resource: lumber, amount: 2},
        bonus: [{resource: lumber, amount: .1}]};
    var storerooms = {name: 'storerooms', amount: 0, image: 'block-house.png', status: 'hidden',
        cost: {resource: lumber, amount: 5},
        resourceLimitModifier: [{resource: food, amount: 5, type: 'additive'},{resource: lumber, amount: 5, type: 'additive'},{resource: stone, amount: 5, type: 'additive'}]};
    var huntingCamps = {name: 'huntingCamps', amount: 0, status: 'hidden',
        cost: {resource: lumber, amount: 2}};
    var quarries = {name: 'quarries', amount: 0,  image: 'gold-mine.png', status: 'hidden',
        cost: {resource: lumber, amount: 2},
        bonus: [{resource: stone, amount: .06}]};
    var smithies = {name: 'smithies', amount: 0, status: 'hidden',
        cost: {resource: lumber, amount: 3}};
    var schools = {name: 'schools', amount: 0, image: 'greek-temple.png', status: 'hidden',
        cost: {resource: lumber, amount: 3},
        bonus: [{resource: research, amount: .06}]};

    var farming = {name: 'farming', discovered: false, researchCost: 5, status: 'hidden', buttonLabel: 'Discover'};
    var basicConstruction = {name: 'basicConstruction', discovered: false, researchCost: 5, status: 'hidden', buttonLabel: 'Discover'};

    var unlockHuts = {unlocked: false, requirement: {resource: 'food', amount: 1}};
    var unlockVillagers = {unlocked: false, requirement: {resource: 'villagers', amount: 1}};
    var unlockResearch = {unlocked: false, requirement: {resource: 'villagers', amount: 8}};
    var unlockFarming = {unlocked: false, requirement: {technology: 'farming'}};
    var unlockBasicConstruction = {unlocked: false, requirement: {technology: 'basicConstruction'}};

    // set prereqs
    villagers.prereq = unlockVillagers;
    idlers.prereq = unlockVillagers;
    farmers.prereq = unlockVillagers;
    foresters.prereq = unlockVillagers;
    lumber.prereq = unlockVillagers;

    huts.prereq = unlockHuts;

    research.prereq = unlockResearch;
    thinkers.prereq = unlockResearch;
    farming.prereq = unlockResearch;
    basicConstruction.prereq = unlockResearch;

    farms.prereq = unlockFarming;

    stone.prereq = unlockBasicConstruction;
    lumberMills.prereq = unlockBasicConstruction;
    storerooms.prereq = unlockBasicConstruction;
    quarries.prereq = unlockBasicConstruction;
    miners.prereq = unlockBasicConstruction;

    return {
        resources: {food: food, lumber: lumber, research: research, villagers: villagers, stone: stone},
        buildings: {huts: huts, farms: farms, lumberMills: lumberMills, storerooms: storerooms, quarries: quarries, schools: schools},
        jobs: {idlers: idlers, farmers: farmers, foresters: foresters, hunters: hunters, miners: miners, builders: builders, thinkers: thinkers},
        technologies: {farming: farming, basicConstruction: basicConstruction},
        progress: {unlockHuts: unlockHuts, unlockVillagers: unlockVillagers, unlockResearch: unlockResearch, unlockFarming: unlockFarming, unlockBasicConstruction: unlockBasicConstruction},

        // system
        fps: 50,
        msPerTick: 200,
        timeOfLastTick: Date.now(),
        timeOfLastVillagerCreation: Date.now(),
        creatingAVillager: false
    };
}

function checkProgress()
{
    Object.keys(game.progress).forEach(function(progressKey) {
        var progressObject = game.progress[progressKey];

        if (progressObject.hasOwnProperty('requirement'))
        {
            var requirementObject = progressObject.requirement;
            if (requirementObject.unlocked === true)
                return;

            var unlockIt = false;
            if (requirementObject.hasOwnProperty('resource'))
            {
                if (game.resources[requirementObject.resource].amount >= requirementObject.amount)
                    unlockIt = true;
            }
            if (requirementObject.hasOwnProperty('technology'))
            {
                if (game.technologies[requirementObject.technology].discovered === true)
                    unlockIt = true;
            }

            if (unlockIt)
            {
                progressObject.unlocked = true;
                applyProgress(progressObject);
            }
        }
    });
}

function applyProgress(progressObject)
{
    Object.keys(game.resources).forEach(function(resourceKey)
    {
        var resource = game.resources[resourceKey];
        if (resource.hasOwnProperty('prereq'))
        {
            if (resource.prereq === progressObject)
                resource.status = 'visible';
        }
    });

    Object.keys(game.buildings).forEach(function(buildingKey)
    {
        var building = game.buildings[buildingKey];
        if (building.hasOwnProperty('prereq'))
        {
            if (building.prereq === progressObject)
                building.status = 'visible';
        }
    });

    Object.keys(game.jobs).forEach(function(jobKey)
    {
        var job = game.jobs[jobKey];
        if (job.hasOwnProperty('prereq'))
        {
            if (job.prereq === progressObject)
                job.status = 'visible';
        }
    });

    Object.keys(game.technologies).forEach(function(key)
    {
        var job = game.technologies[key];
        if (job.hasOwnProperty('prereq'))
        {
            if (job.prereq === progressObject)
                job.status = 'visible';
        }
    });
}

game.run = function gameLoop()
{
    if (Date.now() - game.timeOfLastTick >= game.msPerTick)
    {
        updateResources();
        updateResourceLimits();
        if (isCreateVillager())
            createVillager();
        checkProgress();

        game.timeOfLastTick = Date.now();
    }

    saveState();
};

function isCreateVillager()
{
    if (game.resources.villagers.limit > game.resources.villagers.amount && game.resources.food.amount > 0)
    {
        if (game.creatingAVillager === false)
        {
            game.creatingAVillager = true;
            game.timeOfLastVillagerCreation = Date.now();
        }

        var timeSinceLastVillagerInMS = Date.now() - game.timeOfLastVillagerCreation;
        var rand = Math.random() * 50000;

        return rand < timeSinceLastVillagerInMS;
    }
    return false;
}

function createVillager()
{
    var spacesAvailable = game.resources.villagers.limit - game.resources.villagers.amount;

    var villagersToCreate = Math.floor(Math.sqrt(game.resources.villagers.amount)) - 3;
    if (villagersToCreate > (spacesAvailable))
        villagersToCreate = spacesAvailable;
    if (villagersToCreate < 1)
        villagersToCreate = 1;

    updateVillagerCount(villagersToCreate);
    assignIdler(villagersToCreate);

    game.creatingAVillager = false;
}

function updateResources()
{
    Object.keys(game.resources).forEach(function(resourceKey) {
        var totalBonusMultiFromBuildings = 0;
        Object.keys(game.buildings).forEach(function(buildingKey) {
            var building = game.buildings[buildingKey];

            if (building.hasOwnProperty('bonus'))
            {
                building.bonus.forEach(function(bonusObject)
                {
                    var resource = bonusObject.resource;
                    if (resource === game.resources[resourceKey])
                    {
                        totalBonusMultiFromBuildings = building.amount * bonusObject.amount;
                    }
                });

            }
        });

        var totalProductionFromWorkers = 0;
        Object.keys(game.jobs).forEach(function(jobKey) {
            var job = game.jobs[jobKey];

            if (job.hasOwnProperty('production'))
            {
                job.production.forEach(function(productionObject)
                {
                    var resource = productionObject.resource;
                    if (resource === game.resources[resourceKey])
                    {
                        totalProductionFromWorkers = job.amount * productionObject.amount;
                    }
                });

            }
        });

        var newRate = totalProductionFromWorkers * (1 + totalBonusMultiFromBuildings);

        // villagers gotta eat
        if (resourceKey === 'food')
            newRate = newRate - .45 * game.resources.villagers.amount;

        // apply arbitrary global multiplier
        newRate = 0.1 * newRate ;
        game.resources[resourceKey].rate = formatRate(newRate); // rate is for display and is per second
        updateResource(resourceKey, newRate * (game.msPerTick / 1000)); // apply rate per tick
    });

    // Starvation
    if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0)
    {
        updateVillagerCount(-1);
        killWorkersFromStarvation();
        game.resources.food.amount = .5; // ...
    }
}

function formatRate(rate)
{
    rate = myRound(rate, 2);
    if (rate > 0) rate = '+' + rate;
    return rate;
}

function updateResourceLimits()
{
    Object.keys(game.resources).forEach(function(resourceKey) {
        var totalMultForResource = 0;
        var totalAddForResource = 0;
        Object.keys(game.buildings).forEach(function(buildingKey) {
            var building = game.buildings[buildingKey];


            if (building.hasOwnProperty('resourceLimitModifier'))
            {
                building.resourceLimitModifier.forEach(function(resourceLimitObject)
                {
                    var resource = resourceLimitObject.resource;
                    if (resource === game.resources[resourceKey])
                    {
                        if (resourceLimitObject.type === 'multi')
                            totalMultForResource = building.amount * resourceLimitObject.amount;
                        if (resourceLimitObject.type === 'additive')
                            totalAddForResource = building.amount * resourceLimitObject.amount;
                    }
                });

            }
        });

        game.resources[resourceKey].limit = (game.resources[resourceKey].baseLimit + totalAddForResource) * (1 + totalMultForResource);
    });
}

function killWorkersFromStarvation()
{
    if (game.jobs.idlers.amount > 0)
    {
        assignIdler(-1);
        return;
    }
    if (game.jobs.foresters.amount > 0)
    {
        killWorker('foresters');
        return;
    }
    if (game.jobs.thinkers.amount > 0)
    {
        killWorker('thinkers');
        return;
    }
    if (game.jobs.farmers.amount > 0)
    {
        killWorker('farmers');
        return;
    }
}

function updateResource(name, amount)
{
    var newAmount = game.resources[name].amount + amount;
    newAmount = myRound(newAmount, 4);
    if (newAmount > game.resources[name].limit)
        game.resources[name].amount = game.resources[name].limit; // set it to the limit
    else
        game.resources[name].amount = newAmount;
}

// Research
function makeDiscovery(technologyName)
{
    var canAfford = game.resources.research.amount >= game.technologies[technologyName].researchCost;
    if (canAfford)
    {
        updateResource('research', -game.technologies[technologyName].researchCost);
        game.technologies[technologyName].discovered = true;
        game.technologies[technologyName].buttonLabel = 'Discovered!';
    }
}

// Buildings
function buildBuilding(buildingName)
{
    var building = game.buildings[buildingName];
    var costResource = building.cost.resource;
    var costAmount = building.cost.amount;

    var priceIncreaseMultiplier = 1.07;
    if (building.name === 'huts') priceIncreaseMultiplier = 1.14;
    if (building.name === 'quarries') priceIncreaseMultiplier = 1.14;

    var canAfford = costResource.amount >= costAmount;
    if (canAfford)
    {
        updateResource(costResource.name, -costAmount);
        building.cost.amount = myRound(costAmount * priceIncreaseMultiplier, 2);
        building.amount += 1;

        if (building.name === 'quarries' && building.amount === 1)
            game.progress.minersUnlocked = true;
    }
}

// UTILITY
function myRound(value, places)
{
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}

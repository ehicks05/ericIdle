var game = setGameDefaults();

function init()
{
    if (localStorage['persistedGame'])
        restoreState();

    game._intervalId = setInterval(game.run, 1000 / game.fps);
    game.paused = false;
}

function setGameDefaults() {

    function Resource(name, baseLimit, image, prereq)
    {
        this.name = name;
        this.amount = 0;
        this.limit = 0;
        this.rate = 0;
        this.baseLimit = baseLimit;
        this.image = image;
        this.prereq = prereq;
        this.status = 'hidden';

        if (this.name == 'food')
            this.status = 'visible';
    }

    var food = new Resource('food', 40, 'wheat.png', '');
    var lumber = new Resource('lumber', 24, 'wood-pile.png', 'unlockWoodConstruction');
    var leather = new Resource('leather', 20, 'animal-hide.png', 'unlockHunting');
    var stone = new Resource('stone', 10, 'stone-pile.png', 'unlockStoneConstruction');
    var research = new Resource('research', 20, 'coma.png', 'unlockVillagers');
    var villagers = new Resource('villagers', 0, 'backup.png', 'unlockVillagers');

    function Job(name, image, prereq, productionList)
    {
        this.name = name;
        this.amount = 0;
        this.image = image;
        this.status = 'hidden';
        this.prereq = prereq;

        this.production = [];
        if (productionList)
        {
            for (var i = 0; i < productionList.length; i++)
                this.production.push(productionList[i]);
        }
    }

    var idlers = new Job('idlers', 'watch.png', 'unlockVillagers');
    var farmers = new Job('farmers', 'watch.png', 'unlockVillagers', [{resource: food, amount: 0.5}]);
    var thinkers = new Job('thinkers', 'watch.png', 'unlockVillagers', [{resource: research, amount: 0.2}]);
    var foresters = new Job('foresters', 'watch.png', 'unlockWoodConstruction', [{resource: lumber, amount: 0.3}]);
    var hunters = new Job('hunters', 'watch.png', 'unlockHunting');
    var miners = new Job('miners', 'watch.png', 'unlockStoneConstruction', [{resource: stone, amount: 0.1}]);
    var builders = new Job('builders', 'watch.png', 'unlockBuilders');

    function Building(name, image, prereq, cost, limitModifiers, bonusList)
    {
        this.name = name;
        this.amount = 0;
        this.image = image;
        this.status = 'hidden';
        this.prereq = prereq;
        this.cost = cost;

        var i = 0;
        this.resourceLimitModifier = [];
        if (limitModifiers)
        {
            for (i = 0; i < limitModifiers.length; i++)
                this.resourceLimitModifier.push(limitModifiers[i]);
        }

        this.bonus = [];
        if (bonusList)
        {
            for (i = 0; i < bonusList.length; i++)
                this.bonus.push(bonusList[i]);
        }
    }

    var huts = new Building('huts', 'tipi.png', 'unlockHuts', {resource: food, amount: 1}, [{resource: villagers, amount: 2, type: 'additive'}], []);
    var farms = new Building('farms', 'barn.png', 'unlockFarming', {resource: lumber, amount: 1}, [], [{resource: food, amount: 0.05}]);
    var lumberMills = new Building('lumberMills', 'circular-saw.png', 'unlockWoodConstruction', {resource: lumber, amount: 2}, [], [{resource: lumber, amount: 0.1}]);
    var storerooms = new Building('storerooms', 'block-house.png', 'unlockStoneConstruction', {resource: lumber, amount: 5},
        [{resource: food, amount: 5, type: 'additive'},{resource: lumber, amount: 5, type: 'additive'},{resource: stone, amount: 5, type: 'additive'}], []);
    var quarries = new Building('quarries',  'gold-mine.png', 'unlockStoneConstruction', {resource: lumber, amount: 2}, [], [{resource: stone, amount: 0.06}]);
    var huntingCamps = new Building('huntingCamps', 'watch.png', 'unlockHunting', {resource: lumber, amount: 2}, [], []);
    var smithies = new Building('smithies', 'watch.png', 'unlockSmithies', {resource: lumber, amount: 3}, [], []);
    var schools = new Building('schools', 'greek-temple.png', 'unlockSchools', {resource: lumber, amount: 3}, [], [{resource: research, amount: 0.06}]);

    function Technology(name, researchCost, prereq)
    {
        this.name = name;
        this.discovered = false;
        this.researchCost = researchCost;
        this.status = 'hidden';
        this.buttonLabel = 'Discover';
        this.prereq = prereq;
    }

    var farming = new Technology('farming', 5, 'unlockLevelOneTech');
    var woodConstruction = new Technology('woodConstruction', 5, 'unlockLevelOneTech');
    var stoneConstruction = new Technology('stoneConstruction', 5, 'unlockLevelOneTech');
    var wheel = new Technology('wheel', 5, 'unlockLevelOneTech');

    function Prereq(name, requirement)
    {
        this.name = name;
        this.unlocked = false;
        this.requirement = requirement;
    }

    var unlockHuts = new Prereq('unlockHuts', {resource: 'food', amount: 1});
    var unlockVillagers = new Prereq('unlockVillagers', {resource: 'villagers', amount: 1});
    var unlockLevelOneTech = new Prereq('unlockLevelOneTech', {resource: 'research', amount: 2});
    var unlockFarming = new Prereq('unlockFarming', {technology: 'farming'});
    var unlockWoodConstruction = new Prereq('unlockWoodConstruction', {technology: 'woodConstruction'});
    var unlockStoneConstruction = new Prereq('unlockStoneConstruction', {technology: 'stoneConstruction'});
    var unlockWheel = new Prereq('unlockWheel', {technology: 'wheel'});

    return {
        resources: {food: food, lumber: lumber, research: research, villagers: villagers, stone: stone},
        buildings: {huts: huts, farms: farms, lumberMills: lumberMills, storerooms: storerooms, quarries: quarries, schools: schools},
        jobs: {idlers: idlers, farmers: farmers, foresters: foresters, hunters: hunters, miners: miners, builders: builders, thinkers: thinkers},
        technologies: {farming: farming, woodConstruction: woodConstruction, stoneConstruction: stoneConstruction, wheel: wheel},
        progress: {unlockHuts: unlockHuts, unlockVillagers: unlockVillagers, unlockLevelOneTech: unlockLevelOneTech, unlockFarming: unlockFarming,
            unlockWoodConstruction: unlockWoodConstruction, unlockStoneConstruction: unlockStoneConstruction},

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
                applyProgress(progressObject.name);
            }
        }
    });
}

function applyProgress(progressObject)
{
    Object.keys(game.resources).forEach(function(key)
    {
        makeVisible(game.resources[key], progressObject);
    });

    Object.keys(game.buildings).forEach(function(key)
    {
        makeVisible(game.buildings[key], progressObject);
    });

    Object.keys(game.jobs).forEach(function(key)
    {
        makeVisible(game.jobs[key], progressObject);
    });

    Object.keys(game.technologies).forEach(function(key)
    {
        makeVisible(game.technologies[key], progressObject);
    });

    function makeVisible(object, progressObject)
    {
        if (object.hasOwnProperty('prereq'))
        {
            if (object.prereq === progressObject)
                object.status = 'visible';
        }
    }
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
                    if (resource.name === game.resources[resourceKey].name)
                    {
                        totalBonusMultiFromBuildings += building.amount * bonusObject.amount;
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
                    if (resource.name === game.resources[resourceKey].name)
                    {
                        totalProductionFromWorkers += job.amount * productionObject.amount;
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
                    if (resource.name === game.resources[resourceKey].name)
                    {
                        if (resourceLimitObject.type === 'multi')
                            totalMultForResource += building.amount * resourceLimitObject.amount;
                        if (resourceLimitObject.type === 'additive')
                            totalAddForResource += building.amount * resourceLimitObject.amount;
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

    var canAfford = costResource.amount >= costAmount;
    if (canAfford)
    {
        updateResource(costResource.name, -costAmount);
        building.cost.amount = myRound(costAmount * priceIncreaseMultiplier, 2);
        building.amount += 1;
    }
}

// UTILITY
function myRound(value, places)
{
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}

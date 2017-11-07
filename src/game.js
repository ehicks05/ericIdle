import * as util from './util.js'

export function updateResources(game)
{
    Object.keys(game.resources).forEach(function(resourceKey) {
        let totalBonusMultiFromBuildings = 0;
        Object.keys(game.buildings).forEach(function(buildingKey) {
            const building = game.buildings[buildingKey];

            if (building.hasOwnProperty('bonus'))
            {
                building.bonus.forEach(function(bonusObject)
                {
                    const resource = bonusObject.resource;
                    if (resource.name === game.resources[resourceKey].name)
                    {
                        totalBonusMultiFromBuildings += building.amount * bonusObject.amount;
                    }
                });
            }
        });

        let totalProductionFromWorkers = 0;
        Object.keys(game.jobs).forEach(function(jobKey) {
            const job = game.jobs[jobKey];

            if (job.hasOwnProperty('production'))
            {
                job.production.forEach(function(productionObject)
                {
                    const resource = productionObject.resource;
                    if (resource.name === game.resources[resourceKey].name)
                    {
                        totalProductionFromWorkers += job.amount * productionObject.amount;
                    }
                });
            }
        });

        let newRate = totalProductionFromWorkers * (1 + totalBonusMultiFromBuildings);

        // villagers gotta eat
        if (resourceKey === 'food')
            newRate = newRate - .45 * game.resources.villagers.amount;

        // apply arbitrary global multiplier
        newRate = 0.1 * newRate ;
        game.resources[resourceKey].rate = util.formatRate(newRate); // rate is for display and is per second
        updateResource(game, resourceKey, newRate * (game.msPerTick / 1000)); // apply rate per tick
    });

    // Starvation
    if (game.resources.food.amount < 0 && game.resources.villagers.amount > 0)
    {
        updateVillagerCount(game, -1);
        removeWorker(game);
        game.resources.food.amount = .5; // ...
    }

    // Homelessness
    let workerCount = 0;
    Object.keys(game.jobs).forEach(function(jobKey) {
        const job = game.jobs[jobKey];
        if (job.hasOwnProperty('amount'))
            workerCount += job.amount;
    });
    
    if (workerCount > game.resources.villagers.amount)
        removeWorker(game);
}

export function createVillager(game)
{
    let spacesAvailable = game.resources.villagers.limit - game.resources.villagers.amount;

    let villagersToCreate = Math.floor(Math.sqrt(game.resources.villagers.amount)) - 1;
    villagersToCreate = Math.min(villagersToCreate, spacesAvailable);
    if (villagersToCreate < 1)
        villagersToCreate = 1;

    updateVillagerCount(game, villagersToCreate);
    assignIdler(game, villagersToCreate);

    game.creatingAVillager = false;
}

export function checkProgress(game)
{
    Object.keys(game.progress).forEach(function (progressKey)
    {
        const progressObject = game.progress[progressKey];

        if (progressObject.hasOwnProperty('requirement'))
        {
            const requirementObject = progressObject.requirement;
            if (requirementObject.unlocked === true)
                return;

            let unlockIt = false;
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
                applyProgress(game, progressObject.name);
            }
        }
    });
}

export function updateResourceLimits(game)
{
    Object.keys(game.resources).forEach(function (resourceKey)
    {
        let totalMultForResource = 0;
        let totalAddForResource = 0;
        Object.keys(game.buildings).forEach(function (buildingKey)
        {
            const building = game.buildings[buildingKey];

            if (building.hasOwnProperty('resourceLimitModifier'))
            {
                building.resourceLimitModifier.forEach(function (resourceLimitObject)
                {
                    const resource = resourceLimitObject.resource;
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

export function updateResource(game, name, amount)
{
    let newAmount = game.resources[name].amount + amount;
    newAmount = util.myRound(newAmount, 4);
    if (newAmount > game.resources[name].limit)
        game.resources[name].amount = game.resources[name].limit; // set it to the limit
    else
        game.resources[name].amount = newAmount;
}

export function removeWorker(game)
{
    if (game.jobs.idlers.amount > 0)
    {
        assignIdler(game, -1);
        return;
    }
    if (game.jobs.foresters.amount > 0)
    {
        if (game.jobs.foresters.amount > 0)
            game.jobs.foresters.amount -= 1;
        return;
    }
    if (game.jobs.thinkers.amount > 0)
    {
        if (game.jobs.thinkers.amount > 0)
            game.jobs.thinkers.amount -= 1;
        return;
    }
    if (game.jobs.farmers.amount > 0)
    {
        if (game.jobs.farmers.amount > 0)
            game.jobs.farmers.amount -= 1;
        return;
    }
}

// Villager
export function updateVillagerCount(game, amount)
{
    game.resources.villagers.amount += amount;
}

// Worker
export function assignIdler(game, amount)
{
    game.jobs.idlers.amount += amount;
}

export function isCreateVillager(game)
{
    if (game.resources.villagers.limit > game.resources.villagers.amount && game.resources.food.amount > 0)
    {
        if (game.creatingAVillager === false)
        {
            game.creatingAVillager = true;
            game.timeOfLastVillagerCreation = Date.now();
        }

        const timeSinceLastVillagerInMS = Date.now() - game.timeOfLastVillagerCreation;

        const rand = Math.random() * (20 * 1000);

        return rand < timeSinceLastVillagerInMS;
    }
    return false;
}

// go through every game object, looking for ones whose prereq = this progressObject. Make it visible
// todo: consider what happens if you have multiple prereqs
export function applyProgress(game, progressObject)
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

export function getDefaultGameState()
{
    function Resource(name, baseLimit, image, prereq)
    {
        this.name = name;
        this.amount = 0;
        this.limit = baseLimit;
        this.rate = 0;
        this.baseLimit = baseLimit;
        this.image = image;
        this.prereq = prereq;
        this.status = 'hidden';

        if (this.name === 'food')
            this.status = 'visible';
    }

    const food = new Resource('food', 40, 'wheat.png', '');
    const lumber = new Resource('lumber', 24, 'wood-pile.png', 'unlockWoodConstruction');
    const leather = new Resource('leather', 20, 'animal-hide.png', 'unlockHunting');
    const stone = new Resource('stone', 10, 'stone-pile.png', 'unlockStoneConstruction');
    const research = new Resource('research', 20, 'coma.png', 'unlockVillagers');
    const villagers = new Resource('villagers', 0, 'backup.png', 'unlockVillagers');

    function Job(name, image, prereq, productionList)
    {
        this.name = name;
        this.amount = 0;
        this.image = image;
        this.status = 'hidden';
        this.prereq = prereq;

        this.production = [];
        if (productionList)
            for (let production of productionList)
                this.production.push(production);
    }

    const idlers = new Job('idlers', 'watch.png', 'unlockVillagers');
    const farmers = new Job('farmers', 'farmer.png', 'unlockVillagers', [{resource: food, amount: 0.5}]);
    const thinkers = new Job('thinkers', 'think.png', 'unlockVillagers', [{resource: research, amount: 0.2}]);
    const foresters = new Job('foresters', 'hand-saw.png', 'unlockWoodConstruction', [{resource: lumber, amount: 0.3}]);
    const hunters = new Job('hunters', 'watch.png', 'unlockHunting');
    const miners = new Job('miners', 'watch.png', 'unlockStoneConstruction', [{resource: stone, amount: 0.1}]);
    const builders = new Job('builders', 'watch.png', 'unlockBuilders');

    function Building(name, image, prereq, cost, limitModifiers, bonusList)
    {
        this.name = name;
        this.amount = 0;
        this.image = image;
        this.status = 'hidden';
        this.prereq = prereq;
        this.cost = cost;

        this.resourceLimitModifier = [];
        if (limitModifiers)
            for (let limitModifier of limitModifiers)
                this.resourceLimitModifier.push(limitModifier);

        this.bonus = [];
        if (bonusList)
            for (let bonus of bonusList)
                this.bonus.push(bonus);
    }

    const huts = new Building('huts', 'tipi.png', 'unlockHuts', {resource: food, amount: 1}, [{resource: villagers, amount: 2, type: 'additive'}], []);
    const farms = new Building('farms', 'barn.png', 'unlockFarming', {resource: lumber, amount: 1}, [], [{resource: food, amount: 0.05}]);
    const lumberMills = new Building('lumberMills', 'circular-saw.png', 'unlockWoodConstruction', {resource: lumber, amount: 2}, [], [{resource: lumber, amount: 0.1}]);
    const storerooms = new Building('storerooms', 'block-house.png', 'unlockStoneConstruction', {resource: lumber, amount: 5},
        [{resource: food, amount: 5, type: 'additive'},{resource: lumber, amount: 5, type: 'additive'},{resource: stone, amount: 5, type: 'additive'}], []);
    const quarries = new Building('quarries',  'gold-mine.png', 'unlockStoneConstruction', {resource: lumber, amount: 2}, [], [{resource: stone, amount: 0.06}]);
    const huntingCamps = new Building('huntingCamps', 'watch.png', 'unlockHunting', {resource: lumber, amount: 2}, [], []);
    const smithies = new Building('smithies', 'watch.png', 'unlockSmithies', {resource: lumber, amount: 3}, [], []);
    const schools = new Building('schools', 'greek-temple.png', 'unlockSchools', {resource: lumber, amount: 3}, [], [{resource: research, amount: 0.06}]);

    function Technology(name, cost, prereq)
    {
        this.name = name;
        this.discovered = false;
        this.cost = cost;
        this.status = 'hidden';
        this.image = 'enlightenment.png';
        this.buttonLabel = 'Discover';
        this.prereq = prereq;
    }

    const farming = new Technology('farming', {resource: research, amount: 1}, 'unlockLevelOneTech');
    const woodConstruction = new Technology('woodConstruction', {resource: research, amount: 2}, 'unlockLevelOneTech');
    const stoneConstruction = new Technology('stoneConstruction', {resource: research, amount: 5}, 'unlockLevelOneTech');
    const wheel = new Technology('wheel', {resource: research, amount: 5}, 'unlockLevelOneTech');

    function Prereq(name, requirement)
    {
        this.name = name;
        this.unlocked = false;
        this.requirement = requirement;
    }

    const unlockHuts = new Prereq('unlockHuts', {resource: 'food', amount: 1});
    const unlockVillagers = new Prereq('unlockVillagers', {resource: 'villagers', amount: 1});
    const unlockLevelOneTech = new Prereq('unlockLevelOneTech', {resource: 'research', amount: 1});
    const unlockFarming = new Prereq('unlockFarming', {technology: 'farming'});
    const unlockWoodConstruction = new Prereq('unlockWoodConstruction', {technology: 'woodConstruction'});
    const unlockStoneConstruction = new Prereq('unlockStoneConstruction', {technology: 'stoneConstruction'});
    const unlockWheel = new Prereq('unlockWheel', {technology: 'wheel'});

    const resources = {food: food, lumber: lumber, research: research, villagers: villagers, stone: stone};
    const buildings = {huts: huts, farms: farms, lumberMills: lumberMills, storerooms: storerooms, quarries: quarries, schools: schools};
    const jobs = {idlers: idlers, farmers: farmers, foresters: foresters, hunters: hunters, miners: miners, builders: builders, thinkers: thinkers};
    const technologies = {farming: farming, woodConstruction: woodConstruction, stoneConstruction: stoneConstruction, wheel: wheel};
    const progress = {unlockHuts: unlockHuts, unlockVillagers: unlockVillagers, unlockLevelOneTech: unlockLevelOneTech, unlockFarming: unlockFarming,
        unlockWoodConstruction: unlockWoodConstruction, unlockStoneConstruction: unlockStoneConstruction};

    return {
        resources: resources,
        buildings: buildings,
        jobs: jobs,
        technologies: technologies,
        progress: progress,

        // system
        fps: 10,  // determines how often the function passed to 'setInterval' is called
        msPerTick: 1000,  // how long to wait between ticks
        timeOfLastTick: Date.now(),
        timeOfLastVillagerCreation: Date.now(),
        creatingAVillager: false,
        _intervalId: null
    };
}


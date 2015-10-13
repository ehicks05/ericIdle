// Villager
function updateVillagerCount(amount)
{
    game.resources.villagers.amount += amount;
}

// Worker
function assignIdler(amount)
{
    game.jobs.idlers.amount += amount;
}

function assignWorker(job)
{
    if (game.jobs.idlers.amount > 0)
    {
        game.jobs[job].amount += 1;
        game.jobs.idlers.amount -= 1;
    }
}
function unAssignWorker(job)
{
    if (game.jobs[job].amount > 0)
    {
        game.jobs[job].amount -= 1;
        game.jobs.idlers.amount += 1;
    }
}

function killWorker(job)
{
    if (game.jobs[job].amount > 0)
        game.jobs[job].amount -= 1;
}
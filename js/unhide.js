function UnHideUIElements()
{
    if (game.progress.unlockBuildings === false && game.resources.food.amount > 2.2)
    {
        game.progress.unlockBuildings = true;
        $('#buildingsTabButton').addClass('selected');

        unHide('buildingsTabButton');
        unHide('buildingsTable');
        unHide('hutsRow');
    }
    if (game.progress.unlockVillagers === false && game.resources.villagers.amount > 0)
    {
        game.progress.unlockVillagers = true;
        unHide('villagersTabButton');
        unHide('villagersRow');
        unHide('idlersRow');
        unHide('farmersRow');
        unHide('forestersRow');
    }
    if (game.progress.unlockResearch === false && game.resources.villagers.amount > 4)
    {
        game.progress.unlockResearch = true;
        unHide('researchTabButton');
        unHide('researchRow');
        unHide('thinkersRow');

        unHide('farmingRow');
        unHide('basicConstructionRow');
    }
    if (game.technologies.farming.discovered === true && $('#farmsRow').hasClass('hidden'))
    {
        unHide('farmsRow');
        disable('farmingButton');
    }
    if (game.technologies.basicConstruction.discovered === true && $('#lumberMillsRow').hasClass('hidden'))
    {
        unHide('lumberMillsRow');
        unHide('storeroomsRow');
        unHide('stoneRow');
        unHide('quarriesRow');
        disable('basicConstructionButton');
        unHide('minersRow');
    }
}
/**
 * Created with IntelliJ IDEA.
 * User: ehicks
 * Date: 5/12/14
 * Time: 4:05 PM
 * To change this template use File | Settings | File Templates.
 */

function saveState()
{
    if (typeof(Storage)!=="undefined")
    {
        localStorage.setItem('persistedGame', JSON.stringify(game));
        var parsedGame = JSON.parse(localStorage.getItem('persistedGame'));
        console.log('persisted game, then retrieved it from localstorage, food= ' + parsedGame.resources.food.amount);
    }
    else
    {
        // Sorry! No Web Storage support..
    }
}

function restoreState()
{
    if (typeof(Storage)!=="undefined")
    {
        var parsedGame = JSON.parse(localStorage.getItem('persistedGame'));

        _.merge(game, parsedGame);
        ractive.set({game: game});

        console.log('retrievedObject, food: ' + parsedGame.resources.food.amount);
    }
    else
    {
        // Sorry! No Web Storage support..
    }
}

function clearState()
{
    if(typeof(Storage)!=="undefined")
    {
        if (confirm('Are you sure?'))
        {
            window.localStorage.removeItem('persistedGame');
            _.merge(game, setGameDefaults());
            ractive.set({game: game});
        }
    }
    else
    {
        // Sorry! No Web Storage support..
    }
}
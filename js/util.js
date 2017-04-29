// UTILITY
function myRound(value, places)
{
    const multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}

function camelToTitle(value)
{
    const result = value.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function formatRate(rate)
{
    rate = myRound(rate, 2);
    if (rate > 0) rate = '+' + rate;
    return rate;
}

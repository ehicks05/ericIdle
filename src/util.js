// UTILITY
export function myRound(value, places)
{
    const multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}

export function camelToTitle(value)
{
    const result = value.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function formatRate(rate)
{
    rate = myRound(rate, 2);
    if (rate > 0) rate = '+' + rate;
    return rate;
}

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
    let e = 0;
    let sign = rate >= 0 ? '+' : '-';
    rate = Math.abs(rate);

    while (rate !== 0 && !(rate >= .01 && rate <= 10))
    {
        if (rate < 1)
        {
            rate *= 10;
            e--;
        }
        if (rate > 10)
        {
            rate /= 10;
            e++;
        }
    }
    if (sign === '-')
        rate *= -1;
    rate = myRound(rate, 2);
    if (rate > 0) rate = '+' + rate;
    if (e !== 0) rate += 'e' + e;
    return rate;
}

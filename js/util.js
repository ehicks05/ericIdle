function enableDebugging(){$('*').removeClass('hidden');}

function myRound(value, places)
{
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}
function unHide(id) {$('#' + id).removeClass('hidden');}
function reHide(id) {$('#' + id).addClass('hidden');}

function disable(id) {$('#' + id).prop('disabled', true);}
function enable(id) {$('#' + id).prop('disabled', false);}
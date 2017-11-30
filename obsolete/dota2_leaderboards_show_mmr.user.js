// ==UserScript==
// @name         Dota2 Leaderboards Show MMR
// @namespace    https://www.reddit.com/user/fireattack/
// @version      0.2
// @description  Show MMR on Dota2 Leaderboards MMR
// @author       Valve, fireattack
// @match        http://www.dota2.com/leaderboards*
// ==/UserScript==

/* literally just modified some Valve's own JS code to add a new column to show MMR. */

var sLoadedDivision = '';
var idxRow;
var tableBody = $('#leaderboard_body');

var mmrCol = document.createElement('th');
mmrCol.align = 'center';
mmrCol.innerHTML = 'MMR';
document.querySelector('thead tr').appendChild(mmrCol);

var CreateTableRow = function() {
    idxRow += 1;
    return $('<tr bgcolor="#' + ((idxRow % 2) ? '181818' : '202020') + '">');
}

var LoadDivisionData = function() {
    var sDivisionToLoad = $.param.fragment();
    if (sDivisionToLoad == '') {
        var tz = (new Date()).getTimezoneOffset() / 60;
        console.log(tz);
        if ((1 <= tz && tz <= 11) || tz < -13)
            sDivisionToLoad = 'americas';
        else if (tz >= -5)
            sDivisionToLoad = 'europe';
        else
            sDivisionToLoad = 'china';
    }
    if (sDivisionToLoad == sLoadedDivision)
        return;
    sLoadedDivision = sDivisionToLoad;
    if (sLoadedDivision != window.location.hash)
        window.location.hash = sLoadedDivision;

    $('a.selected_division').removeClass('selected_division').addClass('unselected_division');
    $('a[href="#' + sDivisionToLoad + '"]').addClass('selected_division').removeClass('unselected_division');

    $('#leaderboard_status').html('Loading leaderboard...');

    idxRow = 0;
    tableBody.empty();
    for (var i = 0; i < 200; ++i) {
        tableBody.append(CreateTableRow().html('<td>&nbsp</td><td/>'));
    }

    $.ajax({
        url: 'http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=' + sDivisionToLoad,
        dataType: 'json',
        success: function(data) {
            if (data['leaderboard']) {
                var gmtCalculated = parseInt(data['time_posted']);
                var dateCalculated = new Date(gmtCalculated * 1000);

                var gmtServerTime = parseInt(data['server_time']);
                var gmtNextScheduled = parseInt(data['next_scheduled_post_time']);
                var dateScheduled = new Date(gmtNextScheduled * 1000);

                $('#leaderboard_status').html('Last Updated: ' + dateCalculated.toLocaleString() + '<br/>' + 'Next Update: ' + dateScheduled.toLocaleString());

                idxRow = 0;
                tableBody.empty();
                var players = data['leaderboard'];
                for (var idx in players) {
                    var player = players[idx];

                    var tr = CreateTableRow();
                    tr.append('<td align="center">' + player['rank'] + '</td>');
                    var nameTD = $('<td align="left" style="overflow:hidden" width="300"/>');
                    nameTD.html('&nbsp;&nbsp;');
                    if ('name'in player) {
                        if ('team_tag'in player && player['team_tag'])
                            nameTD.append($('<span/>').addClass('team_tag').text(player['team_tag'] + '.'));
                        nameTD.append($('<span/>').addClass('player_name').text(player['name']));
                        if ('sponsor'in player && player['sponsor'])
                            nameTD.append($('<span/>').addClass('sponsor').text('.' + player['sponsor']));
                        if ('country'in player)
                            nameTD.append($('<div/>').css('float', 'right').html('<img src="http://steamcommunity-a.akamaihd.net/public/images/countryflags/' + player['country'] + '.gif">&nbsp;&nbsp;'));

                    } else {
                        nameTD.addClass('no_official_data');
                        nameTD.append('Waiting for player to submit official profile');
                    }
                    tr.append(nameTD);
                    tr.append(`<td align="center">${player['solo_mmr']}</td>`);
                    tableBody.append(tr);
                }
            } else {
                $('#leaderboard_status').html('This leaderboard is currently unavailable.');
            }
        },
        error: function(data, status, xhr) {
            $('#leaderboard_status').html('This leaderboard is currently unavailable.');
        }
    });
}

$(unsafeWindow).unbind('hashchange');

$(window).bind('hashchange', function(e) {
    LoadDivisionData();
})

LoadDivisionData();
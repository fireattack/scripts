// ==UserScript==
// @name         Dota2 Leaderboards Show MMR - my own implementation (unfinished)
// @namespace    https://www.reddit.com/user/fireattack/
// @version      0.1
// @description  Show MMR on Dota2 Leaderboards MMR
// @author       Valve, fireattack
// @match        http://www.dota2.com/leaderboards*
// ==/UserScript==

var jsonResponse;

var xhr = new XMLHttpRequest();
xhr.open('GET', '/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=americas', true);
xhr.onload = () => {
    jsonResponse = JSON.parse(xhr.responseText);
    if (jsonResponse.error)
        window.alert('Error!');
    else  {
        console.log('Data fetched!');
    }
};

xhr.send();

var mmrCol = document.createElement('th');
mmrCol.align = 'center';
mmrCol.innerHTML = 'MMR';
document.querySelector('thead tr').appendChild(mmrCol);

var myTbody = document.createElement('tbody');
myTbody.id = 'leaderboard_body';

for (let obj of jsonResponse['leaderboard']) {
    let newTr = document.createElement('tr');
    if (obj['rank'] % 2) newTr.bgColor = '#181818';
    else newTr.bgColor = '#202020';    
    
    let myString = `<td align="center">${obj['rank']}</td><td align="left" style="overflow:hidden" width="300">&nbsp;&nbsp;`;
    if (obj['team_tag']) myString += `<span class="team_tag">${obj['team_tag']}.</span>`;
    myString += `<span class="player_name">${obj['name']}</span>`;
    if (obj['sponsor'])  myString += `<span class="sponsor">${obj['sponsor']}</span>`;
    if (obj['country'])  myString += `<div style="float: right;"><img src="http://steamcommunity-a.akamaihd.net/public/images/countryflags/${obj['country']}.gif">&nbsp;&nbsp;</div>`;
    myString += `</td><td align="center">${obj['solo_mmr']}</td>`;
    newTr.innerHTML = myString;
    myTbody.appendChild(newTr);    
}

var myTable = document.querySelector('table');
myTable.removeChild(myTable.lastChild);
myTable.appendChild(myTbody);




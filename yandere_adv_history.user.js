// ==UserScript==
// @name        Yande.re advanced history
// @namespace   org.fireattack.yandere
// @match       *://yande.re/history
// @version     2.1
// ==/UserScript==

var tbody = document.querySelector("table#history tbody");
var earliestRev = tbody.querySelector('tr:last-child').id.match(/r(\d+)/)[1];
var colNum = 20;
var shownColNum = 20;
var maxShownColNum = 40;
var pageNum = 2;
var maxColNum = 80;

var url = "https://yande.re/history?page=";

async function fetchPage(){
    while (shownColNum < maxShownColNum){
    var myUrl = url + pageNum;
    var response = await fetch(myUrl);
    var text = await response.text();
    var page2html = document.createElement('html');
    page2html.innerHTML = text;
    var page2tbody = page2html.querySelector("table#history tbody");

    while (page2tbody.children.length > 0) {
        var rev = page2tbody.children[0].id.match(/r(\d+)/)[1];
        if (rev>=earliestRev) {
            console.log(`find duplicate rev #${rev}, deleting..`);
            page2tbody.removeChild(page2tbody.children[0]);
        } else {
            processFilter(page2tbody.children[0]);
            tbody.appendChild(page2tbody.children[0]);
            colNum++;
        }
    }
    earliestRev = rev;
    var myScript = page2html.querySelector("body script:nth-last-child(2)");
    //document.querySelector('body').appendChild(myScript);
    eval(myScript.innerHTML);
    pageNum++;
    console.log(`Currently showing: ${shownColNum} columns`);
    }
}

function processFilterAll() {
    shownColNum = 0;
    for (let myTr of tbody.children){
        processFilter(myTr);
    }
}

function processFilter(myTr) {
    myTr.style.display = 'table-row';
    var filterRules = filterText.value.split(/\r?\n/g);
    for (let myRule of filterRules){
        if (myRule.toLowerCase().startsWith('user')){
            let author = myRule.match(/^user:(.+)$/i)[1].toLowerCase();
            if (myTr.querySelector('td.author').textContent.toLowerCase() === author) {
            myTr.style.display = 'none';
            return true;
            }
        }
    }
    shownColNum++;
    return false;
}

var filterDialog = document.createElement('div');
filterDialog.id = 'filterDialog';
filterDialog.style.cssText = 'display: none; position: fixed; left: 0px; right: 0px; top: 0px; margin: 100px auto; height: 60%; width: 50%; background: rgba(0, 0, 0, 0.7);';
document.querySelector('body').appendChild(filterDialog);

var filterText = document.createElement('textarea');
filterText.style.cssText = "display: block; margin: 20px auto; height: 87%; width: 95%;";
filterText.value = localStorage.getItem('historyFilters');
filterDialog.appendChild(filterText);

var filterCloseBtn = document.createElement('input');
filterCloseBtn.type = 'button';
filterCloseBtn.value = 'Close';
filterCloseBtn.style.cssText = 'display: block; margin: 2px auto;';
filterCloseBtn.onclick = function(){
    localStorage.setItem('historyFilters',filterText.value);
	filterDialog.style.display = 'none';
}
filterDialog.appendChild(filterCloseBtn);

var insertPoint = document.querySelector('div form input#search').parentElement;

var filterList = document.createElement("input");
filterList.type = 'button';
filterList.id = "filterList";
filterList.value = "Edit filter";
filterList.onclick = function() {
	if (filterDialog.style.display === 'block') {
        localStorage.setItem('historyFilters',filterText.value);
		filterDialog.style.display = 'none';
	} else {
		filterDialog.style.display = 'block';
	}
}
insertPoint.appendChild(filterList);

var filterBtn = document.createElement("input");
filterBtn.type = 'button';
filterBtn.id = "filterBtn";
filterBtn.value = "Apply filter";
filterBtn.onclick = function() { processFilterAll()};
insertPoint.appendChild(document.createTextNode(' '));
insertPoint.appendChild(filterBtn);

var loadmoreBtn = document.createElement("input");
loadmoreBtn.type = 'button';
loadmoreBtn.id = "loadmoreBtn";
loadmoreBtn.value = "Load more..";
loadmoreBtn.onclick = function() {
    maxShownColNum += 40;
    fetchPage();
};
insertPoint.appendChild(document.createTextNode(' '));
insertPoint.appendChild(loadmoreBtn);

processFilterAll();
console.log(`Currently showing: ${shownColNum} columns`);
fetchPage();
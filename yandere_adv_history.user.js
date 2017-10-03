// ==UserScript==
// @name        Yande.re advanced history
// @namespace   org.fireattack.yandere
// @match       *://yande.re/history
// @version     1.0
// ==/UserScript==

var url = "https://yande.re/history?page=2";
var page2html = document.createElement('html');

fetch(url).then(function(response) {
  response.text().then(function(text) {
      
    page2html.innerHTML = text;
    page2tbody = page2html.querySelector("table#history tbody");
    page1tbody = document.querySelector("table#history tbody");
    
    while (page2tbody.childNodes.length > 0) {
    page1tbody.appendChild(page2tbody.childNodes[0]);
    }
    
    var myscript = page2html.querySelector("body script:nth-last-child(2)");
    eval(myscript.innerHTML);
    
  });
});

// ==UserScript==
// @name        HN Highlight OP
// @namespace   https://twitter.com/ikenaikoto
// @match       https://news.ycombinator.com/item
// @grant       GM_addStyle
// @version     1.0
// @author      fireattack
// ==/UserScript==

GM_addStyle("\
.highlight { \
    color: #FFFFFF !important; \
    padding: 0 2px 0 2px;\
    border-radius: 3px;\
    background-color: rgb(255, 102, 0); !important;\
} \
");

var opName = document.querySelector('td.subtext > a.hnuser').text;
document.querySelectorAll("a.hnuser").forEach(ele=>{
    if (ele.text == opName)
        ele.className += ' highlight';
});
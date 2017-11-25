// ==UserScript==
// @name              MLTD wiki add idol colors for tables
// @namespace         https://twitter.com/ikenaikoto
// @version           0.1
// @description       MLTD wiki add idol colors for tables
// @author            fireattack
// @match             *://imasml-theater-wiki.gamerch.com/*
// ==/UserScript==

function getNames(selector,color){
    var list = [];
    var div = document.querySelector(selector);
    for (let myA of div.querySelectorAll('a')) {
    list.push([color, myA.childNodes[0].textContent]);
    }
    return list;
}

princessNames = getNames('#js_oc_box_m0','pink');
fairyNames = getNames('#js_oc_box_m1','blue');
angelNames = getNames('#js_oc_box_m2','yellow');
names = princessNames.concat(fairyNames,angelNames);

for (let span of document.querySelectorAll('table span')){
    for (let name of names) {
        if (span.textContent.includes(name[1])) {
            //span.style.color = name[0];
            span.style.cssText = `color: ${name[0]};`
            if (name[0]!='blue') span.style.cssText += 'background-color: black;';             
            break;
        }
    }        
}
    
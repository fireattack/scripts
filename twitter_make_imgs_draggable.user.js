// ==UserScript==
// @name         Image draggable
// @namespace    https://twitter.com/ikenaikoto
// @version      1.0
// @author       fireattack
// @match        *://twitter.com/*
// ==/UserScript==

function fixImageDrag() {
    document.querySelectorAll('img[alt="Image"]').forEach(ele => {
        //console.log(ele);
        ele.removeAttribute('draggable');
        ele.setAttribute('tabindex', '0');
    })
}

fixImageDrag();

var target = document.querySelector('body');

var observer = new MutationObserver(function (mutations, ob) {
    mutations.forEach(function (mutation) {
        fixImageDrag();
    });
});

var config = { attributes: true, childList: true, characterData: true };
observer.observe(target, config);



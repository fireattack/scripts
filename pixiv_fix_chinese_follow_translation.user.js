// ==UserScript==
// @name         Unfuck Pixiv Chinese follow button's text
// @namespace    https://twitter.com/ikenaikoto
// @version      0.1
// @description  try to take over the world!
// @author       fireattack
// @match        https://www.pixiv.net/*
// ==/UserScript==

(function () {
    'use strict';

    function fixButton() {

        document.querySelectorAll('button').forEach(button => {
            var yiguanzhuColors = ["rgb(245, 245, 245)", "rgba(0, 0, 0, 0.04)", "rgb(255, 255, 255)"]
            if ((button.textContent == '关注') && yiguanzhuColors.includes(getComputedStyle(button).backgroundColor)) {
                button.textContent = '关注中';
            }            
        });
    }

    // create an observer instance
    var observer = new MutationObserver(function (mutations, ob) {
        mutations.forEach(function (mutation) {
            fixButton();
        });
    });

    // configuration of the observer:
    var config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };
    // pass in the target node, as well as the observer options
    observer.observe(document.body, config);

})();
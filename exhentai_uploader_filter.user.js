// ==UserScript==
// @name              Exhentai uploader filter
// @namespace         https://twitter.com/ikenaikoto
// @version           0.2
// @description       Exhentai uploader filter
// @author            fireattack
// @match             *://exhentai.org/*           
// @exclude           *://exhentai.org/g/*
// @exclude           *://exhentai.org/
// ==/UserScript==

const banList = ['sim22x'];

var nodes = document.querySelectorAll('.id1');

for (node of nodes) {
    (node => { // Must be wrapped within an IIFE, otherwise the parameter will be changed.

        var url = node.querySelector('a').href;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                var authorName = xhr.responseXML.querySelector('#gdn a').textContent;

                if (banList.includes(authorName)) {
                    node.style.display = 'none';
                }
            }
        };
        xhr.responseType = 'document';
        xhr.send();
    })(node);
}
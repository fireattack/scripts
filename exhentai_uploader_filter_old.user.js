// ==UserScript==
// @name              Exhentai uploader filter old
// @namespace         https://twitter.com/ikenaikoto
// @version           0.1
// @description       Exhentai uploader filter
// @author            fireattack
// @match             *://exhentai.org/*           
// @exclude           *://exhentai.org/g/*
// @exclude           *://exhentai.org/
// ==/UserScript==

var nodes = document.querySelectorAll('.id1');

var current = 0;

function checkAuthors() {
    setTimeout(() => {
        (function(node) {
            var url = node.querySelector('a').href;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                    var authorName = xhr.responseXML.querySelector('#gdn a').textContent;
                    if (authorName == 'sim22x') {
                        console.log(authorName);
                        console.log(current);
                        console.log(node);
                        node.style.display = 'none';
                    }
                }
            };
            xhr.responseType = 'document';
            xhr.send();
        }(nodes[current]));
        ++current;
        if (current < nodes.length)
            checkAuthors();
    }, 0);
}

checkAuthors();
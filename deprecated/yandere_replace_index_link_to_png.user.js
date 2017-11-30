// ==UserScript==
// @name          Yande.re replace index link to PNG
// @namespace     org.fireattack.yandere
// @description   Change link from jpeg->png for index page star bar (under thumbs)
// @match         *://yande.re/post
// @match         *://yande.re/post?*
// @version       0.0.2
// ==/UserScript==

var allLinks = document.querySelectorAll('a');
    for (let myLink of allLinks) {
        
        if (myLink.href.match(/.*re\/jpeg.*/i)) {
            myLink.href = myLink.href.replace(/jpeg/, 'image');
            myLink.href = myLink.href.replace(/\.jpg/, '\.png')
        }
    }


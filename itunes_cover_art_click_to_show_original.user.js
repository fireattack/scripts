// ==UserScript==
// @name         iTunes Cover Art Click to Show Original
// @namespace    https://twitter.com/ikenaikoto
// @version      0.5
// @description  Click on cover art to get original largest PNG image.
// @author       fireattack
// @match        *://itunes.apple.com/*/album/*
// @match        *://music.apple.com/*/album/*
// ==/UserScript==

function addLink() {
    console.log('Trying to add link!');
    var img = document.querySelector('picture img, .product-info img.media-artwork-v2__image');
    console.log(img);
    if (!img) return;
    var url = '';
    if (img['srcset']) {
        url = img['srcset'].split(' ')[0];
    } else {
        url = img['src'];
    }
    url = url.replace(/\/[0-9]*x[0-9]*[a-z]*(?:-[0-9]+)?(\.[^/.]*)$/, "/999999999x0w-999.png");
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.cursor = 'pointer';
    img.outerHTML = "<a href='" + url + "' target='_blank'>" + img.outerHTML + "</a>";
    var link = document.querySelector('picture img, div.product-info img.media-artwork-v2__image').parentNode;
    console.log(link);
    link.onclick = function (e) {
        e.stopPropagation();
    };
}

addLink();

var target = document.querySelector('html'); //div.page-container
var observer = new MutationObserver(function (mutations, ob) {
    mutations.forEach(function (mutation) {
            addLink();
    });
});

var config = { attributes: true, childList: true, characterData: true, subtree: false };
observer.observe(target, config);

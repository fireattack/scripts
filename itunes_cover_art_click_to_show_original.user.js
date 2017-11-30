// ==UserScript==
// @name         iTunes Cover Art Click to Show Original
// @namespace    https://twitter.com/ikenaikoto
// @version      0.1
// @description  Click on cover art to get original largest PNG image.
// @author       fireattack
// @match        *://itunes.apple.com/*/album/*
// ==/UserScript==

$('head').append('<style>.we-artwork::before{display:none !important;}</style>');

setTimeout(() => {
    var img = $('picture img').first();
    var url = img.attr('src').replace(/(.+)\/\d+x0w\.jpg/, '$1/9999x0w.png');
    img.wrap("<a href='" + url + "' </a>");
}, 1000);
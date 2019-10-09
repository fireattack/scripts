// ==UserScript==
// @name         Sony Music Shop add link to cover image
// @namespace    https://twitter.com/ikenaikoto
// @version      0.1
// @description  Add a link in title to show the cover image.
// @author       fireattack
// @match        http*://www.sonymusicshop.jp/m/item/itemShw.php*
   
// ==/UserScript==


let cover_span = document.querySelector('#product__header ul > li > span');
let cover_url = cover_span.style.backgroundImage.replace(/url\(\"(.+?)__[0-9]+_[0-9]+_[0-9]+_([a-z]+\.[a-z]*)(?:\?.*)?\"\)$/, "$1_$2");

let title = document.querySelector('#product__header > div.specs > p.title');

title.innerHTML = `<a href="${cover_url}">${title.innerHTML}</a>`;
title.style.textDecoration = 'underline';
// ==UserScript==
// @name         2ch(5ch) image show thumbnail
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  2(5)ちゃんねるに貼られている画像のサムネイルを表示します。
// @author       ぬ / fireattack
// @match        http://*.5ch.net/*
// @match        https://*.5ch.net/*
// @match        http://*.2ch.sc/*
// @match        https://*.2ch.sc/*
// @match        http://*.bbspink.com/*
// @match        https://*.bbspink.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// ==/UserScript==

// Original: https://greasyfork.org/scripts/25165

function addThumb() {
  $('a').each(function () {
    if ($(this).hasClass('done')) return;
    var address = $(this).text();
    var ext = address.split('.').pop();
    var exts = ["jpg", "jpeg", "png", "gif", "bmp"];
    if (exts.includes(ext.toLowerCase().replace(":large", '').replace(':orig', ''))) {
      $(this).after($('</br><a href=' + address + ' target="_blank"><img src=' + address + ' width=400/></a></br>'));
      $(this).addClass('done');
    }
  });

  $(".thumb_i").hide();
}

addThumb();
var target = document.querySelector('body');
var observer = new MutationObserver(function (mutations, ob) {
  mutations.forEach(function (mutation) {
    addThumb();
  });
});
var config = { attributes: true, childList: true, characterData: true };
observer.observe(target, config);
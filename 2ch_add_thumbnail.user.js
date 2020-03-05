// ==UserScript==
// @name         2ch(5ch) image show thumbnail
// @namespace    http://tampermonkey.net/
// @version      2.1
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

function addThumb() {
  $('a').each(function () {
    if ($(this).hasClass('done')) return;
    var address = $(this).text();
    var ext = address.split('.').pop();
    if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif" || ext == "bmp" || ext == "jpg:large" || ext == "jpeg:large" || ext == "png:large") {
      $(this).after($('</br><a href=' + address + ' target="_blank"><img src=' + address + ' width=400/></a></br>'));
      $(this).addClass('done');
    }
  });

  $(".thumb_i").each(function () {
    $(this).hide();
  });
}

addThumb(); // Add once first so our condition later is true initially

var target = document.querySelector('body > dl');

// create an observer instance
var observer = new MutationObserver(function (mutations, ob) {
  mutations.forEach(function (mutation) {
    if (!document.querySelector('picture > a > img')) {
      addThumb();
    }
  });
});

// configuration of the observer:
var config = {
  attributes: true,
  childList: true,
  characterData: true
};

// pass in the target node, as well as the observer options
observer.observe(target, config);
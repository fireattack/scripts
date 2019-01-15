// ==UserScript==
// @name         iTunes Cover Art Click to Show Original
// @namespace    https://twitter.com/ikenaikoto
// @version      0.21
// @description  Click on cover art to get original largest PNG image.
// @author       fireattack
// @match        *://itunes.apple.com/*/album/*
// ==/UserScript==

$('head').append('<style>.we-artwork::before{display:none !important;}</style>'); // Remove cover art css blocking.

function addLink() {
    var img = $('picture img').first();
    var url = img.attr('src').replace(/(.+)\/\d+x0w\.jpg/, '$1/999999999x0w.png');
    img.wrap("<a href='" + url + "' </a>");
}

addLink(); // Add once first so our condition later is true initially

var target = document.querySelector('body');

// create an observer instance
var observer = new MutationObserver(function(mutations, ob) {
    mutations.forEach(function(mutation) {
      if(!document.querySelector('picture > a > img')) {
          console.log('It seems our <a> got removed, re-adding..');
          addLink();
          ob.disconnect(); // Optional; it looks like the node will only be overriden once, so we can disconnect the ob afterwards.
      }
    });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

// pass in the target node, as well as the observer options
observer.observe(target, config);

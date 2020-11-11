// ==UserScript==
// @name         iTunes Cover Art Click to Show Original
// @namespace    https://twitter.com/ikenaikoto
// @version      1.0
// @description  Click on cover art to get original largest PNG image.
// @author       fireattack
// @match        *://itunes.apple.com/*/album/*
// @match        *://music.apple.com/*/album/*
// ==/UserScript==

const DEBUGGING = false;
let config = { attributes: true, childList: true, characterData: true, subtree: false };
let target = document.querySelector('html');
let observer = new MutationObserver(function (mutations, ob) {
  mutations.forEach(function (mutation) {
    addLink();
  });
});

function print() {
  if (!DEBUGGING) return;
  console.log('[Debug]',...arguments);
}

function addLink() {
  print('Start!');
  let picture = document.querySelector('picture');
  if (!picture) return;
  let source = picture.querySelector('source');
  let url = '';
  if (source['srcset']) {
    url = source['srcset'].split(' ')[0];
  } else {
    url = source['src'];
  }
  url = url.replace(/\/[0-9]*x[0-9]*[a-z]*(?:-[0-9]+)?(\.[^/.]*)$/, "/999999999x0w-999.png");
  let img = picture.querySelector('img');
  if (!img) return;
  img.style.cursor = 'pointer';
  let thumbnail_url = '';
  if (img.src && !img.src.includes('1x1.gif')) {
    return;
  } else if (img.currentSrc) {
    thumbnail_url = img.currentSrc;
  } else {
    thumbnail_url = url.replace("/999999999x0w-999.png", "/500x500bb.webp");
  }
  
  print('Update img.src:', img.src, thumbnail_url);
  img.src = thumbnail_url;

  img.outerHTML = "<a href='" + url + "' target='_blank'>" + img.outerHTML + "</a>";
  let link = document.querySelector('picture img').parentNode; // get the link we just added using outerHTML
  link.onclick = function (e) {
    e.stopPropagation();
  };
  print('Added link to cover.');
  observer.observe(document.querySelector('div.loading-inner'), config);
}

observer.observe(target, config);
//addLink();
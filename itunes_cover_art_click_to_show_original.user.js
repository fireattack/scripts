// ==UserScript==
// @name         iTunes Cover Art Click to Show Original
// @namespace    https://twitter.com/ikenaikoto
// @version      2.0
// @description  Click on cover art to get original largest PNG image.
// @author       fireattack
// @match        *://itunes.apple.com/*/album/*
// @match        *://music.apple.com/*/album/*
// @match        *://music.apple.com/*/artist/*
// ==/UserScript==

const DEBUGGING = true;
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
  // observer.observe(document.querySelector('div.loading-inner'), config);
  let picture = document.querySelector('div.artwork > div.artwork-component picture');
  if (!picture) return;
  let source = picture.querySelector('source');
  let url = '';
  if (source['srcset']) {
    url = source['srcset'].split(' ')[0];
  } else {
    url = source['src'];
  }
  let orig_url = url.replace(/^.+?mzstatic\.com\/image\/thumb\/([^/]+\/+v4\/+(?:[a-f0-9]{2}\/+){3}[-0-9a-f]{20,}\/[^/]+)\/*[^/]*$/, "https://a1.mzstatic.com/us/r1000/063/$1");
  let img = picture.querySelector('img');
  if (!img) return;

  let thumbnail_url = '';
  if (img.src && !img.src.includes('1x1.gif')) {
    return;
  } else if (img.currentSrc && !img.currentSrc.includes('1x1.gif')) {
    thumbnail_url = img.currentSrc;
  } else {
    thumbnail_url = url.replace(/\/[0-9]*x[0-9]*[a-z]*(?:-[0-9]+)?(\.[^/.]*)$/, "/500x500bb.webp");
  }
  print('Update img.src:', img.src, thumbnail_url);
  img.src = thumbnail_url;
  img.style.cursor = 'pointer';
  img.style.opacity = 1;

  if (img.parentNode.nodeName !== "A") {
    img.outerHTML = "<a id='test' href='" + orig_url + "' target='_blank'>" + img.outerHTML + "</a>";
    let link = document.querySelector('picture img').parentNode; // get the link we just added using outerHTML
    link.onclick = function (e) {
      e.stopPropagation();
    };
    print('Added link to cover.');
  }
}

observer.observe(target, config);
// observer.observe(document.querySelector('div.loading-inner'), config);
//addLink();
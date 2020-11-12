// ==UserScript==
// @name         2ch (5ch) enhancer
// @namespace    http://tampermonkey.net/
// @version      5.4
// @author       ぬ / fireattack
// @match        http://*.5ch.net/*
// @match        https://*.5ch.net/*
// @match        http://*.2ch.sc/*
// @match        https://*.2ch.sc/*
// @match        http://*.bbspink.com/*
// @match        https://*.bbspink.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// ==/UserScript==

// Original: https://greasyfork.org/scripts/25165

GM_addStyle(`
#mydiv {
    position: fixed;
    right: 60px;
    top: 10px;
    font-size: 12pt;
    padding: 10px;
    background-color: #FFFFFF;
}

#mylabel {
    padding: 5px;
    margin: 0 0 5px;
    display: block;
}

.folded {
  padding: 0px !important;
}

.folded > .message {
  display: none !important;
}
`
);


function scroll(readId) {
  if (!readId) return;
  $([document.documentElement, document.body]).animate({
    scrollTop: $(`#${readId}`).offset().top
  }, 0);
}

function foldPosts(readId) {
  let existingContent = [];
  $('div.post').each(function () {
    $('.meta', this).click(() => {
      $(this).toggleClass('folded');
    });
    $('.meta > span.name a', this).removeAttr("href");

    let id = Number($(this).attr('id'));
    let text = $('.message', this).text();
    let filtered = blacklist.some(w => text.includes(w));
    if (readId && id <= readId) {
      $(this).addClass('folded'); // Fold without recording content
    } else {
      if (existingContent.includes(text) || filtered) {
        $(this).addClass('folded');
      } else {
        existingContent.push(text);
      }
    }
  });
  if (readId) label.innerHTML = `Your last progress is: <b>${readId}</b>`;
}

function setReadProgress() {
  let oldId = Number(localStorage.getItem('readId'));
  let oldURL = localStorage.getItem('readURL');
  let newestId = Number($('div.post').last().attr('id'));
  let url = window.location.href;
  if (!oldURL || url !== oldURL || !oldId || newestId > oldId) {
    localStorage.setItem('readId', newestId);
    localStorage.setItem('readURL', url);
    localStorage.setItem('readTitle', document.title);
    label.innerHTML = `Your last progress is: <b>${newestId}</b>`;
  }
}

function addThumb() {
  $('div.post').each(function () {
    if ($(this).hasClass('folded')) return;
    $('div.message a', this).each(function () {
      if ($(this).hasClass('done')) return;
      var address = $(this).text();
      var ext = address.split('.').pop();
      var exts = ["jpg", "jpeg", "png", "gif", "bmp"];
      if (address.includes('twimg.com') || exts.includes(ext.toLowerCase())) {
        $(this).after($('</br><a href=' + address + ' target="_blank"><img src=' + address + ' width=400/></a></br>'));
        $(this).addClass('done');
      }
    });
  });
}

var readURL = localStorage.getItem('readURL');
var readId = Number(localStorage.getItem('readId'));
var readTitle = localStorage.getItem('readTitle');

if (window.location.href.includes('read.cgi')) {
  var myDiv = document.createElement('div');
  myDiv.id = 'mydiv';
  document.body.appendChild(myDiv);
  var label = document.createElement('p');
  label.id = 'label';
  label.innerHTML = `Your last progress is: <b>N/A</b>`;
  myDiv.appendChild(label);
  var myBtn = document.createElement('button');
  myBtn.textContent = 'Set reading progress!';
  myBtn.onclick = () => {
    setReadProgress();
  };
  myDiv.appendChild(myBtn);
  let bl;
  var blacklist = [];
  if (bl = localStorage.getItem('blacklist')) {
    var blacklist = bl.split(';');
  }
  if (window.location.href !== readURL) readId = 0; //If not the same post, doesn't count.
  foldPosts(readId); //Fold both read posts and duplicates
  if (window.location.href === readURL) { //Scroll to last read
    scroll(readId);
    $('button#btGoTop').click(function (e) { //Override top button as well
      scroll(readId);
      e.stopPropagation();
    });
  }
  addThumb();
  //history.scrollRestoration = "manual"; // Use this if you don't want browser to retain the scr. pos.
} else if (window.location.href.includes('krsw.5ch.net/idolmaster')) {
  GM_addStyle(`
  div.board_header,body > div:nth-child(5),body > div:nth-child(2) > p,div.ADVERTISE_AREA {
    display: none;
  }
  `)
  let lastThreadID = Number(readTitle.match(/\d+/)[0]);
  $('body > div.HEADER_AREA > h3').append(`<span>&nbsp;&nbsp;&nbsp;&nbsp; Last read: <a href="${readURL}">${readTitle} (${readId})</a></span>`)
  $('body > div.THREAD_MENU > div > p').each(function(){
    if ($(this).text().includes('箱崎星梨花')){
      let newTitle = $(this).text().replace(/\d+:\s+(.+)$/, '$1');
      let newThreadID = newTitle.match(/\d+/)[0];
      let newURL = $('a', this)[0].href.replace(/l50$/, '');
      if (newThreadID >= lastThreadID)
        $('body > div.HEADER_AREA > h3').append(`<span>&nbsp;&nbsp;&nbsp;&nbsp; New thread: <a href="${newURL}">${newTitle}</a></span>`)
      return false;
    }
  })
}

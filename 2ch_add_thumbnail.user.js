// ==UserScript==
// @name         2ch (5ch) enhancer
// @namespace    http://tampermonkey.net/
// @version      3
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
`);


function scroll(readId){
  $([document.documentElement, document.body]).animate({
    scrollTop: $(`#${readId}`).offset().top
  }, 0);
}

function foldRead(readId) {  
  if (readId) {
    $('div.post').each(function () {
      let id = Number($(this).attr('id'));
      if (id <= readId) {
        $(this).addClass('folded');
        $('.meta', this).click(() => { //Use arrow func so `this` is kept
          $('.message', this).toggle();
        })
        $('.message', this).hide();
      }
    });
    label.innerHTML = `Your last progress is: <b>${readId}</b>`;
  }
}

function setReadProgress() {
  let oldId = Number(localStorage.getItem('readId'));
  let newestId = Number($('div.post').last().attr('id'));
  let url = window.location.href;
  if (!oldId || newestId > oldId) {
    localStorage.setItem('readId', newestId);
    localStorage.setItem('readURL', url);
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
      if (exts.includes(ext.toLowerCase().replace(":large", '').replace(':orig', ''))) {
        $(this).after($('</br><a href=' + address + ' target="_blank"><img src=' + address + ' width=400/></a></br>'));
        $(this).addClass('done');
      }
    });
  });
}

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

var readId = Number(localStorage.getItem('readId'));
var readURL = localStorage.getItem('readURL');
if (window.location.href === readURL) {
  foldRead(readId);
  scroll(readId); 
  // $('button#btGoTop').click(function (e) {
  //   scroll(readId);
  //   e.stopPropagation();
  // });
}
addThumb();
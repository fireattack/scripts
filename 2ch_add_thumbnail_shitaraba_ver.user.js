// ==UserScript==
// @name         2ch (5ch) enhancer for shitaraba
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       fireattack
// @match        https://jbbs.shitaraba.net/*
// @grant        GM_addStyle
// @run-at       document-idle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// ==/UserScript==

// Target: https://jbbs.shitaraba.net/anime/11093/

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function scroll(readId) {
  if (!readId) return;
  $([document.documentElement, document.body]).animate({
    scrollTop: $(`#comment_${readId}`).offset().top
  }, 0);
}

function foldPosts(readId) {
  $('dl#thread-body dt').each(function () {
    $(this).click(() => {
      $(this).toggleClass('folded');
      $(this).next().toggleClass('folded');
    });
    $('a[href="mailto:sage"]', this).removeAttr("href");

    let id = Number(this.id.match(/\d+/)[0]);
    let text = $('.message', this).text();
    if ((readId && id <= readId)) {
      $(this).addClass('folded');
      $(this).next().addClass('folded');
    }
  });
  if (readId) label.innerHTML = `Your last progress is: <b>${readId}</b>`;
}

function setReadProgress() {
  let oldId = Number(localStorage.getItem('readId'));
  let oldURL = localStorage.getItem('readURL');
  let newestId = Number($('dl#thread-body > dt').last().attr('id').match(/\d+/)[0]);
  let url = window.location.href;
  if (!oldURL || url !== oldURL || !oldId || newestId > oldId) {
    localStorage.setItem('readId', newestId);
    localStorage.setItem('readURL', url);
    localStorage.setItem('readTitle', document.title);
    label.innerHTML = `Your last progress is: <b>${newestId}</b>`;
  }
}

function addThumb() {
  $('dl#thread-body dd').each(function () {
    if ($(this).hasClass('folded')) return;
    $('a', this).each(function () {
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
  GM_addStyle(`
#mydiv {
    position: fixed;
    right: 500px;
    top: 100px;
    font-size: 12pt;
    padding: 10px;
    background-color: #d6d1d1;
}

#mylabel {
    padding: 5px;
    margin: 0 0 5px;
    display: block;
}

dl#thread-body table {
  display: none !important;
}

dl#thread-body dt.folded {
  padding: 0px !important;
}

dl#thread-body dd.folded {
  padding: 0px !important;
  display: none !important;
}
body > table:nth-child(11) {
  display: none !important;
}
`
  );

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
} else if (window.location.href.includes('anime/11093')) {
  GM_addStyle(`
    div#ads_fieldOuter {
      display: none;
    }
    body > div > table > tbody > tr > td > center {
      display: none;
    }
    #contents_box > div.localrule.menu_box > div.content_mainWrapper > div > div > div {
      font-size: 18px;
    }
      `)
  let lastThreadID = Number(readTitle.match(/\d+/)[0]);
  let spaces = [
    '#contents_box > div.localrule.menu_box > div.content_mainWrapper > div > div > div',
    'body > div > table:nth-child(3) > tbody > tr > td'
  ];
  spaces.forEach(sel => {

    $(sel).append(`<span>&nbsp;&nbsp;&nbsp;&nbsp; Last read: <a href="${readURL}">${readTitle.split(' - ')[0]} (${readId})</a></span>`);
  });

  let tl = ['#thread_listOuter > div.menu_box.thread_list.new > div.content_mainWrapper a',
    'body > table > tbody > tr > td > font > a'];
  tl.forEach(sel => {
    $(sel).each(function () {
      if ($(this).next().text().includes('箱崎星梨花')) {
        let newTitle = $(this).next().text().replace(/(\d+)\((\d+)\)$/, '$1 ($2)');
        let newThreadID = newTitle.match(/\d+/)[0];
        let newURL = this.href.replace(/l50$/, '');
        if (newThreadID >= lastThreadID)
          spaces.forEach(sel => { $(sel).append(`<span>&nbsp;&nbsp;&nbsp;&nbsp; New thread: <a href="${newURL}">${newTitle}</a></span>`) });
        return false;
      }
    })
  });
}

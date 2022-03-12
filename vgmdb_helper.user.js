// ==UserScript==
// @name             VGMdb Liner Note Helper
// @namespace        http://tampermonkey.net/
// @version          2.2
// @description      Within album notes in VGMdb, link to artists, and reference tracks by name
// @author           fireattack
// @original-author  btown
// @match            https://vgmdb.net/album/*
// @grant            none
// @license          MIT
// @copyright 2021, btown (https://openuserjs.org/users/btown)
// ==/UserScript==

// modified from https://openuserjs.org/scripts/btown/VGMdb_Liner_Note_Helper as the author no longer updates it

const DEBUGGING = false;

function restoreConsole() {
    var i = document.createElement('iframe');
    i.style.display = 'none';
    document.body.appendChild(i);
    window.console = i.contentWindow.console;
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
if (DEBUGGING) restoreConsole();
var notes = document.getElementById('notes');
var html = notes.innerHTML;

var toBeReplaced = [];
var links = document.querySelectorAll('a[href^="/artist/"]');
[...links].map((link) => {
    try {
        var linkText = link.querySelector('[lang="en"]') || link;
        var name = linkText.textContent;
        var re = new RegExp(escapeRegExp(name), 'g');
        var nameJa = (link.querySelector('[lang="ja"]') || link).textContent;
        var repl = `<a href="${link.href}" target="_blank">${nameJa}</a>`;
        toBeReplaced.push({
            re: re,
            repl: repl,
        });
    }
    catch (err) { }
});

// replace to intermediate placeholders firstly, so links won't be broken
for (idx in toBeReplaced) {
    DEBUGGING && console.log(re, repl);
    var {re, repl} = toBeReplaced[idx];
    var placeHolder = `___${idx}___`;
    html = html.replace(re, placeHolder);
}

for (idx in toBeReplaced) {
    var {re, repl} = toBeReplaced[idx];
    var placeHolder = `___${idx}___`;
    html = html.replace(new RegExp(placeHolder, 'g'), repl);
}

// Feature: add track name to note.
var toBeReplaced = [];
var tracks = [...document.querySelectorAll('div#tracklist table.role:last-of-type .tl tr.rolebit')];
[...tracks].map((track) => {
    try {
        var cols = track.children;
        var num = cols[0].textContent.trim();
        var title = cols[1].textContent.trim();
        DEBUGGING && console.log(num, title);
        var re = new RegExp(`(\\w-)?\\b(${num}|${parseInt(num, 10)})\\b`, 'g');
        var repl = `$& (${title})`;
        html = html.replace(re, repl);
    }
    catch (err) { }
});
notes.innerHTML = html;
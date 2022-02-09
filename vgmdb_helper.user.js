// ==UserScript==
// @name             VGMdb Liner Note Helper
// @namespace        http://tampermonkey.net/
// @version          1.0
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
restoreConsole();
var notes = document.getElementById('notes');
var html = notes.innerHTML;
var links = document.querySelectorAll('a[href^="/artist/"]');
[...links].map((link) => {
    try {
        var linkText = link.querySelector('[lang="en"]') || link;
        var name = linkText.textContent;
        var nameJa = (link.querySelector('[lang="ja"]') || link).textContent;
        var replacement = `<a href="${link.href}" target="_blank">${nameJa}</a>`;
        DEBUGGING && console.log('Name is', name);
        DEBUGGING && console.log(replacement);
        if (notes.innerHTML.includes(replacement)) return;
        for (node of notes.childNodes) {
            if (node.nodeType == 3 && node.textContent.includes(name) && !/M-\d+/.test(node.textContent)) {
                DEBUGGING && console.log('Find matching node', node);
                var newNode = document.createElement("span");
                newNode.innerHTML = node.textContent.replace(new RegExp(name, 'g'), replacement);
                node.replaceWith(newNode);
            }
        }
    }
    catch (err) { }
});

// Feature: add track name to note.
var tracks = document.querySelectorAll('.tl tr.rolebit');
[...tracks].map((track) => {
    try {
        var cols = track.children;
        var num = cols[0].textContent.trim();
        var title = cols[1].textContent.trim();
        DEBUGGING && console.log(num, title);
        var re = new RegExp(`(\\w-)?\\b(${num}|${parseInt(num, 10)})\\b`, 'g')
        for (node of notes.childNodes) {
            if (node.nodeType == 3 && re.test(node.textContent)) {
                DEBUGGING && console.log('Find matching node', node);
                var newNode = document.createElement("span");
                newNode.innerHTML = node.textContent.replace(re, `$& (${title})`);
                node.replaceWith(newNode);
            }
        }
    }
    catch (err) { }
});




// ==UserScript==
// @name         VGMdb Liner Note Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Within album notes in VGMdb, link to artists, and reference tracks by name
// @author       fireattack
// @original-author  btown
// @match        https://vgmdb.net/album/*
// @grant        none
// @license      MIT
// @copyright 2021, btown (https://openuserjs.org/users/btown)
// ==/UserScript==

// modified from https://openuserjs.org/scripts/btown/VGMdb_Liner_Note_Helper as the author no longer updates it

(function () {
    var notes = document.getElementById('notes');
    var html = notes.innerHTML;
    var links = document.querySelectorAll('a[href^="/artist/"]');
    [...links].map((link) => {
        try {
            var linkText = link.querySelector('[lang="en"]') || link;
            var name = linkText.textContent;
            var nameJa = (link.querySelector('[lang="ja"]') || link).textContent;
            var replacement = `<a href="${link.href}" target="_blank">${nameJa}</a>`;
            console.log(name, replacement);
            if (!html.includes(replacement)) html = html.replace(new RegExp(name, 'g'), replacement);
        }
        catch (err) { }
    });

    // Feature: add track name to note.
    // This sometimes is very slow, so disabled it by default.
    // var tracks = document.querySelectorAll('.tl tr.rolebit');
    // [...tracks].map((track) => {
    //     try {
    //         var cols = track.children;
    //         var num = cols[0].textContent.trim();
    //         var title = cols[1].textContent.trim();
    //         console.log(num, title);
    //         html = html.replace(new RegExp(`(\\w-)?\\b(${num}|${parseInt(num, 10)})\\b`, 'g'), `$& (${title})`);
    //     }
    //     catch (err) { }
    // });
    notes.innerHTML = html;
})();

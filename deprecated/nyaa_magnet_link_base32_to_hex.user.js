// ==UserScript==
// @name         Nyaa.si magnet link base32 to hex
// @namespace    https://twitter.com/ikenaikoto
// @version      0.2
// @description  Nyaa.si: Convert magnet link from base32 to hex to help non-compatible applications
// @author       fireattack
// @match        *://*.nyaa.si/*
// ==/UserScript==

function bytesToHex(bytes) {  // From: https://stackoverflow.com/a/34356351/3939155
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

function base32ToHexString(s) { // Modified from http://riceball.com/base32-encoding-and-decoding-in-javascript/
    var len = s.length;
    var apad = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=';
    var v, x, r = 0,
        bits = 0,
        c, o = [];

    s = s.toUpperCase();

    for (i = 0; i < len; i += 1) {
        v = apad.indexOf(s.charAt(i));
        if (v >= 0 && v < 32) { // There was a typo here in the original code (v >0)
            x = (x << 5) | v;
            bits += 5;
            if (bits >= 8) {
                c = (x >> (bits - 8)) & 0xff;
                o.push(c);
                bits -= 8;
            }
        }
    }
    // remaining bits are < 8
    if (bits > 0) {
        c = ((x << (8 - bits)) & 0xff) >> (8 - bits);
        // Don't append a null terminator.
        // See the comment at the top about why this sucks.
        if (c !== 0) {
            o.push(c);
        } else console.log(c);
    }
    return bytesToHex(o);
}

var allLinks = document.querySelectorAll("a[href*='magnet']");
for (let myLink of allLinks) {
    let base32 = myLink.href.match(/btih:(.+?)&/)[1];
    let hex = base32ToHexString(base32);
    myLink.href = myLink.href.replace(base32, hex);
}
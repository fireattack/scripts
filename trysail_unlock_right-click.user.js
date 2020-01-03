// ==UserScript==
// @name         Trysail.jp Unlock right-click
// @namespace    https://twitter.com/ikenaikoto
// @version      0.3
// @description  Get rekt Music Ray'n
// @author       fireattack
// @match        https://trysail.jp/*
// @match        https://sphere.m-rayn.jp/*
// @grant        GM_addStyle
// ==/UserScript==

/* Remove CSS bullshit */

GM_addStyle(`
.protect .img-protect {

    user-select: auto !important;
    -moz-user-select: auto !important;
    -ms-user-select: auto !important;
    -webkit-user-select: auto !important;
    -khtml-user-select: auto !important;
    -webkit-user-drag: auto !important;
    -khtml-user-drag: auto !important;
    -webkit-touch-callout: auto !important;
}

.protect .img-protect img {
    user-select: auto !important;
    -moz-user-select: auto !important;
    -ms-user-select: auto !important;
    -webkit-user-select: auto !important;
    -khtml-user-select: auto !important;
    -webkit-user-drag: auto !important;
    -khtml-user-drag: auto !important;
    -webkit-touch-callout: auto !important;
}
.protect .img-protect:after {
    content: none !important;
}
`);

/* Allow Copy */

$("body").unbind('contextmenu');
$(".protect-content").unbind('mousedown');
$(".protect-content").unbind('selectstart');
$(".protect-content").unbind('contextmenu');
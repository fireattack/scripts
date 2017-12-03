// ==UserScript==
// @name        Yande.re add link to show user's deleted posts
// @namespace   org.fireattack.yandere
// @description Add link to show user's deleted posts
// @match       *://yande.re/user/show/*
// @version     0.0.1
// ==/UserScript==

var allLinks, thisLink;
allLinks = document.evaluate('//a[@href]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < allLinks.snapshotLength; i++) {
    thisLink = allLinks.snapshotItem(i);
    if ((thisLink.href).match(/tags=user/i)) {
        var txt = " (<a href="+thisLink.href+"+deleted:true>index show</a>)";
	allLinks.snapshotItem(i+1).parentNode.innerHTML+=txt;
        break;
    }
}
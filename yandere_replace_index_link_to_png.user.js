// ==UserScript==
// @name          Yande.re replace index link to PNG
// @namespace     org.fireattack.yandere
// @description   Change jpeg->png in index pages
// @match         *://yande.re/post
// @match         *://yande.re/post?*
// @version       0.0.1
// ==/UserScript==

var allLinks, thisLink;
allLinks = document.evaluate( '//a[@href]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < allLinks.snapshotLength; i++)
{ thisLink = allLinks.snapshotItem(i);
if ((thisLink.href).match(/.*re\/jpeg.*/i)){
thisLink.href = (thisLink.href).replace(/jpeg/, 'image');
thisLink.href = (thisLink.href).replace(/\.jpg/, '\.png');
}

}
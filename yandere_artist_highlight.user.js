// ==UserScript==
// @name        Yande.re hightlight posts with artist tag
// @namespace   org.fireattack.yandere
// @match       *://yande.re/post
// @match       *://yande.re/post?*
// @version     0.0.5
// ==/UserScript==

function artistCheck() {

    var tagList = document.querySelector('div.tag-completion-box').nextElementSibling.nextElementSibling;
    var tagJson = tagList.innerText.match(/Post\.register_tags\((.+)\)/)[1];

    var tagObj = JSON.parse(tagJson);

    var thumbs = document.querySelectorAll("a.thumb");
    for (let index = 0; index < thumbs.length; ++index) {
        let imgtags = thumbs[index].querySelector('img').title.match(/Tags: (.+) User/)[1];
        imgtagsarrry = imgtags.split(' ');
        for (let j = 0; j < imgtagsarrry.length; ++j) {
            if (tagObj[imgtagsarrry[j]] === "artist") {
                thumbs[index].parentElement.style['box-shadow'] = "0px 0px 0px 5px #cccc00";
                break;
            }
        }
    }
}


var sidebar = document.querySelector("#tag-sidebar").previousElementSibling;
var node = document.createElement("a");
node.href = "#";
node.id = "artist-check";
node.style="color:#cccc00";
node.onclick = function(e){artistCheck();};
node.appendChild(document.createTextNode('<Check artist>'));
sidebar.appendChild(document.createElement('br'));
sidebar.appendChild(node);

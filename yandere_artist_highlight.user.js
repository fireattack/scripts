// ==UserScript==
// @name        Hightlight posts with artist tag
// @namespace   org.fireattack.yandere
// @match       *://yande.re/post*
// @version     0.0.1
// ==/UserScript==

function artistCheck(){

var taglist = document.querySelector('div.tag-completion-box').nextElementSibling.nextElementSibling;
var tagjson = taglist.innerText.match(/Post\.register_tags\((.+)\)/)[1];

var tagobj = JSON.parse(tagjson);

var thumbs = document.querySelectorAll("a.thumb");
for (var index = 0; index < thumbs.length; ++index) {
	var imgtags = thumbs[index].querySelector('img').title.match(/Tags: (.+) User/)[1];
	imgtagsarrry = imgtags.split(' ');
	for (var j = 0; j < imgtagsarrry.length; ++j) {
		if (tagobj[imgtagsarrry[j]] === "artist"){
			thumbs[index].parentElement.style['box-shadow'] = "0px 0px 0px 5px #cccc00";
			break;
		}
	}
}
}


document.querySelector("#tag-sidebar").previousElementSibling.innerHTML += '<br><a style="color:#cccc00" href="#" id="artist-check">&lt;Check artist&gt;</a>';

document.getElementById('artist-check').onclick = function(e){
  artistCheck();
};

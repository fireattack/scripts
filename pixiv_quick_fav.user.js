// ==UserScript==
// @name              Pixiv quick fav
// @name:zh-CN        Pixiv 一键收藏
// @namespace         https://twitter.com/ikenaikoto
// @version           1.0
// @description       One-click fav on Pixiv
// @description:zh-cn Pixiv 一键收藏，避免烦人的页面跳转
// @author            fireattack
// @match             *://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// ==/UserScript==

function urlencodeFormData(fd) { //From: https://stackoverflow.com/questions/7542586/new-formdata-application-x-www-form-urlencoded
    var s = '';

    function encode(s) {
        return encodeURIComponent(s).replace(/%20/g, '+');
    }
    for (var pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
            s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
        }
    }
    return s;
}

var target = document.querySelector('body');

// create an observer instance
var observer = new MutationObserver(function (mutations, ob) {
    mutations.forEach(function (mutation) {
        var favBtn = document.querySelector('a[href*="/bookmark_add.php"]');
        if (favBtn && favBtn.querySelectorAll('path')) {
            main(favBtn);
            //ob.disconnect();
        }
    });
});

// configuration of the observer:
var config = {
    attributes: true,
    childList: true,
    characterData: true
};

// pass in the target node, as well as the observer options
observer.observe(target, config);

function main(favBtn) {
    color = window.getComputedStyle(favBtn.querySelectorAll('path')[0])['fill'];

    if (color = "rgb(255, 255, 255)") {

        favBtn.onclick = (event) => {
            var data = new FormData();
            data.append('mode', 'save_illust_bookmark');
            data.append('illust_id', window.location.href.match(/id=(\d+)/)[1]);
            data.append('restrict', '0');
            data.append('comment', '');
            data.append('tags', '');
            data.append('tt', globalInitData.token);
            data = urlencodeFormData(data);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/rpc/index.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onload = () => {
                var jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse.error)
                    window.alert('Error!');
                else {
                    clearInterval(t);
                    favBtn.querySelectorAll('path')[0].style.fill = 'rgb(255, 64, 96)';
                    favBtn.querySelectorAll('path')[1].style.fill = 'rgb(255, 64, 96)';
                }
            };
            xhr.send(data);

            i = 255;
            j = -10;
            var t = setInterval(() => {
                str = `rgb(${i}, 64, 96`;
                favBtn.querySelectorAll('path')[1].style.fill = str;
                i = i + j;
                if (i < 0) {
                    i = -i;
                    j = -j;
                };
                if (i > 255) {
                    i = 255 - (i - 255);
                    j = -j;
                }
            }, 30);

            event.preventDefault();
        }
    }
}
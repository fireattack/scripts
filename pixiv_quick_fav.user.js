// ==UserScript==
// @name         Pixiv quick fav
// @namespace    https://twitter.com/ikenaikoto
// @version      0.1
// @description  try to take over the world!
// @author       fireattack
// @match        *://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
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

var favBtn = document.querySelector('.bookmark-container');
favBtn.onclick = (event) => {
    var data = new FormData();
    data.append('mode', 'save_illust_bookmark');
    data.append('illust_id', pixiv.context.illustId);
    data.append('restrict', '0');
    data.append('comment', '');
    data.append('tags', '');
    data.append('tt', pixiv.context.token);
    data = urlencodeFormData(data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/rpc/index.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.onload = () => {
        var jsonResponse = JSON.parse(xhr.responseText);
        if (jsonResponse.error)
            window.alert('Error!');
        else favBtn.querySelector('span:last-child').innerHTML = '成功!';
        setTimeout(() => {
            favBtn.querySelector('a').className = '_bookmark-toggle-button bookmarked edit-bookmark';
            favBtn.querySelector('span:last-child').innerHTML = '编辑收藏';
            favBtn.onclick = null;
        }, 1000);
    };

    xhr.send(data);

    favBtn.querySelector('span:last-child').innerHTML = '收藏中...';
    event.preventDefault();
};
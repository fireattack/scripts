// ==UserScript==
// @name              Pixiv quick fav
// @name:zh-CN        Pixiv 一键收藏
// @namespace         https://twitter.com/ikenaikoto
// @version           0.2
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

var favBtn = document.querySelector('.bookmark-container');
if (!favBtn.querySelector('a:last-child').className.includes('bookmarked')){
    
    var sucess, loading, done;    
    
    switch (favBtn.querySelector('span:last-child').textContent) {
      case '添加收藏':  //Chinese
        success = '成功!';
        loading = '收藏中...';
        done = '编辑收藏';
        break;
      case 'ブックマークに追加':  //Japanese
        success = '完成!';
        loading = '読み込み中...';
        done = 'ブックマークを編集';
        break;
      default:
        success = 'Done!';
        loading = 'Bookmarking..';
        done = 'Edit Bookmark';
    }
    
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
            else favBtn.querySelector('span:last-child').textContent = success;
            setTimeout(() => {
                favBtn.querySelector('a').className = '_bookmark-toggle-button bookmarked edit-bookmark';
                favBtn.querySelector('span:last-child').textContent = done;
                favBtn.onclick = null;
            }, 1000);
        };

        xhr.send(data);

        favBtn.querySelector('span:last-child').textContent = loading;
        event.preventDefault();
    };    
}


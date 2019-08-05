// ==UserScript==
// @name         Moca image directly download
// @namespace    https://twitter.com/ikenaikoto
// @version      0.5
// @description  Add a button to download image directly from moca-news.com iamge page.
// @author       fireattack
// @match        https://moca-news.net/article/*/image*.html
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.button {
  font: bold 15px;
  text-decoration: none;
  background-color: #EEEEEE;
  color: #333333;
  display: block;
  width: 150px;
  text-align: center;
  margin: 5px auto 0 auto;

  padding: 2px 6px 2px 6px;
  border-top: 1px solid #CCCCCC;
  border-right: 1px solid #333333;
  border-bottom: 1px solid #333333;
  border-left: 1px solid #CCCCCC;
}
#img_container {
  display: block;
  margin: auto;
  width: auto;
}
`);


// From https://stackoverflow.com/a/21274652
addJS_Node(image_load_body);

function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement('script');
    if (runOnLoad) {
        scriptNode.addEventListener("load", runOnLoad, false);
    }
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(scriptNode);
}

function image_load_body(art_id, img_id, _mode, _retry) {

    var addDownloadButton = function (blob, filename) {
        document.getElementById('cvs_wrap_1').style.display = 'block';
        document.getElementById('loader').style.display = 'none';
        document.getElementById('image_cvs').style.display = 'none';
        document.getElementById('image_cvs_cover').style.display = 'none';

        var imgContainer = document.createElement('img');
        imgContainer.id = 'img_container';
        imgContainer.src = blob;
        document.getElementById('cvs_wrap_2').append(imgContainer);
        var a = document.createElement('a');
        a.text = 'Download image';
        a.className = 'button';
        a.download = filename;
        a.href = blob;
        imgContainer.parentElement.append(a);
        expire_cookie('imgkey' + (location.href).substr((location.href).indexOf("/image") + 6, 3), '');
    }

    var download = function (url, filename) {
        if (!filename) filename = url.split('\\').pop().split('/').pop();
        fetch(url, {
            credentials: "same-origin"
        })
            .then(response => response.blob())
            .then(blob => {
                let blobUrl = window.URL.createObjectURL(blob);
                addDownloadButton(blobUrl, filename);
            })
            .catch(e => console.error(e));
    }

    httpObj = new XMLHttpRequest();
    httpObj.open('POST', '/pd.php', 'true');

    httpObj.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                set_cookie('imgkey' + (location.href).substr((location.href).indexOf("/image") + 6, 3), this.responseText, '', 0);
                var img_src = "./image/" + (location.href).substr((location.href).indexOf("/image") + 6, 3) + check_str(art_id, img_id) + ".jpg";
                download(img_src);
            }
        }
    }

    httpObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=shift_jis');
    httpObj.send('art_id=' + art_id);
    document.oncontextmenu  = null;
}
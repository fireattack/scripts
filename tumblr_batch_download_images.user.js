// ==UserScript==
// @name           Tumlbr图片一键下载
// @name:en        Download Tumblr Images
// @namespace      https://twitter.com/ikenaikoto
// @version        1.0.0
// @description    一键下载一个Post中的所有图片
// @description:en Download all images from a Tumblr photoset
// @author         fireattack
// @match          http*://*.tumblr.com/post/*
// @run-at         document-end
// @license        MIT License
// ==/UserScript==

(function () {

    // Copied from https://greasyfork.org/en/scripts/370762
    var doDownload = function (blob, filename) {
        var a = document.createElement('a');
        a.download = filename;
        a.href = blob;
        a.click();
    }

    var download = function (url, filename) {
        if (!filename) filename = url.split('\\').pop().split('/').pop();
        fetch(url, {
                headers: new Headers({
                    'Origin': location.origin
                }),
                mode: 'cors'
            })
            .then(response => response.blob())
            .then(blob => {
                let blobUrl = window.URL.createObjectURL(blob);
                doDownload(blobUrl, filename);
            })
            .catch(e => console.error(e));
    }

    var buttonOnClick = function (e) {

        var imgList = e.target.parentNode.querySelector('iframe.photoset').contentDocument.querySelectorAll('div.photoset a');

        for (var j = 0; j < imgList.length; j++) {
            var imgsrc = imgList[j].href;
            download(imgsrc);
        }
    }

    var referenceNodes = document.querySelectorAll('.html_photoset');
    referenceNodes.forEach(node => {
        var button = document.createElement('a');
        button.innerText = '下载图片';
        button.href = 'javascript:void(0)';
        button.onclick = buttonOnClick;
        node.append(button);
    });

})();
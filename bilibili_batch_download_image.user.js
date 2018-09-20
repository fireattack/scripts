// ==UserScript==
// @name           下载B站相簿图片
// @name:en        Download Bilibili Images
// @namespace      https://twitter.com/ikenaikoto
// @version        1.0.0
// @description    一键下载一个相簿中的所有图片
// @description:en Download images from Bilibili gallery
// @author         fireattack
// @match          https://h.bilibili.com/*
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

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    var buttonOnClick = function (e) {

        let fileName = window.location.href.split('/').pop();
        var imgList = document.querySelector('div.images').children;

        for (var j = 0; j < imgList.length; j++) {
            let child = imgList[j];
            var imgsrc = child.src.split('@')[0];
            download(imgsrc, fileName + '_' + pad(j + 1, 2));
        }
    }

    var addFunction = function () {

        var button = document.createElement('a');
        button.setAttribute('class', 'S_txt2');
        button.innerText = '下载图片';
        button.href = 'javascript:void(0)';
        button.onclick = buttonOnClick;
        button.id = 'mybutton';

        var referenceNode = document.querySelector('span.create-date');
        referenceNode.parentNode.insertBefore(button, referenceNode.nextSibling);

    }

    // create an observer instance
    var observer = new MutationObserver(function (mutations, ob) {
        mutations.forEach(function (mutation) {

            if (!document.querySelector('#mybutton')) {
                addFunction();
                console.log('someone f*cked up our button, re-adding..');
            }
            //ob.disconnect();

        });
    });

    // configuration of the observer:
    var config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };

    // pass in the target node, as well as the observer options
    observer.observe(document.body, config);
})();
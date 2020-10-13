// ==UserScript==
// @name         Amazon Add date to title
// @namespace    https://twitter.com/ikenaikoto
// @version      0.2
// @description  Add release date to title on Amazon.
// @author       fireattack
// @match        https://www.amazon.co.jp/*
// ==/UserScript==

(function () {
    'use strict';

    var info = document.querySelector('#detailBullets_feature_div').innerHTML;
    if (info) {
        var re = /\d{4}\/\d{1,2}\/\d{1,2}/;
        var date = info.match(re)[0];
        console.log(date);

        var spans = document.querySelector('#title').querySelectorAll('span.a-color-secondary');
        if (spans.length > 0) {
            var span = spans[spans.length - 1];
            if (!re.test(span.innerText)) {
                span.innerText = span.innerText + " " + date;
            }
        } else {
            var span = document.createElement('span');
            span.classList = 'a-size-medium a-color-secondary a-text-normal';
            span.textContent = date;
            document.querySelector('#productTitle').appendChild(span);
        }
    }

})();
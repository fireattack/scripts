// ==UserScript==
// @name         Trysail.jp Unlock right-click
// @namespace    https://twitter.com/ikenaikoto
// @version      0.4
// @description  Get rekt Music Ray'n
// @author       fireattack
// @match        https://trysail.jp/*
// @match        https://sphere.m-rayn.jp/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {

    /* Remove CSS bullshit */
    GM_addStyle(`
.protect .img-protect {

    user-select: auto !important;
    -moz-user-select: auto !important;
    -ms-user-select: auto !important;
    -webkit-user-select: auto !important;
    -khtml-user-select: auto !important;
    -webkit-user-drag: auto !important;
    -khtml-user-drag: auto !important;
    -webkit-touch-callout: auto !important;
}
.protect .img-protect img {
    user-select: auto !important;
    -moz-user-select: auto !important;
    -ms-user-select: auto !important;
    -webkit-user-select: auto !important;
    -khtml-user-select: auto !important;
    -webkit-user-drag: auto !important;
    -khtml-user-drag: auto !important;
    -webkit-touch-callout: auto !important;
}
.protect .img-protect:after {
    content: none !important;
}
`);

    function allowCopy() {
        /* Allow Copy */
        //$("#image-and-banners").remove();
        //$("body").unbind('load');
        $("body").unbind('contextmenu');
        $(".protect-content").unbind('mousedown');
        $(".protect-content").unbind('selectstart');
        $(".protect-content").unbind('contextmenu');
    }

    // Remove loading and adjust cover
    $('.main-visual-item .img-responsive').height(200);
    $('.main-visual-item .img-responsive').width('auto');
    $("#jsLoading").remove();

    var observer = new MutationObserver(function (mutations, ob) {
        mutations.forEach(function (mutation) {
            console.log('Re-adding allowCopy..');
            allowCopy();
        });
    });

    var config = { attributes: true };

    observer.observe(document.body, config);
})();
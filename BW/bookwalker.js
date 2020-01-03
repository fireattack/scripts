// viewer_image_2.0.10_2019-09-18.js
let func = 'b9b'; 

// 几个有用的function From https://bgm.tv/group/topic/350167
    // NFBR.a6G.Initializer.B0U.menu.model.get("viewerPage")
    // NFBR.a6G.Initializer.B0U.menu.a6l.moveToPage()


// viewer_image_v0.1.10_2018-11-15.js
if (window.location.href.includes('https://magazinewalker.jp/viewer'))
    func = 'B0F'; 
// NFBR.a6G.Initializer.B2O.menu.model.get("viewerPage")
// NFBR.a6G.Initializer.B2O.menu.a6l.moveToPage()


    // From https://jixun.moe/intercept-bookwalker-tw-image
const myCanvas1 = document.createElement('canvas');
const myCanvas2 = document.createElement('canvas');
const backup = window.NFBR.a6G.a5x.prototype[func];

window.NFBR.a6G.a5x.prototype[func] = function () {
    const [targetCanvas, page, image, drawRect, flag] = arguments;
    if (image) {
        // 如果 image === null ，那么这一页是空白页。
        if (flag) {
            myCanvas1.width = page.width; // Use 'page' to cut whitespace. You still need to cut whitespace at the bottom manually, though.
            myCanvas1.height = page.height;
            backup.call(this, myCanvas1, page, image, {
                x: 0,
                y: 0,
                width: page.width,
                height: page.height
            }, flag);
        } else {
            myCanvas2.width = page.width;
            myCanvas2.height = page.height;
            backup.call(this, myCanvas2, page, image, {
                x: 0,
                y: 0,
                width: page.width,
                height: page.height
            }, flag);
        }

    }
    console.log(arguments);
    return backup.apply(this, arguments);
}

myCanvas1.style.cssText = "position: fixed; left: 0px; top: 0px; height: 200px; width: 158px;"
myCanvas2.style.cssText = "position: fixed; left: 158px; top: 0px; height: 200px; width: 158px;"

myCanvas1.addEventListener('contextmenu', (ev) => {
    ev.stopPropagation();
});

myCanvas2.addEventListener('contextmenu', (ev) => {
    ev.stopPropagation();
});
document.body.appendChild(myCanvas1);
document.body.appendChild(myCanvas2);
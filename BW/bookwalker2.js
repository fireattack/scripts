// chrome.exe --disable-web-security --user-data-dir=D:\chrome-data
// --disable-features=IsolateOrigins


// viewer_image_2.0.10_2019-09-18.js
let func = 'b9b'; 
// viewer_image_v0.1.10_2018-11-15.js
if (window.location.href.includes('https://magazinewalker.jp/viewer'))
    func = 'B0F'; 
const backup = window.NFBR.a6G.a5x.prototype[func];
downloaded = [];

window.NFBR.a6G.a5x.prototype[func] = function () {
    const [targetCanvas, page, image, drawRect, flag] = arguments;
    console.log(arguments);
    pageNo = page['index'];
    // pageNo = page['B0G'].match(/\/p-(.+)\.xhtml/)[1];
    // if (pageNo == 'cover') pageNo = '000cover';
    console.log(pageNo);
    if (image) {
        image.orgin = 'anonymous';
        image.crossOrigin = 'anonymous';
        var c = document.createElement('canvas');
        c.width = page.width;
        c.height = page.height;
        backup.call(this, c, page, image, {
            x: 0,
            y: 0,
            width: page.width,
            height: page.height
        }, flag);
        (function (pageNo) {
            if (!downloaded.includes(pageNo)) {
                downloaded.push(pageNo);
                c.toBlob((blob) => {
                    let a = document.createElement('a');
                    a.download = `${pageNo}.png`;
                    a.href = URL.createObjectURL(blob);
                    a.click();
                });
            }
        })(pageNo);
    }
    return backup.apply(this, arguments);
};

// NFBR.a6G.Initializer.B0U.menu.a6l.moveToPage(0);
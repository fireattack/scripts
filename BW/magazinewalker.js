// I have no fucking idea why this works.
// Steps: 打开杂志，然后粘贴进代码。双击图片放大一次，然后疯狂翻页。有一定概率会搞爆Chrome（Firefox无效）开始下载。
//注意不要下载太快 否则会有无法解码的图片 另外，之所以根据不同的flag复制了2遍几乎一样的代码，
// 是因为c和new_image前面故意不加 var / let重复使用全局变量才能使其工作（why？？？）
// 但是有个副作用就是导致异步操作变量错位，所以我复制了2遍，同时处理2张（因为每次都自动load左右2页）

//下面这些是我测试如何绕过CORS用的，已经没用了。
// chrome.exe --disable-web-security --user-data-dir=D:\chrome-data
// --disable-features=IsolateOrigins
//lcp --proxyUrl https://d21agqkwgk4jud.cloudfront.net
 // new_image.src = image.src.replace('https://d21agqkwgk4jud.cloudfront.net', 'http://localhost:8010/proxy');

func = 'B0F'; 
var backup = window.NFBR.a6G.a5x.prototype[func];

downloaded = [];

window.NFBR.a6G.a5x.prototype[func] = function () {
    const [targetCanvas, page, image, drawRect, flag] = arguments;
    console.log(arguments);
    pageNo = page['index'];
    console.log(pageNo);
    if (image && (!downloaded.includes(pageNo))) {
        downloaded.push(pageNo);
        if (flag) {
            (function (aa, page, image, pageNo, flag) {
                c = document.createElement('canvas');  
                c.width = page.width;
                c.height = page.height;    
                new_image = document.createElement('img');
                new_image.crossOrigin = 'anonymous';
                new_image.src = image.src;
               
                new_image.onload = function () {

                    backup.call(aa, c, page, new_image, {
                        x: 0,
                        y: 0,
                        width: page.width,
                        height: page.height
                    }, flag);    
                    c.toBlob((blob) => {
                        let a = document.createElement('a');
                        a.download = `${pageNo}.png`;
                        a.href = URL.createObjectURL(blob);
                        a.click();
                    });
                };
            })(this, page, image, pageNo, flag);

        } else {
            (function (aa, page, image, pageNo, flag) {
                c2 = document.createElement('canvas'); 
                c2.width = page.width;
                c2.height = page.height;    
                new_image2 = document.createElement('img');
                new_image2.crossOrigin = 'anonymous';
                new_image2.src = image.src;
                new_image2.onload = function () {

                    backup.call(aa, c2, page, new_image2, {
                        x: 0,
                        y: 0,
                        width: page.width,
                        height: page.height
                    }, flag);    
                    c2.toBlob((blob) => {
                        let a = document.createElement('a');
                        a.download = `${pageNo}.png`;
                        a.href = URL.createObjectURL(blob);
                        a.click();
                    });
                };
            })(this, page, image, pageNo, flag);
        }
    }
    // return backup.apply(this, arguments);
};
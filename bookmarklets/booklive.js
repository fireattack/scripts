// Test pages
// https://booklive.jp/bviewer/s/?cid=887476_001
// https://static.ichijinsha.co.jp/www/special/mbns/020.5/ 

var downloaded = [];
var book = SpeedBinb.getInstance('content');
var totalPage = book.Xt.In.length;

// Detect start page: sometimes it's 1 sometimes it's 0
var startsWithOne = false;
var startPage = 0;
if (!document.querySelector('#content-p0')) {
    console.log('Warning: page starts with 1.')       
    startPage = 1;
    startsWithOne = true;
}

function moveTo(pageNo) {
    // Note: Page's internal ID for `moveTo` is always zero-indexed even if pageNo starts with 1.
    // console.log(`Move to ${pageNo}...`)    
    if (startsWithOne) pageNo = pageNo - 1;
    book.moveTo(pageNo, 0);
}

function downloadPage(pageNo) {
    console.log(`Downloading ${pageNo}...`);
    /* 
    The decoded images are loaded into three <img>s and then attached to each other vertically.
    But you can't directly merge them together, as there are overlaps between 1/2 and 2/3. 
    THe overlapping, or even the img size of three parts, are not the same or consistent within 
    the same book.
    
    However, the displayed y-coordinate, or offset, of part 2 (y1) reveals the actual 
    visible height of part 1. we can get that height in original dimension (Y1) 
    by scaling it back using the ratio between displayed width (w0) and original width of <img>.

    So, the part we want to keep for part 1 is from 0 to Y1 (the rest are overlapped by
    part 2 so no need to keep). 
    
    For part 2, do the same. So we want to keep the height, from 0 to Y2 (the rest are overlapped by 
    part 3).

    For part 3 we just keep the whole height of <img>, since nothing is overlapping on it.
    */
    let imgs = document.querySelectorAll(`#content-p${pageNo} > div > div > img`);
    let h0 = imgs[0].parentElement.parentElement.offsetHeight;
    let w0 = imgs[0].parentElement.parentElement.offsetWidth;
    let W0 = imgs[0].naturalWidth;
    let y1 = Number(imgs[1].parentElement.style.cssText.match(/inset: ([0-9.]+)%/)[1]) / 100;
    let y2 = Number(imgs[2].parentElement.style.cssText.match(/inset: ([0-9.]+)%/)[1]) / 100;
    let Y1 = Math.round(y1 * W0 / w0 * h0);
    let Y2 = Math.round(y2 * W0 / w0 * h0);
    
    let c = document.createElement('canvas');
    c.width = W0;
    c.height = Y2 + imgs[2].naturalHeight;
    let ctx = c.getContext("2d");
    ctx.drawImage(imgs[0], 0, 0);
    ctx.drawImage(imgs[1], 0, Y1);
    ctx.drawImage(imgs[2], 0, Y2);
    c.toBlob((blob) => {
        downloaded.push(pageNo);
        let a = document.createElement('a');
        a.download = `${pageNo}.png`;
        a.href = URL.createObjectURL(blob);
        a.click();
    });
}

function loaded(pageNo) {
    return !!(document.querySelector(`#content-p${pageNo} > div > div > img`))
}

function downloadPages(startPage) {
    for (var i = startPage; loaded(i); ++i) {
        downloadPage(i);
    }
    if (downloaded.length === totalPage) {
        console.log('Finish!')
        return;
    }
    if (i < totalPage) moveTo(i);
    setTimeout(() => {
        console.log('Load more pages..');
        downloadPages(i);
    }, 3000);
}

downloadPages(startPage, startsWithOne);
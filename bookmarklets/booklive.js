downloaded = [];
book = SpeedBinb.getInstance('content');
total_Page = book.Gt.Ki.length;

function downloadPage(pageNo) {
    console.log(`Downloading ${pageNo}...`);
    let imgs = document.querySelectorAll(`#content-p${pageNo} > div > div > img`);

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
    let y1 = imgs[1].parentElement.style.cssText.match(/translate\([[0-9.]+px, *([0-9.]+)px\);$/)[1];
    let y2 = imgs[2].parentElement.style.cssText.match(/translate\([[0-9.]+px, *([0-9.]+)px\);$/)[1];
    let w0 = imgs[0].parentElement.style.width.replace('px', ''); //w should be all the same.
    let Y1 = Math.round(y1 / w0 * imgs[0].width);
    let Y2 = Math.round(y2 / w0 * imgs[0].width);

    let c = document.createElement('canvas');
    c.width = imgs[0].width;
    c.height = Y2 + imgs[2].height;
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

function downloadPages(startPage, startsWithOne) {
    for (var i = startPage; loaded(i); ++i) {
        downloadPage(i);
    }
    if (downloaded.length === total_Page) {
        console.log('Finish!')
        return;
    }
    if (startsWithOne) book.moveTo(i-1, 0); else book.moveTo(i, 0); // Note: Page's internal ID for `moveTo` is zero-indexed even if pageNo starts with 1.
    setTimeout(() => {
        console.log('Load more pages..');
        downloadPages(i);
    }, 3000);
}

function main() {
    // Detect start page: sometimes it's 1 sometimes it's 0
    let startsWithOne = false;
    let startPage = 0;
    if (!document.querySelector('#content-p0')) {
        console.log('Warning: page starts with 1.')
        if (!document.querySelector('#content-p1'))
        {
            console.error('Cannot find start page!')
            return;
        }
        startPage = 1;
        startsWithOne = true;
    }
    // book.moveTo(0, 0); // moveTo(pageNo, animationEffectNo)
    downloadPages(startPage, startsWithOne);
}
main();
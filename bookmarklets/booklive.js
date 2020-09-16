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
        let a = document.createElement('a');
        a.download = `${pageNo}.png`;
        a.href = URL.createObjectURL(blob);
        a.click();
    });
}

function loaded(pageNo) {
    return !!(document.querySelector(`#content-p${pageNo} > div > div > img`))
}

book = SpeedBinb.getInstance('content');
total_Page = book.Gt.Ki.length;

function downloadPages(startPage) {
    for (var i = startPage; loaded(i); ++i) {
        downloadPage(i);
    }
    if (i > total_Page)
        return;
    book.moveTo(i - 1, 0); // Page's internal ID is zero-indexed.
    setTimeout(() => {
        downloadPages(i);
    }, 3000);
}

downloadPages(1);
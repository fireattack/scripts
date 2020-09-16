const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};
var IDs = [];
for (var a of document.querySelectorAll('section a')) {
    if (/artworks\/\d+/.test(a.href)) {
        IDs.push(a.href.match(/artworks\/(\d+)/)[1]);        
    }
}

IDs = [...new Set(IDs)];
var s = IDs.join(' ');
copyToClipboard(s);
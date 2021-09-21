// from: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

var my_str = []; 
var selector = 'img';
[...document.querySelectorAll(selector)].map(ele => {
    if (ele.src) {
        my_str.push(ele.src);
    }
    else if (ele.style.backgroundImage) {
        my_str.push(new URL(
            ele.style.backgroundImage.replace(/url\(\"(.+)@.+?\"\)/, '$1'),
            window.location.href).href
        );
    }
});
var _ = my_str.join('\n');
console.log(_);
copyTextToClipboard(_);
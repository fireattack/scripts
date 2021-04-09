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
console.log(my_str.join('\n'));
copy(my_str.join('\n'));

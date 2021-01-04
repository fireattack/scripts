var my_str = [];
[...document.querySelectorAll('img')].map(ele => {
    if (ele.src.includes('image.')) {
        my_str.push(ele.src);
    }
});
console.log(my_str.join('\n'));
copy(my_str.join('\n'));

// ==UserScript==
// @name        Show og:image - idolmaster-official.jp
// @namespace   https://twitter.com/ikenaikoto
// @match       https://idolmaster-official.jp/news/*
// @grant       none
// @version     1.2
// @description Constantly check for the og:image and insert it until 5 seconds passed
// ==/UserScript==

function insertOgImage() {
    let imgNode = document.createElement('img');
    let ogImage = document.querySelector('meta[property="og:image"]');

    if (ogImage) {
        imgNode.src = ogImage.content;
        imgNode.id = 'inserted-ogimage'; // Add an id to the img element
    } else {
        console.log('og:image meta tag not found.');
        return;
    }

    let myDiv = document.querySelector('.style_inner_title__keubV');
    let existingImage = document.querySelector('#inserted-ogimage'); // Check if the image was already inserted

    if (myDiv && !existingImage) {
        myDiv.parentElement.insertBefore(imgNode, myDiv);
        console.log('Image inserted.');
    }
}

// Set up the MutationObserver to detect changes in the DOM
let observer = new MutationObserver(function() {
    insertOgImage();
});

// Start observing the document for changes
observer.observe(document, { childList: true, subtree: true });

// Keep trying for 5 seconds to insert the image
let startTime = Date.now();
let interval = setInterval(function() {
    if (Date.now() - startTime > 5000) {
        clearInterval(interval);
        observer.disconnect(); // Stop the observer after 5 seconds
        console.log('Stopped checking after 5 seconds.');
    } else {
        insertOgImage(); // Keep trying to insert the image every check
    }
}, 100);

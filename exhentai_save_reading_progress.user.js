// ==UserScript==
// @name              Exhentai save reading progress
// @name:zh-CN        Exhentai标记阅读进度
// @namespace         https://twitter.com/ikenaikoto
// @version           0.5
// @description       Exhentai save reading progress
// @description:zh-CN Exhentai标记阅读进度
// @author            fireattack
// @match             *://exhentai.org/*
// ==/UserScript==

function changeStyleOfRead(readId) {
    if (readId) {
        var nodes = document.querySelectorAll('.id1');
        nodes.forEach(node => {
            let id = Number(node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1]);
            if (id<=readId)
                node.style.backgroundColor = '#574158';
        });
    }
}

function setReadProgress () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://exhentai.org/', true);
    var maxId = 0;
    var readURL = '';
    xhr.onload = () => {
        var firstPage = xhr.responseXML;
        var nodes = firstPage.querySelectorAll('.id1');
        
        nodes.forEach(node => {
            let id = Number(node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1]);
            let url = node.querySelector('a').href;
            if (id>maxId) {
                maxId = id;
                readURL = url;
        });
        localStorage.setItem('readId', maxId);
        localStorage.setItem('readURL', readURL);
        changeStyleOfRead(maxId);
    };
    xhr.responseType = 'document';
    xhr.send();
}

if (/\.org\/?$|org\/\?/i.test(window.location.href)) {
    var readId = Number(localStorage.getItem('readId'));
    var readURL = localStorage.getItem('readURL');
    changeStyleOfRead(readId);

    let test = `abc${abc}`;

    var myDiv = document.createElement('div');
    myDiv.id = 'mydiv';
    myDiv.style.cssText = 'position: fixed; left: 10px; top: 10px; font-size: 12pt; background-color: #574158 ';
    document.querySelector('body').appendChild(myDiv);

    var label = document.createElement('p');
    label.innerHTML = `Your last progress is: <a href="${readURL}">${readId}</a>`;    
    myDiv.appendChild(label);
    var myBtn = document.createElement('button');
    myBtn.textContent = 'Set reading progress!';
    myBtn.onclick = () => { setReadProgress(); };
    myDiv.appendChild(myBtn);

}
// ==UserScript==
// @name              Exhentai save reading progress
// @name:zh-CN        Exhentai标记阅读进度
// @namespace         https://twitter.com/ikenaikoto
// @version           0.8
// @description       Exhentai save reading progress
// @description:zh-CN Exhentai标记阅读进度
// @author            fireattack
// @match             *://exhentai.org/*
// ==/UserScript==

function changeStyleOfRead(readId, readURL) {
    if (readId) {
        var nodes = document.querySelectorAll('.id1');
        nodes.forEach(node => {
            let id = Number(node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1]);
            if (id <= readId)
                node.style.backgroundColor = '#574158';
        });
        label.innerHTML = readURL ? `Your last progress is: <b><a href="${readURL}">${readId}</a></b>` : `Your last progress is: <b>${readId}</b>`;
    }
}    

function setReadProgress () {
    myBtn.textContent = 'Setting..';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://exhentai.org/', true);
    let maxId = 0;
    let readURL = '';
    xhr.onload = () => {
        var firstPage = xhr.responseXML;
        var nodes = firstPage.querySelectorAll('.id1');        
        nodes.forEach(node => {
            let id = Number(node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1]);
            let url = node.querySelector('a').href;
            if (id>maxId) {
                maxId = id;
                readURL = url;
            }
        });
        localStorage.setItem('readId', maxId);
        localStorage.setItem('readURL', readURL);
        myBtn.textContent = 'Set reading progress!';
        changeStyleOfRead(maxId, readURL);
    };
    xhr.responseType = 'document';
    xhr.send();
}

if (/^(?!.*\/g\/).*$/i.test(window.location.href)) {

    var myDiv = document.createElement('div');
    myDiv.id = 'mydiv';
    myDiv.style.cssText = `
    position: fixed;
    left: 10px;
    top: 10px;
    font-size: 12pt;
    background-color: #574158;
    padding: 10px`;
    document.querySelector('body').appendChild(myDiv);

    var label = document.createElement('p');
    label.innerHTML = `Your last progress is: <b>N/A</b>`;
    myDiv.appendChild(label);
    var myBtn = document.createElement('button');
    myBtn.textContent = 'Set reading progress!';
    myBtn.onclick = () => { setReadProgress(); };
    myDiv.appendChild(myBtn);

    let readId = Number(localStorage.getItem('readId'));
    let readURL = localStorage.getItem('readURL');    
    changeStyleOfRead(readId, readURL);
}
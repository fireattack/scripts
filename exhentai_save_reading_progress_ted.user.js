// ==UserScript==
// @name              Exhentai save reading progress ted ver.
// @name:zh-CN        Exhentai标记阅读进度 ted ver.
// @namespace         https://twitter.com/ikenaikoto
// @version           1.0
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
    let maxId = Number(localStorage.getItem('readId'));
    var nodes = document.querySelectorAll('.id1');
    let node = nodes[nodes.length-1];

    let id = Number(node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1]);
    let url = node.querySelector('a').href;
    if (id>maxId||!maxId) {
        localStorage.setItem('readId', id);
        localStorage.setItem('readURL', url);
        changeStyleOfRead(id, url);
    }

}

if (/\.org\/?$|org\/\?/i.test(window.location.href)) {

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
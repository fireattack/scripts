// ==UserScript==
// @name              Exhentai save reading progress
// @name:zh-CN        Pixiv 一键收藏
// @namespace         https://twitter.com/ikenaikoto
// @version           0.1
// @description       Exhentai save reading progress
// @author            fireattack
// @match             *://exhentai.org/*
// ==/UserScript==

function changeStyleOfRead(readId) {
    if (readId) {
        var nodes = document.querySelectorAll('.id1');
        for (node of nodes)
        {
            let id = node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1];
            if (id<=readId)
                node.style.backgroundColor = '#574158';            
        }
    }
}

function setReadProgress () { 
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://exhentai.org/', true);
    var maxId = 0;
    xhr.onload = () => {
        var firstPage = document.createElement('html');
        firstPage.innerHTML = xhr.responseText;
        var nodes = firstPage.querySelectorAll('.id1');
        
        for (node of nodes) {
            let id = node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1];
            if (id>maxId) maxId = id;
        }
        localStorage.setItem('readId', maxId);
        changeStyleOfRead(maxId);
    };
    xhr.send();
}

var myDiv = document.createElement('div');
myDiv.id = 'mydiv';
myDiv.style.cssText = 'position: fixed; left: 10px; top: 10px;';
document.querySelector('body').appendChild(myDiv);
var myBtn = document.createElement('button');
myBtn.textContent = 'Set reading progress!';
myBtn.onclick = () => { setReadProgress(); };
myDiv.appendChild(myBtn);

var readId = localStorage.getItem('readId');
changeStyleOfRead(readId);
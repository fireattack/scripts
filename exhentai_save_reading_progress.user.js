// ==UserScript==
// @name              Exhentai save reading progress
// @name:zh-CN        Exhentai标记阅读进度
// @namespace         https://twitter.com/ikenaikoto
// @version           2.0
// @description       Exhentai save reading progress
// @description:zh-CN Exhentai标记阅读进度
// @author            fireattack
// @match             *://exhentai.org/*
// @grant             GM_addStyle
// ==/UserScript==

GM_addStyle(`
#mydiv {
    position: fixed;
    left: 10px;
    top: 10px;
    font-size: 12pt;
    background-color: #574158;
    padding: 10px;
}

#mylabel {
    padding: 5px;
    margin: 0 0 5px;
    display: block;
}

#mylabel:hover {
    background: #442948;
    cursor: pointer;
   }
`);

function changeStyleOfRead(readId, readURL) {
    if (readId) {
        var nodes = document.querySelectorAll('.gl1t');
        nodes.forEach(node => {
            let id = Number(node.querySelector('a').href.match(/\/g\/(\d+?)\//)[1]);
            if (id <= readId)
                node.style.backgroundColor = '#574158';
        });
        label.innerHTML = readURL ? `Your last progress is: <b><a href="${readURL}">${readId}</a></b>` : `Your last progress is: <b>${readId}</b>`;
    }
}

function setReadProgress() {

    if (option1Box.checked) {

        let maxId = Number(localStorage.getItem('readId'));
        let nodes = document.querySelectorAll('.gl1t');
        let node = nodes[nodes.length - 1];
        let url = node.querySelector('a').href;
        let id = Number(url.match(/\/g\/(\d+?)\//)[1]);

        if (!maxId || id > maxId) {
            localStorage.setItem('readId', id);
            localStorage.setItem('readURL', url);
            changeStyleOfRead(id, url);
        }
    } else  {

        myBtn.textContent = 'Setting..';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://exhentai.org/', true);
        let maxId = 0;
        let readURL = '';
        xhr.onload = () => {
            var firstPage = xhr.responseXML;
            var nodes = firstPage.querySelectorAll('.gl1t');
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
}

if (document.querySelector('div#toppane')) {

    var myDiv = document.createElement('div');
    myDiv.id = 'mydiv';
    document.querySelector('body').appendChild(myDiv);

    var label = document.createElement('p');
    label.innerHTML = `Your last progress is: <b>N/A</b>`;
    myDiv.appendChild(label);

    var optionAndLabel = document.createElement('label');
    optionAndLabel.id = 'mylabel';
    myDiv.appendChild(optionAndLabel);

    var option1Box = document.createElement('input');
    option1Box.type = 'checkbox';
    option1Box.checked = (localStorage.getItem('option1') == "true");
    option1Box.onclick = () => {
        localStorage.setItem('option1', option1Box.checked);
    };
    optionAndLabel.appendChild(option1Box);
    optionAndLabel.appendChild(document.createTextNode('Mark to this page only'));

    var myBtn = document.createElement('button');
    myBtn.textContent = 'Set reading progress!';
    myBtn.onclick = () => {
        setReadProgress();
    };
    myDiv.appendChild(myBtn);

    let readId = Number(localStorage.getItem('readId'));
    let readURL = localStorage.getItem('readURL');
    changeStyleOfRead(readId, readURL);
}
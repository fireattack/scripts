// ==UserScript==
// @name        OneDrive name copy helper
// @namespace   https://twitter.com/ikenaikoto
// @match       https://onedrive.live.com/*
// @version     1.1
// @author      fireattack
// @description Add a textarea to easily copy OD file and folder names
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle(`
#mydiv {
    position: fixed;
    right: 50px;
    bottom: 50px;
    font-size: 10pt;
    padding: 5px;
    background-color: #d6d1d1;
    margin: 0 0 5px;
    z-index: 999
}
#mydiv > p {
  margin: 0 0 4px;
}

#btn2 {
  display: none;
  margin-top: 5px;
}

#copyfield {
  display: none;
  overflow-y: scroll;
  width: 300px;
}

#min {
  padding: 0;
  position: absolute;
  right: 0px;
  bottom: 0px;
  height: 20px;
  width: 30px;
  margin: auto;
}

`);

function getNodes() {
  let s = "";
  let bars = [];
  document.querySelectorAll('.BreadcrumbBar-item').forEach(e => { bars.push(e.textContent) });
  document.querySelectorAll('.ms-Breadcrumb-listItem').forEach(e => { bars.push(e.querySelector('.ms-TooltipHost').innerText); });
  s += bars.join(' > ') + '\n';
  document.querySelectorAll('button').forEach(e => { if (e.getAttribute('data-automationid') === "FieldRenderer-name") s += e.textContent + '\n'; });
  document.querySelectorAll('a').forEach(e => { if (e.getAttribute('data-automationid') === "FieldRenderer-name") s += e.textContent + '\n'; });
  document.querySelectorAll('span').forEach(e => { if (e.getAttribute('data-automationid') === "name") s += e.textContent + '\n'; });
  copyfield.value = s;
}

function toggleSize() {
  if (document.getElementById('min').textContent === '[-]') {
    document.getElementById('copyfield').style.display = 'none';
    document.getElementById('btn2').style.display = 'none';
    document.getElementById('min').textContent = '[+]';
  }
  else {
    document.getElementById('copyfield').style.display = 'block';
    document.getElementById('btn2').style.display = 'block';
    document.getElementById('min').textContent = '[-]';
  }
}

let myDiv = document.createElement('div');
myDiv.id = 'mydiv';
document.body.appendChild(myDiv);
myDiv.innerHTML = `<p><textarea rows="10" id="copyfield">test</textarea></p>
<p><button id="btn2">Refresh</button></p><button id="min">[+]</button>`;

document.getElementById('btn2').onclick = () => {
  getNodes();
};

document.getElementById('min').onclick = () => {
  toggleSize();
};

getNodes();

let config = { attributes: true, childList: true, characterData: true, subtree: true };
let target = document.querySelector('html');
let observer = new MutationObserver(function (mutations, ob) {
  mutations.forEach(function (mutation) {
    // console.log('something changed!')
    getNodes();
  });
});

observer.observe(target, config);
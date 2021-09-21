// ==UserScript==
// @name         YouTube global volume control
// @version      1.0
// @author       Dovahkiin
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/watch?*
// ==/UserScript==

const reBind = ev => {
  ev.stopPropagation()
  const { code } = ev

  if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(code) &&
    (checkPath(ev.path) || isProgressBar(ev.path))
  ) {
    const eventClone = new KeyboardEvent(ev.type, ev)
    document.querySelector('#movie_player').dispatchEvent(eventClone)
    return false
  };

}
function isProgressBar(path) {
  for (let dom of path) {

    if (dom.className && dom.className.includes('ytp-progress-bar')) {
      return true
    }
  };
  return false
}
function checkPath(path) {
  for (let dom of path) {
    if (dom.className && dom.className.includes('ytd-player')) {
      return false
    }
  };
  return true
}

document.onkeydown = reBind;
document.querySelector('.ytp-progress-bar').onkeydown = reBind;
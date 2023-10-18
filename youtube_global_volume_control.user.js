// ==UserScript==
// @name         YouTube global volume control
// @version      1.2
// @author       Dovahkiin， fireattack
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/*
// ==/UserScript==

const reBind = ev => {
    // console.log("YOU ARE IN reBind!")
    const { code } = ev;
    const path = ev.composedPath();

    // if it's already #movie_player, don't do anything to prevent infinite loop
    if (path[0].id && path[0].id === "movie_player") return

    if (
        ["ArrowDown", "ArrowUp"].includes(code) && !onClass(path, 'ytd-player') // prevent conflict with YouTube's own shortcuts
        || ["ArrowDown", "ArrowUp"].includes(code) && onClass(path, "ytp-progress-bar") // when on progress-bar, makes up/down still control volume
        || ["ArrowLeft", "ArrowRight"].includes(code) && onClass(path, "ytp-volume-panel") // when on volume panel, makes left/right still control progress
    ) {
        ev.stopPropagation();
        console.log(`[${code}]: Clone event from ${path[0].tagName}.${path[0].className} to #movie_player!`)
        // console.dir(path[0])
        const eventClone = new KeyboardEvent(ev.type, ev)
        document.querySelector("#movie_player").dispatchEvent(eventClone)
        return false;
    }
};

function onClass(path, className) {
    for (let dom of path) {
        if (dom.className && dom.className.includes(className)) {
            return true;
        }
    }
    return false;
}

document.onkeydown = reBind;
document.querySelector(".ytp-progress-bar").onkeydown = reBind;
document.querySelector(".ytp-volume-panel").parentElement.addEventListener("keydown", reBind, true);

// ==UserScript==
// @name         S1 Poll Sort
// @namespace    https://twitter.com/ikenaikoto
// @version      0.2
// @description  try to take over the world!
// @author       fireattack
// @match        http*://*.saraba1st.com/2b/forum.php?mod=viewthread&tid=*
// @match        http*://*.saraba1st.com/2b/thread-*-*-*.html
// ==/UserScript==

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.querySelector('div.pcht table tbody');
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 0; i < (rows.length - 4); i = i + 2) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = parseFloat(rows[i + 1].innerHTML.match(/<td> *([0-9.]+)%/)[1]);
            y = parseFloat(rows[i + 3].innerHTML.match(/<td> *([0-9.]+)%/)[1]);
            // Check if the two rows should switch place:
            if (x < y) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 2], rows[i]);
            rows[i].parentNode.insertBefore(rows[i + 3], rows[i + 1]);
            switching = true;
        }
    }
}

var head = document.querySelector('#poll div.pinf');
let btn = document.createElement('button');
btn.appendChild(document.createTextNode('排序'));
btn.onclick = (event) => {
    sortTable();
    event.preventDefault();
};
head.appendChild(btn);
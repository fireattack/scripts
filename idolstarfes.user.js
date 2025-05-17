// ==UserScript==
// @name        idolstarfes.com table sorter
// @namespace   https://twitter.com/ikenaikoto
// @match       https://idolstarfes.com/*list*.html
// @grant       none
// @version     1.2
// @author      fireattack
// @description 10/10/2023, 1:14:52 PM
// ==/UserScript==

var table = document.querySelector("table");
var headers = table.querySelectorAll("tbody > tr:first-child > td");

headers.forEach(function(header, idx) {
    header.addEventListener('click', function() {
        const currentOrder = (header.dataset.order === 'asc') ? 'desc' : 'asc';
        header.dataset.order = currentOrder;  // Update the state for next time
        sortTableByColumn(table, idx, currentOrder === 'asc');
    });
});

function displayUniqueIdolCount(table) {
    let idolColumnIndex = -1;
    let foundHeaderText = "";
    const possibleIdolHeaders = ["プロデュースアイドル", "メインアイドル"];
    headers.forEach((header, index) => {
        const currentHeaderText = header.textContent.trim();
        if (possibleIdolHeaders.includes(currentHeaderText)) {
            if (idolColumnIndex === -1) { // Take the first match
                idolColumnIndex = index;
                foundHeaderText = currentHeaderText;
            }
        }
    });

    if (idolColumnIndex === -1) {
        console.log(`Could not find a column named any of: ${possibleIdolHeaders.join(' or ')}.`);
        return;
    }

    const rows = Array.from(table.querySelectorAll("tr")).slice(1); // Exclude header row
    const idolNameCounts = new Map();

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length > idolColumnIndex) {
            const idolName = cells[idolColumnIndex].textContent.trim();
            if (idolName) { // Ensure not empty
                idolNameCounts.set(idolName, (idolNameCounts.get(idolName) || 0) + 1);
            }
        }
    });

    const countContainerDiv = document.createElement('div');
    countContainerDiv.style.marginBottom = '10px'; // Add some spacing

    const titleElement = document.createElement('h5'); // Renamed to avoid conflict
    titleElement.textContent = `${foundHeaderText}別サークル数:`;
    countContainerDiv.appendChild(titleElement);

    const list = document.createElement('ul');
    const sortedIdolNameCounts = Array.from(idolNameCounts.entries()).sort((a, b) => b[1] - a[1]);

    sortedIdolNameCounts.forEach(([name, count]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${name}: ${count}`;
        list.appendChild(listItem);
    });
    countContainerDiv.appendChild(list);

    table.parentNode.insertBefore(countContainerDiv, table);
}

// Call the function to display the count when the script runs
displayUniqueIdolCount(table);

function sortTableByColumn(table, column, asc = true) {

    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    // pages like https://idolstarfes.com/gsf/g01list_0405.html has the bug that there are two tBodies within table.
    // so we query it from the table instead, and tBody is only used to insert the sorted rows back.
    const rows = Array.from(table.querySelectorAll("tr")).slice(1);
    console.log(rows);
    const sortedRows = rows.sort((a, b) => {
        const aCols = a.querySelectorAll("td");
        const bCols = b.querySelectorAll("td");

        if (aCols.length === 0) return 1;
        if (bCols.length === 0) return -1;

        const aStart = aCols[0].textContent.trim();
        const bStart = bCols[0].textContent.trim();
        if (aStart.startsWith("◇")) return 1;
        if (bStart.startsWith("◇")) return -1;

        const aColText = aCols[column].textContent.trim();
        const bColText = bCols[column].textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (aColText === bColText ? 0 : (-1 * dirModifier));
    });

    rows.forEach(row => row.parentNode.removeChild(row));
    tBody.append(...sortedRows);

}

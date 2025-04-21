// ==UserScript==
// @name         Eventernote Date Quick Navigation
// @namespace    https://gihub.com/fireattack
// @version      1.0
// @description  Add previous/next day buttons to Eventernote search
// @author       fireattack
// @match        https://www.eventernote.com/events/search*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Find the date selection elements
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const controlsDiv = daySelect.parentElement; // The div containing the selects

    if (!yearSelect || !monthSelect || !daySelect || !controlsDiv) {
        console.error("Eventernote Date Navigation: Could not find date elements.");
        return;
    }

    // Function to get the current date from the URL
    function getCurrentDate() {
        const urlParams = new URLSearchParams(window.location.search);
        const year = parseInt(urlParams.get('year'), 10);
        const month = parseInt(urlParams.get('month'), 10);
        const day = parseInt(urlParams.get('day'), 10);

        // Check if parameters exist and are valid numbers
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            console.warn("Eventernote Date Navigation: Could not parse date from URL or date parameters missing.");
            // Optionally, try reading from selects as a fallback or return an invalid date
            return new Date(NaN); // Return an invalid date object
        }

        // Note: JavaScript months are 0-indexed (0=Jan, 11=Dec)
        return new Date(year, month - 1, day);
    }

    // Function to navigate to a specific date
    function navigateToDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Convert back to 1-indexed month
        const day = date.getDate();

        const url = new URL(window.location.href);
        url.searchParams.set('year', year);
        url.searchParams.set('month', month);
        url.searchParams.set('day', day);
        window.location.href = url.toString();
    }

    // Create Previous Day Button
    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.type = 'button'; // Prevent form submission
    prevButton.className = 'btn'; // Use existing button style
    prevButton.style.marginLeft = '5px';
    prevButton.addEventListener('click', () => {
        const currentDate = getCurrentDate();
        if (isNaN(currentDate.getTime())) return; // Handle case where date isn't fully selected
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        navigateToDate(prevDate);
    });

    // Create Next Day Button
    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.type = 'button'; // Prevent form submission
    nextButton.className = 'btn'; // Use existing button style
    nextButton.style.marginLeft = '5px';
    nextButton.addEventListener('click', () => {
        const currentDate = getCurrentDate();
         if (isNaN(currentDate.getTime())) return; // Handle case where date isn't fully selected
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        navigateToDate(nextDate);
    });

    // Insert buttons after the day select
    // Insert '日' text node first if it's not already there or handle spacing
    const dayLabel = Array.from(controlsDiv.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('日'));
    if (dayLabel) {
        controlsDiv.insertBefore(prevButton, dayLabel.nextSibling);
        controlsDiv.insertBefore(nextButton, prevButton.nextSibling);
    } else {
        // Fallback if '日' text node isn't found easily
        controlsDiv.appendChild(prevButton);
        controlsDiv.appendChild(nextButton);
    }

})();
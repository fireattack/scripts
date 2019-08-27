// ==UserScript==
// @name        Change date format on post page
// @namespace   org.fireattack.yandere
// @match       *://yande.re/post/show/*
// @version     1.0
// ==/UserScript==

var my_a = document.querySelector('#stats > ul > li:nth-child(2) > a:nth-child(1)');
var my_date = my_a.title;
//Mon Aug 26 14:53:44 2019

let temp = my_date.split(' ');
let my_str = temp[1] + ' ' + temp[2] + ', ' + temp[4];
my_a.textContent = my_str;
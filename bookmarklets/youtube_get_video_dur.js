// var tag = 'script#scriptTag';
var tag = 'player-microformat-renderer > script';
var dur = JSON.parse(document.querySelector(tag).innerHTML).duration;
var sec = parseInt(dur.match(/(\d+)s/i)[1]);
alert('Video duration is ' + new Date(sec * 1000).toISOString().substring(11, 11+8));
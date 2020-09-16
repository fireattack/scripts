var dur = JSON.parse(document.querySelector('script#scriptTag').innerHTML).duration;
var sec = parseInt(dur.match(/(\d+)s/i)[1]);
alert('Video duration is ' + new Date(sec * 1000).toISOString().substr(11, 8));
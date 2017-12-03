var req = new XMLHttpRequest();
var url = "https://yande.re/post/update_batch.json?";
req.open('GET', url + "post[][id]=377175&post[][tags]=abc&post[][old_tags]=haha");
req.onload= function(){console.log(req.responseText)};
req.send();
// ==UserScript==
// @name          Yande.re addtional functionality
// @namespace     org.fireattack.yandere
// @description   
// @match         *://yande.re/*
// @version       1.0
// ==/UserScript==

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


// TODO: 用update_batch重写
function transferTags(sourceID, targetID, reload) {    

    var req = new XMLHttpRequest();
    req.open("GET", "https://yande.re/post.json?tags=id:"+sourceID);
    req.onload = function(){
        let myJSON = JSON.parse(req.responseText);
        var tags = myJSON[0]['rating'] + ' ' + myJSON[0]['tags'];
		var toBeUpdate = [{id: targetID, tags: tags, old_tags: ""}];
		if (reload) 
			Post.update_batch(toBeUpdate, window.location.reload);
		else 
			Post.update_batch(toBeUpdate);
        
        // var request = new XMLHttpRequest();
        // request.open("POST", "https://yande.re/post/update.xml");
        // request.onload = function(){
            // if (reload) windows.location.reload();
        // }
        
        // var formData = new FormData();
        // var username = getCookie('login');
        // var pwHash = getCookie('pass_hash');  
        // formData.append("login", username);
        // formData.append("password_hash", pwHash); 
        // formData.append("id", targetID); 
        // formData.append("post[tags]", tags);     
        // request.send(formData);  
    }    
    req.send();    
}; 


if (/post\/show/i.test(window.location.href)){
	var currentID = window.location.href.match(/\d+/)[0];
	var statusNotice = document.querySelectorAll('.status-notice');
	if (statusNotice){
		for (let notice of statusNotice) {
			if (notice.textContent.includes('child post')){
				var childID = notice.querySelector('a:last-child').textContent;
				let node = document.createElement('a');
				node.href = '#';
				node.textContent = '[Transfer tags]';
				node.onclick= function(){transferTags(childID, currentID);}
				notice.appendChild(node);   
				break;
			}
		}
	}
}

function batchTransferTagsToParent() { 
    for (var id in Post.posts._object){
        var post = Post.posts._object[id];
        if (post.parent_id) {
            transferTags(id, post.parent_id);
        }
    }    
}

function batchTransferPoolshipToParent(){

    var toBeUpdate = [];	
    
    for (var id in Post.posts._object){
        var post = Post.posts._object[id];        
        if (post.parent_id && post.pool_posts && Object.size(post.pool_posts._object)===1) {
			var poolID = post[Object.keys(post)[0]];		
            toBeUpdate.push({id: id, tags: "-pool:" + poolID, old_tags: ""});
            toBeUpdate.push({id: post.parent_id, tags: "pool:" + poolID + ":" + post.pool_posts._object[poolID].sequence, old_tags: ""});
            //transfer_post2(myP, , 4668, );        
        }
    }    

    Post.update_batch(toBeUpdate);
}


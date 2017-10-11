// ==UserScript==
// @name          Yande.re additional functionality
// @namespace     org.fireattack.yandere
// @description
// @match         *://yande.re/*
// @version       1.4
// ==/UserScript==

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function reloadPage() {
	window.location.reload();
}

function transferTagsPrepare(sourceID, targetID, oldTagsToBeRemoved) {

    var deferred = jQuery.Deferred();
	jQuery
        .ajax({
            url: "/post.json",
            data: {
                tags: "id:" + sourceID,
            },
            dataType: "json",
        })
        .done(function(resp) {        
            var tags = resp[0].rating + " " + resp[0].tags;
            tags = tags.replace('duplicate', ''); // do not transfer "duplicate"
            tags = tags.replace('fixme', '');
            if (!oldTagsToBeRemoved){
                oldTagsToBeRemoved = "";
            }
            var toBeUpdated = [{id: targetID, tags: tags, old_tags: oldTagsToBeRemoved}];
            deferred.resolve(toBeUpdated);
        });
	return deferred.promise();
}

function batchTransferTagsToParent() {
	var toBeUpdated = [], promises = [];
    for (var id in Post.posts._object){
        var post = Post.posts._object[id];
        if (post.parent_id) {
			var promise = transferTagsPrepare(id, post.parent_id).done(function(data){toBeUpdated.push(data);});
            promises.push(promise);
        }
    }
    jQuery.when.apply(jQuery, promises).done(function(){
        Post.update_batch(toBeUpdated);
        });
}

if (/post\/show/i.test(window.location.href)) {
	var id = window.location.href.match(/\d+/)[0];
	var statusNotice = document.querySelectorAll('.status-notice');
	if (statusNotice){
		for (let notice of statusNotice) {
			if (notice.textContent.includes('child post')){
				var childID = notice.querySelector('a:last-child').textContent;
				let node = document.createElement('a');
				node.href = '#';
				node.textContent = '[Transfer tags]';
				node.onclick= function(){
                    transferTagsPrepare(childID, id, 'possible_duplicate').done(function(data){ //Also remove possible_duplicate
                        Post.update_batch(data, reloadPage);
                    });
                    };
				notice.appendChild(node);
				break;
			}
		}
	}
}


function batchTransferPoolshipToParent() {

    var toBeUpdated = [];

    for (var id in Post.posts._object){
        var post = Post.posts._object[id];
        if (post.parent_id && post.pool_posts && Object.keys(post.pool_posts._object).length===1) {
			var poolID = Object.keys(post.pool_posts._object)[0];
            toBeUpdated.push({id: id, tags: "-pool:" + poolID, old_tags: ""});
            toBeUpdated.push({id: post.parent_id, tags: "pool:" + poolID + ":" + post.pool_posts._object[poolID].sequence, old_tags: ""});
        }
    }
    Post.update_batch(toBeUpdated);
}


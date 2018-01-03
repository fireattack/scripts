// ==UserScript==
// @name          Yande.re additional functionality
// @namespace     org.fireattack.yandere
// @description
// @match         *://yande.re/*
// @version       3.1
// ==/UserScript==


// Yande.re has Cookie.get and Cookie.put, derived from cookie-js lib
/* function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
} */

function reloadPage() {
    window.location.reload();
}

var doNotTransfer;
var a = localStorage.getItem('doNotTransfer');
if (a) {
    doNotTransfer = a.split(' ');
}
else {
    doNotTransfer = [
        , 'duplicate'
        , 'fixed'
        , 'wallpaper'
        , 'possible_duplicate'
        , 'duplicate'
    ];
    jQuery
        .ajax({
            url: "/tag.json",
            data: {
                type: 6
            },
            dataType: "json",
        })
        .done(resp => {
            doNotTransfer.push(...resp.map(ele => ele.name));
            localStorage.setItem('doNotTransfer', doNotTransfer.join(' '));
        });
}

const oldTagsToBeRemoved = 'possible_duplicate';

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
        .done(function (resp) {
            var tags = resp[0].tags.split(" ");
            tags.push(resp[0].rating);
            tags = tags.filter(el => !doNotTransfer.includes(el));
            if (!oldTagsToBeRemoved) {
                oldTagsToBeRemoved = "";
            }
            var toBeUpdated = {
                id: targetID,
                tags: tags.join(" "),
                old_tags: oldTagsToBeRemoved
            };
            deferred.resolve(toBeUpdated);
        });
    return deferred.promise();
}

function batchTransferTags(direction, post_ids) {
    if (!post_ids) { // By default, apply to all
        post_ids = Object.keys(Post.posts._object);
    }
    var toBeUpdated = [],
        promises = [];
    post_ids.forEach(post_id => {
        var post = Post.posts.get(post_id);
        if (post.parent_id) {
            var from, to;
            if (direction == "to") {
                from = post_id;
                to = post.parent_id;
            } else {
                from = post.parent_id;
                to = post_id;
            }
            var promise = transferTagsPrepare(from, to, oldTagsToBeRemoved).done(function (data) {
                toBeUpdated.push(data);
            });
            promises.push(promise);
        }
    });
    jQuery.when.apply(jQuery, promises).done(function () {
        Post.update_batch(toBeUpdated);
    });
}

function batchTransferPoolshipToParent() {

    var toBeUpdated = [];
    for (var id in Post.posts._object) {
        var post = Post.posts._object[id];
        if (post.parent_id && post.pool_posts && Object.keys(post.pool_posts._object).length === 1) {
            var poolID = Object.keys(post.pool_posts._object)[0];
            toBeUpdated.push({
                id: id,
                tags: "-pool:" + poolID,
                old_tags: ""
            });
            toBeUpdated.push({
                id: post.parent_id,
                tags: "pool:" + poolID + ":" + post.pool_posts._object[poolID].sequence,
                old_tags: ""
            });
        }
    }
    Post.update_batch(toBeUpdated);
}

// 魔改 TagScript.run
TagScript.run = function (post_ids, tag_script, finished) {
    if (!Object.isArray(post_ids)) post_ids = $A([post_ids]);

    if (tag_script.indexOf("[fromparent]") == 0) {
        batchTransferTags('from', post_ids);
    } else if (tag_script.indexOf("[toparent]") == 0) {
        batchTransferTags('to', post_ids);
    } else {

        var commands = TagScript.parse(tag_script) || [] //预处理tagscript

        var posts = new Array; //posts = 批量处理的obj
        post_ids.each(function (post_id) { // 对于每个选中的posts
            var post = Post.posts.get(post_id)
            var old_tags = post.tags.join(" ") //获取原有tag

            commands.each(function (x) {
                post.tags = TagScript.process(post.tags, x)
            })

            posts.push({
                id: post_id,
                old_tags: old_tags, //移除所有的老的先
                tags: post.tags.join(" ") //加新的
            });
        });

        notice("Updating " + posts.length + (post_ids.length == 1 ? " post" : " posts"));
        Post.update_batch(posts, finished);
    }
};

if (/post\/show/i.test(window.location.href)) {
    var id = window.location.href.match(/\d+/)[0];
    var statusNotice = document.querySelectorAll('.status-notice');
    if (statusNotice) {
        for (let notice of statusNotice) {
            if (notice.textContent.includes('child post')) {
                var childID = notice.querySelector('a:last-child').textContent;
                let node = document.createElement('a');
                node.href = '#';
                node.textContent = '[Transfer tags]';
                node.onclick = function () {
                    transferTagsPrepare(childID, id, oldTagsToBeRemoved).done(function (data) { //Also remove possible_duplicate
                        Post.update_batch([data], reloadPage);
                    });
                };
                notice.appendChild(node);
                break;
            }
        }
    }
}

if (/pool\/show/i.test(window.location.href)) {
    let newButton = document.createElement('input');
    newButton.type = 'button';
    newButton.value = 'Transfer tags to parent';
    newButton.style.verticalAlign = 'middle';
    newButton.onclick = () => {
        batchTransferTags('to');
    };

    let newButton2 = document.createElement('input');
    newButton2.type = 'button';
    newButton2.value = 'Transfer poolship to parent';
    newButton2.style.verticalAlign = 'middle';
    newButton2.onclick = () => {
        batchTransferPoolshipToParent();
    };

    let myH4 = document.querySelector('h4');
    myH4.style.display = 'inline';
    myH4.style.verticalAlign = 'middle';
    let insertPoint = document.querySelector('#pool-show');
    let insertBefore = insertPoint.childElements()[1];
    insertPoint.insertBefore(document.createTextNode('　'), insertBefore);
    insertPoint.insertBefore(newButton, insertBefore);
    insertPoint.insertBefore(document.createTextNode('　'), insertBefore);
    insertPoint.insertBefore(newButton2, insertBefore);
}

// Pool update (edit) page modification
if (/pool\/update/i.test(window.location.href)) {

    // Make pool_name textarea longer
    var poolName = document.querySelector('#pool_name');
    poolName.style.width = '1500px';

    // Add a button to quickly change pool name from Exhentai style to Yande.re style
    let newButton = document.createElement('input');
    newButton.type = 'button';
    newButton.value = 'Fix name';
    newButton.style.verticalAlign = 'middle';
    newButton.onclick = () => {

        var myMatch = poolName.value.match(/\[(.+)\] *(.+?)( \(.+\))*$/);

        if (myMatch) {
            var desc = document.querySelector('#pool_description');
            //desc.value = poolName.value + '\n' + desc.value;
            if (!desc.value) {
                desc.value = poolName.value;
            }
            poolName.value = myMatch[1] + ' - ' + myMatch[2];
        }

        document.querySelector('#pool_is_public').checked = false;
        document.querySelector('#pool_is_active').checked = false;
    };
    let insertPoint = document.querySelector('div#content');
    let myH3 = document.querySelector('h3');
    myH3.style.display = 'inline';
    myH3.style.verticalAlign = 'middle';
    let insertBefore = insertPoint.querySelector('form');
    insertPoint.insertBefore(document.createTextNode('　'), insertBefore);
    insertPoint.insertBefore(newButton, insertBefore);
}

// Post/pool index modification
if (/post$|post\?|post\/$|pool\/show/i.test(window.location.href)) {

    // Feature: restore PNG image's direct link URL and resolution display to original, instead of its JPEG version's
    postLis = document.querySelectorAll('ul#post-list-posts > li');
    postLis.forEach(li => {
        var directlink = li.querySelector('a.directlink');
        if (/.*re\/jpeg.*/i.test(directlink)) {
            directlink.href = directlink.href.replace(/jpeg/, 'image');
            directlink.href = directlink.href.replace(/\.jpg/, '\.png');
            var id = li.id.match(/\d+/)[0];
            var width = Post.posts._object[id].width;
            var height = Post.posts._object[id].height;
            directlink.lastChild.textContent = `${width} x ${height}`;
        }
    });
}

// User page modification

if (/user\/show/i.test(window.location.href)) {
    let node1 = document.querySelector("a[href*='/post?tags=user']");
    let node2 = document.querySelector("a[href*='deleted_index']");
    let myHTML = " (<a href=" + node1.href + "+deleted:true>index show</a>)";
    node2.parentNode.innerHTML += myHTML;
}
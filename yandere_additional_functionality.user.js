// ==UserScript==
// @name          Yande.re additional functionality
// @namespace     org.fireattack.yandere
// @description
// @match         *://yande.re/*
// @version       4.4
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
} else {
    doNotTransfer = ['duplicate', 'fixed', 'wallpaper', 'possible_duplicate'];
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

const defaultOldTagsToBeRemoved = ['possible_duplicate'];

function ajaxGetPostObj(id, lookForChild = false) {
    var deferred = jQuery.Deferred();    
    let index = (lookForChild)? 1 : 0;
    jQuery
        .ajax({
            url: "/post.json",
            data: {
                tags: "parent:" + id
            },
            dataType: "json",
        })
        .done(function (resp) {
            deferred.resolve(resp[index]);
        });
    return deferred.promise();
}

function transferTagsPrepare(postObj, targetID, oldTagsToBeRemoved = defaultOldTagsToBeRemoved) {
    let tags = (Array.isArray(postObj.tags))? postObj.tags : postObj.tags.split(" ");
    tags.push(postObj.rating);
    tags = tags.filter(el => !doNotTransfer.includes(el));
    return toBeUpdated = {
        id: targetID,
        tags: tags.join(" "),
        old_tags: oldTagsToBeRemoved.join(" ")
    };
}

function batchTransferTags(method, post_ids) {
    if (!post_ids) { // By default, apply to all
        post_ids = Object.keys(Post.posts._object);
    }
    var toBeUpdatedArr = [],
        promises = [];
    post_ids.forEach(post_id => {
        var post = Post.posts.get(post_id);
        switch (method) {
            case 'toparent':
                if (post.parent_id)
                    toBeUpdatedArr.push(transferTagsPrepare(post, post.parent_id));
                break;
            case 'fromparent':
                if (post.parent_id) {
                    var promise = ajaxGetPostObj(post.parent_id).done(obj => {
                        toBeUpdatedArr.push(transferTagsPrepare(obj, post_id));
                    });
                    promises.push(promise);
                }
                break;
            case 'fromchild':
                if (post.has_children) {
                    var promise = ajaxGetPostObj(post_id, true).done(obj => {
                        toBeUpdatedArr.push(transferTagsPrepare(obj, post_id));
                    });                   
                    promises.push(promise);
                }
                break;
        }
    });
    jQuery.when.apply(jQuery, promises).done(() => {
        Post.update_batch(toBeUpdatedArr);
    });
}

function batchTransferPoolshipToParent() {

    var toBeUpdatedArr = [];
    for (var id in Post.posts._object) {
        var post = Post.posts._object[id];
        if (post.parent_id && post.pool_posts && Object.keys(post.pool_posts._object).length === 1) {
            var poolID = Object.keys(post.pool_posts._object)[0];
            toBeUpdatedArr.push({
                id: id,
                tags: "-pool:" + poolID,
                old_tags: ""
            });
            toBeUpdatedArr.push({
                id: post.parent_id,
                tags: "pool:" + poolID + ":" + post.pool_posts._object[poolID].sequence,
                old_tags: ""
            });
        }
    }
    Post.update_batch(toBeUpdatedArr);
}

// 魔改 TagScript.run
TagScript.run = function (post_ids, tag_script, finished) {
    if (!Object.isArray(post_ids)) post_ids = $A([post_ids]);

    let re = /\$(\S+)\$/;
    let match = re.exec(tag_script);

    if (match) {
        batchTransferTags(match[1], post_ids);
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
    var post_id = window.location.href.match(/\d+/)[0];
    var statusNotice = document.querySelectorAll('.status-notice');
    if (statusNotice) {
        for (let notice of statusNotice) {
            if (notice.textContent.includes('child post')) {
                var childID = notice.querySelector('a:last-child').textContent;
                let node = document.createElement('a');
                node.href = '#';
                node.textContent = '[Transfer tags]';
                node.onclick = function () {
                    ajaxGetPostObj(childID).done(obj => {              
                        Post.update_batch([transferTagsPrepare(obj, post_id)], reloadPage);
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
    let postLis = document.querySelectorAll('ul#post-list-posts > li');
    postLis.forEach(li => {
        let directLink = li.querySelector('a.directlink');
        if (/.*re\/jpeg\/.*/i.test(directLink)) { // You can directly test DOM element??
            directLink.href = directLink.href.replace(/^(.+)\/jpeg\/(.+)\.jpg$/i, '$1/image/$2.png');
            let id = li.id.match(/\d+/)[0];
            let width = Post.posts._object[id].width;
            let height = Post.posts._object[id].height;
            directLink.lastChild.textContent = `${width} x ${height}`;
        }
    });
}

if (window.location.href === 'https://yande.re/post/moderate') {
    document.querySelectorAll('#content > div:nth-child(4) > form > table > tbody > tr > td.checkbox-cell').forEach(td => {
        text = td.textContent;
        let uploader =  text.match(/Uploaded by (.+?) /)[1];
        let flagger = text.match(/Reason: .+ \((.+?)\)/)[1];
        if (uploader === flagger) {
            td.style.border = '5px solid yellow';
        }
    });  
}

// Pool index modification
if (/pool\/show/i.test(window.location.href)) {

    // Feature: add some paras for "Index View" link
    let lis = document.querySelectorAll('ul#subnavbar > li');
    // When i is >= lis.length, it returns undefined and therefore stops the loop. Tricky.. 
    //From: https://stackoverflow.com/a/6260833/3939155
    for (let i = 0, li; li = lis[i]; ++i) {
        if (li.textContent.includes('Index View')) {
            li.firstChild.href += '+limit%3A100+holds%3Aall';
            break;
        }
    }
}

// User page modification
if (/user\/show/i.test(window.location.href)) {

    // Feature: add a link to show all deleted posts of this user
    let node1 = document.querySelector("a[href*='/post?tags=user']");
    let node2 = document.querySelector("a[href*='deleted_index']");
    let myHTML = " (<a href=" + node1.href + "+deleted:true>index show</a>)";
    node2.parentNode.innerHTML += myHTML;
}
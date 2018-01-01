TagScript = {
    TagEditArea: null,

    load: function () {
        this.TagEditArea.value = Cookie.get("tag-script")
    },
    save: function () {
        Cookie.put("tag-script", this.TagEditArea.value)
    },

    init: function (element, x) {
        this.TagEditArea = element

        TagScript.load()

        this.TagEditArea.observe("change", function (e) {
            TagScript.save()
        })
        this.TagEditArea.observe("focus", function (e) {
            Post.reset_tag_script_applied()
        })

        /* This mostly keeps the tag script field in sync between windows, but it
         * doesn't work in Opera, which sends focus events before blur events. */
        Event.on(window, 'unload', function () {
            TagScript.save()
        });
        document.observe("focus", function (e) {
            TagScript.load()
        })
    },

    parse: function (script) {
        return script.match(/\[.+?\]|\S+/g)
    },

    test: function (tags, predicate) {
        var split_pred = predicate.match(/\S+/g)
        var is_true = true

        split_pred.each(function (x) {
            if (x[0] == "-") {
                if (tags.include(x.substr(1, 100))) {
                    is_true = false
                    throw $break
                }
            } else {
                if (!tags.include(x)) {
                    is_true = false
                    throw $break
                }
            }
        })

        return is_true
    },

    process: function (tags, command) {
        if (command.match(/^\[if/)) {
            var match = command.match(/\[if\s+(.+?)\s*,\s*(.+?)\]/)
            if (TagScript.test(tags, match[1])) {
                return TagScript.process(tags, match[2])
            } else {
                return tags
            }
        } else if (command == "[reset]") {
            return []
        } else if (command[0] == "-" && command.indexOf("-pool:") != 0) {
            return tags.reject(function (x) {
                return x == command.substr(1, 100)
            })
        } else {
            tags.push(command)
            return tags
        }
    },

    run: function (post_ids, tag_script, finished) {
        if (!Object.isArray(post_ids))
            post_ids = $A([post_ids]);

        var commands = TagScript.parse(tag_script) || []

        var posts = new Array;
        post_ids.each(function (post_id) {
            var post = Post.posts.get(post_id)
            var old_tags = post.tags.join(" ")

            commands.each(function (x) {
                post.tags = TagScript.process(post.tags, x)
            })

            posts.push({
                id: post_id,
                old_tags: old_tags,
                tags: post.tags.join(" ")
            });
        });

        notice("Updating " + posts.length + (post_ids.length == 1 ? " post" : " posts"));
        Post.update_batch(posts, finished);
    }
}
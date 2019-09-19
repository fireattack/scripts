/*----------------------------------------------
Date: 2015/09/05
Author: btx258
----------------------------------------------*/

var DOWNLOAD_SERVER = "http://music.baidu.com";
var SONG_SEARCH_URL = "http://music.baidu.com/search";
var LYRIC_SEARCH_URL = "http://music.baidu.com/search/lrc";
var SONG_LINK_INFO_URL = "http://play.baidu.com/data/music/songlink";
var SONG_INFO_URL = "http://play.baidu.com/data/music/songinfo";
var MAX_NUM_OF_PAGES = 2;
var NUM_OF_LYRICS_LOW_LEVEL = 5;
var MAX_MUN_OF_LYRICS = 10;
var HTTP_RETRY_TIMES = 1;

// var DEBUG_SWICTH = false;

var numoflyrics = 0;
var enumSEARCH = {
    NONE: 0,
    E1: 1,
    E2: 2
};

function get_my_name() {
    return "百度音乐";
}

function get_version() {
    return "0.1.7";
}

function get_author() {
    return "btx258";
}

function start_search(info, callback) {
    numoflyrics = 0;
    start_search_lyric(info, callback, enumSEARCH.E1);
    if (numoflyrics < NUM_OF_LYRICS_LOW_LEVEL) {
        start_search_lyric(info, callback, enumSEARCH.E2);
    }
}

function start_search_lyric(info, callback, searchcase){
    // download several pages
    for (var page = 0; page < MAX_NUM_OF_PAGES && numoflyrics < MAX_MUN_OF_LYRICS; page++) {
        var i, j, k;
        var xml_text, json_text;
        var obj = null ;
        var songlist = {};
        var songinfo = null;
        var linkinfo = null;
        var new_lyric = null ;
        var songids = "";
        // download the search result page (HTML file)
        var key = convert_separative_sign(info.Title) + "+" + convert_separative_sign(info.Artist);
        if (searchcase == enumSEARCH.E1) {
            xml_text = get_http_page(LYRIC_SEARCH_URL, "key=" + key + "&start=" + page*10);
        } else if (searchcase == enumSEARCH.E2) {
            xml_text = get_http_page(SONG_SEARCH_URL, "key=" + key + "&start=" + page*20);
        }
        if (xml_text === null) {
            // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-search-can't open");
            break;
        }
        // get the IDs of songs
        obj = null ;
        json_text = xml_text.match(/[^-]\bdata-musicicon\b(?!-)[^>\{]*\{[^>]*\}/g);
        if (json_text !== null ) {
            json_text = "[" + json_text.join(",") + "]";
            // &quot; is quotation mark (")
            json_text = json_text.replace(/(&quot;|\')/g, "\"");
            json_text = json_text.replace(/[^-]\bdata-musicicon\b(?!-)[^>\{]*/g, "");
            // if (DEBUG_SWICTH) fb.trace("DEBUG> INFO-json_text-idlist:\n" + json_text);
            try {
                obj = json_parse(json_text);
                for (i = 0; i < obj.length; i++) {
                    songids = (i === 0 ? "" : songids + ",") + obj[i].id;
                }
                // if (DEBUG_SWICTH) fb.trace("DEBUG> INFO-songids: " + songids);
            } catch (e) {
                // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-queryId-json message: " + e.message);
                obj = null ;
            }
        }
        if (obj === null ) {
            // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-queryId-no data");
            break;
        }
        songlist.queryId = obj;
        // get the infomation of songs
        for (i = 4; i < 6; i++) {
            obj = null ;
            if (i == 4) {
                // download the "songinfo" page (json file) and get the data
                json_text = get_http_page(SONG_INFO_URL, "songIds=" + songids);
            } else if (i == 5) {
                // download the "songlink" page (json file) and get the data
                json_text = get_http_page(SONG_LINK_INFO_URL, "songIds=" + songids);
            }
            if (json_text !== null ) {
                // if (DEBUG_SWICTH) fb.trace("DEBUG> INFO-json loop: " + i + ", json_text:\n" + json_text);
                try {
                    obj = json_parse(json_text);
                    obj = obj.data.songList;
                } catch (e) {
                    // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-json loop: " + i + ", message: " + e.message);
                    obj = null ;
                }
            } else {
                // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-json-content-null loop: " + i);
            }
            if (obj === null ) {
                obj = create_initialized_array(songlist.queryId.length);
            } else if (obj.length < songlist.queryId.length) {
                // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-json-legth loop: " + i + ", difference: " + (obj.length - songlist.queryId.length));
                for (j = obj.length; j < songlist.queryId.length; j++) {
                    obj.push({});
                }
            }
            if (i == 4) {
                // download the "songinfo" page (json file) and get the data
                songinfo = obj;
            } else if (i == 5) {
                // download the "songlink" page (json file) and get the data
                linkinfo = obj;
            }
        }
        // merge the data and download the lyrics
        new_lyric = fb.CreateLyric();
        for (i = 0, j = 0; i < linkinfo.length; i++) {
            // merge the data
            if (linkinfo[i].queryId == songinfo[j].queryId) {
                if (songinfo[j].songName !== undefined && songinfo[j].songName !== null && songinfo[j].songName !== "") {
                    linkinfo[i].songName = songinfo[j].songName;
                }
                if (songinfo[j].artistName !== undefined && songinfo[j].artistName !== null && songinfo[j].artistName !== "") {
                    linkinfo[i].artistName = songinfo[j].artistName;
                }
                if (songinfo[j].albumName !== undefined && songinfo[j].albumName !== null && songinfo[j].albumName !== "") {
                    linkinfo[i].albumName = songinfo[j].albumName;
                }
            }
            if (linkinfo[i].queryId == songinfo[j].queryId || songinfo[j].queryId === undefined || songinfo[j].queryId === null || songinfo[j].queryId === "") {
                k++;
            }
            // download the lyrics
            if (linkinfo[i].lrcLink !== undefined && linkinfo[i].lrcLink !== null && linkinfo[i].lrcLink !== "") {
                if (linkinfo[i].lrcLink.search(/^http/i) === 0) {
                    xml_text = get_http_page(linkinfo[i].lrcLink, null );
                } else {
                    xml_text = get_http_page(DOWNLOAD_SERVER + linkinfo[i].lrcLink, null );
                }
                if (xml_text !== null && xml_text !== "") {
                    new_lyric.Title = capitalize(linkinfo[i].songName);
                    new_lyric.Artist = capitalize(linkinfo[i].artistName);
                    new_lyric.Album = capitalize(linkinfo[i].albumName);
                    new_lyric.Source = get_my_name();
                    new_lyric.LyricText = xml_text;
                    callback.AddLyric(new_lyric);
                    // if (DEBUG_SWICTH) fb.trace("DEBUG> INFO-addLyric numoflyrics: " + numoflyrics + ", i: " + i);
                    if (++numoflyrics >= MAX_MUN_OF_LYRICS) {
                        // if (DEBUG_SWICTH) fb.trace("DEBUG> INFO-numoflyrics-max");
                        break;
                    }
                } else {
                    // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-lyric-content-null loop: " + i);
                }
            } else {
                // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-lrcLink-null loop: " + i);
            }
        }
        new_lyric.Dispose();
    }
}

function get_http_page(url, content) {
    // if (DEBUG_SWICTH) fb.trace("DEBUG> INFO-get_http_page-url: " + url + ", content: " + content);
    // retry several times at most
    for (var i = 0; i < HTTP_RETRY_TIMES; i++) {
        if (typeof xmlhttp != 'object' || xmlhttp === null) {
            try {
                // global varlue
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                // if (DEBUG_SWICTH) fb.trace("DEBUG> ERROR-xmlhttp-Microsoft.XMLHTTP message: " + e.message);
                try {
                    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
                } catch (err) {
                    // if (DEBUG_SWICTH) fb.trace("DEBUG> ERROR-xmlhttp-Msxml2.XMLHTTP.3.0 message: " + err.message);
                    xmlhttp = null;
                    continue;
                }
            }
        }
        try {
            xmlhttp.open("GET", url, false);
            if (content !== null ) {
                xmlhttp.send(content);
            } else {
                xmlhttp.send();
            }
        } catch (e) {
            // if (DEBUG_SWICTH) fb.trace("DEBUG> ERROR-xmlhttp-open/send message: " + e.message);
            continue;
        }
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var xml_text = xmlhttp.responseText;
            return xml_text;
        }
    }
    // if (DEBUG_SWICTH) fb.trace("DEBUG> FAILED-get_http_page");
    return null ;
}

function json_parse(str) {
    if (typeof JSON == 'object') {
        return JSON.parse(str);
    } else {
        try {
            // Method 1: eval
            return eval("(" + str + ")");
        } catch (e) {
            // if (DEBUG_SWICTH) fb.trace("DEBUG> ERROR-json-eval message: " + e.message);
            try {
                // Method 2: new Function
                return (new Function('return ' + str))();
            } catch (err) {
                // if (DEBUG_SWICTH) fb.trace("DEBUG> ERROR-json-Function message: " + e.message);
                throw new SyntaxError('FAILED-json_parse');
                // Method 3: json2.js
            }
        }
    }
}

function convert_separative_sign(str) {
    var s = ((str === undefined || str === null ) ? "" : str);
    // !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
    s = s.replace(/([\u0021-\u002F]|[\u003A-\u0040]|[\u005B-\u0060]|[\u007B-\u007E])+/g, " ");
    // ！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～
    s = s.replace(/([\uFF01-\uFF20]|[\uFF3B-\uFF40]|[\uFF5B-\uFF5E])+/g, " ");
    // ·×‐‑‒–—―‖‗‘’‚‛“”„‟…‧‰、。〇〈〉《》「」『』【】〔〕〖〗
    s = s.replace(/(\u00B7|\u00D7|[\u2010-\u201F]|[\u2026-\u2027]|\u2030|[\u3001-\u3002]|[\u3007-\u3011]|[\u3014-\u3017])+/g, " ");
    s = s.replace(/\s+/g, " ");
    return s;
}

function capitalize(str) {
    var s = ((str === undefined || str === null ) ? "" : str);
    s = s.toLowerCase().replace(/(\b[a-z])/g, function(c) {
        return c.toUpperCase();
    }
    );
    return s;
}

function create_initialized_array(length) {
    var arr = null ;
    arr = new Array(length);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = {};
    }
    return arr;
}

// function encodeUnicode(str) {
//     var s = "";
//     for (var i = 0; i < str.length; i++) {
//         s = s + "\\u" + ("0000" + str.charCodeAt(i).toString(16).toUpperCase()).slice(-4);
//     }
//     return s;
// }
//
// function decodeUnicode(str) {
//     return unescape(str.replace(/\\/g, "%"));
// }

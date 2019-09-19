//===================================================
//============KG Music Source For ESLyric============
//===============Anonymous 2016-04-21===============
//===================================================

var ado = new ActiveXObject("ADODB.Stream");
var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.6.0");
var debug = false;

function get_my_name()
{
    return "酷狗音乐";
}

function get_version() 
{
    return "0.0.6";
}

function get_author() 
{
    return "Anonymous";
}

function start_search(info,callback)
{
    var artist = KGStringFilter(info.Artist);
    var title = KGStringFilter(info.Title);
    var searchcode = ""
    switch(true){
        case (artist.length == 0):
            searchcode = title;
            break;
        case (artist.length > 0 && title.length > 0):
            searchcode = artist + "-" + title;
            break;
        default:
            break;
    }
    
    url = "http://mobilecdn.kugou.com/api/v3/search/song?format=jsonp&keyword=" + encodeURIComponent(searchcode) + "&page=1&pagesize=10";
    debug && fb.trace("获取duration的URL：" + url);

    try {
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
    } catch (e) {
        return;
    }
    
    var new_lyric = callback.CreateLyric();

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //parse HTML
        var rex = new RegExp('"duration":(.+?),"',"g");

        ret = rex.exec(A2U(xmlhttp.responseBody));
        if(ret == null)return;
        url = "http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&keyword=" + encodeURIComponent(artist) + "-" + encodeURIComponent(title) + "&duration=" + ret[1]*1000 +"&hash=";
        debug && fb.trace("获取accesskey、id、score、singer、song的URL：" + url);
        
        try {
            xmlhttp.open("GET",url,false);
            xmlhttp.send();
        } catch (e) {
            return;
        }
        
        //parse HTML
        var rex2 = new RegExp('"accesskey":"(.*?)","adjust".+?"id":"(.*?)","krctype".+?,"score":(.+?),"singer":"(.*?)","song":"(.*?)","uid":".+?"',"g");
        var songid = [];

        for(var i= 0;;i++){
            //fb.trace(xmlhttp.responseBody);
            ret2 = rex2.exec(xmlhttp.ResponseText);
            if(ret2 == null)break;
            switch(ret2[3]){
                case "60":
                    ret2[3] = "★★★";
                    break;
                case "50":
                    ret2[3] = "★★☆";
                    break;
                case "40":
                    ret2[3] = "★☆☆";
                    break;
                case "30":
                    ret2[3] = "☆☆☆";
                    break;
                case "20":
                    ret2[3] = "☆☆";
                    break;
                case "10":
                    ret2[3] = "☆";
                    break;
                default:
                    break;
            }

            songid[i] = {
                accesskey:ret2[1],
                id:ret2[2],
                album:ret2[3],
                artist:(ret2[4])?ret2[4]:artist,
                title:(ret2[5])?ret2[5]:title
            };
            debug && fb.trace("获取accesskey、id、score、singer、song：" + songid[i].accesskey, songid[i].id, songid[i].album, songid[i].artist, songid[i].title);
        }
        //download lyrics
        for(var i=0; i<songid.length;i++){
            url = "http://lyrics.kugou.com/download?ver=1&client=pc&id=" + songid[i].id + "&accesskey=" + songid[i].accesskey + "&fmt=krc&charset=utf8";
            debug && fb.trace("获取krc 的URL：" + url);
            try {
                xmlhttp.open("GET",url,false);
                xmlhttp.send();
            } catch (e) {
                return;
            }
            
            //parse HTML
            var rex3 = new RegExp('"content":"(.*?)","fmt"',"g");
            ret3 = rex3.exec(xmlhttp.ResponseText);
            if(ret3 == null)break;

            if(ret3[1].length){
                new_lyric.Title = songid[i].title;
                new_lyric.Artist = songid[i].artist;
                new_lyric.Album = songid[i].album;
                new_lyric.FileType = "krc";
                new_lyric.Source = get_my_name();
                new_lyric.LyricData = base64decode(ret3[1]);
                callback.AddLyric(new_lyric);
            }
        }
    }
    new_lyric.Dispose();
}

function KGStringFilter(s){
    //s = s.toLowerCase();
    s = s.replace(/\'|·|\&|–/g,"");
    //trim all spaces
    //s = s.replace(/(\s*)|(\s*$)/g,"");
    //truncate all symbols
    s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, "");
    s = s.replace(/[-/:-@[-`{-~]+/g, "");
    //s = et.Translate(s,0x0804,0x02000000);
    s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, "");
    return s;
}

function A2U(s){
    ado.Type = 1;
    ado.Open();
    ado.Write(s);
    ado.Position = 0;
    ado.Type = 2;
    ado.Charset = "gb2312";
    var ret = ado.ReadText();
    ado.Close();
    return ret;
}
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
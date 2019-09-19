/*----------------------------------------------
Date: 2014/5/29 12:29:15
Author: ohyeah
----------------------------------------------*/


var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
var xmlDoc = new ActiveXObject("MSXML.DOMDocument");

var SERVER_1 = "http://ttlrcct.qianqian.com";
var SERVER_2 = "http://ttlrccnc.qianqian.com";

var SERVER = SERVER_1;


function get_my_name() {
	return "千千静听";
}

function get_version() {
	return "0.0.1";
}

function get_author() {
	return "ohyeah";
}



function start_search(info, callback) {
	
	var artist = info.Artist;
	var title = info.Title;
	var results = [];
	try {
		xmlhttp.open("GET", generate_url(artist, title, true, 0), false);
		xmlhttp.send();
	} catch (e) {
		return;
	}
    
    var new_lyric = fb.CreateLyric();
    
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		//parse XML
		var xml_text = xmlhttp.responseText;
		xmlDoc.loadXML(xml_text);
		//fb.trace(xml_text);
		var lyrics = xmlDoc.getElementsByTagName("lrc");
		for (var i = 0; i < lyrics.length; i++) {
			results[i] = {
				id: lyrics[i].getAttribute("id"),
				artist: lyrics[i].getAttribute("artist"),
				title: lyrics[i].getAttribute("title")
			};
		}
		//download lyric
		for (var i = 0; i < results.length; i++) {
			try {
				var url = generate_url(results[i].artist, results[i].title, false, results[i].id);
				xmlhttp.open("GET", url, false);
				xmlhttp.send();
			} catch (e) {
				continue;
			}
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				//add lyrics to eslyric
				new_lyric.Title = results[i].title;
				new_lyric.Artist = results[i].artist;
				new_lyric.Source = get_my_name();
				new_lyric.LyricText = xmlhttp.responseText;
				callback.AddLyric(new_lyric);
			}
		}
	}
    
    new_lyric.Dispose();

}

function generate_url(artist, title, query, id) {
	var url = "";
	if (query) {
		title = ProcessKeyword(title);
		artist = ProcessKeyword(artist);
		var title_hexstr = GetUnicodeLEHexString(title);
		var artist_hexstr = GetUnicodeLEHexString(artist);
		url = SERVER + "/dll/lyricsvr.dll?sh?Artist=" + artist_hexstr + "&Title=" + title_hexstr + "&Flags=0";
	} else {
		var code = calc_code(artist, title, id);
		url = SERVER + "/dll/lyricsvr.dll?dl?Id=" + id + "&Code=" + code.toString(10);
	}
	return url;
}

function calc_code(artist, title, id) {
	var info = artist + title;
	var utf8hex = GetUTF8HexString(info);
	var code = [];
	var len = utf8hex.length / 2;
	for (var i = 0; i < utf8hex.length; i += 2) {
		code[i / 2] = parseInt(utf8hex.substr(i, 2), 16);
	}
	var t1 = 0,
		t2 = 0,
		t3 = 0;
	t1 = (id & 0x0000FF00) >> 8;
	if ((id & 0x00FF0000) == 0) t3 = 0x000000FF & ~t1;
	else t3 = 0x000000FF & ((id & 0x00FF0000) >> 16);
	t3 = t3 | ((0x000000FF & id) << 8);
	t3 = t3 << 8;
	t3 = t3 | (0x000000FF & t1);
	t3 = t3 << 8;
	if ((id & 0xFF000000) == 0) t3 = t3 | (0x000000FF & (~id));
	else t3 = t3 | (0x000000FF & (id >> 24));

	var j = len - 1;
	while (j >= 0) {
		var c = code[j];
		if (c >= 0x80) c = c - 0x100;
		t1 = ((c + t2) & 0xFFFFFFFF);
		t2 = ((t2 << (j % 2 + 4)) & 0xFFFFFFFF);
		t2 = ((t1 + t2) & 0xFFFFFFFF);
		j--;
	}
	j = 0;
	t1 = 0;
	while (j < len) {
		var c = code[j];
		if (c >= 128) c = c - 256;
		var t4 = ((c + t1) & 0xFFFFFFFF);
		t1 = ((t1 << (j % 2 + 3)) & 0xFFFFFFFF);
		t1 = ((t1 + t4) & 0xFFFFFFFF);
		j++;
	}
	var t5 = conv(t2 ^ t3);
	t5 = conv(t5 + (t1 | id));
	t5 = conv(em.Mul(t5, (t1 | t3)));
	t5 = conv(em.Mul(t5, (t2 ^ id)));
	if (t5 > 0x80000000) t5 = (t5 - 0x100000000) & 0xFFFFFFFF;
	return t5;
}

//===========================TTPLAYER HELPER================================
//==========================================================================

//Unicode | UTF-8
//(HEX)   | (BIN)
//--------------------+---------------------------------------------
//0000 0000-0000 007F | 0xxxxxxx
//0000 0080-0000 07FF | 110xxxxx 10xxxxxx
//0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
//0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
function GetUTF8HexString(str) {
	var ret = "";

	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		var b = 0;
		if (c < 0x0080) { // 0000 - 007F
			b = c & 0x000000ff;
		} else if (c < 0x800) { // 0080 - 07FF
			b = (0xC0 | ((c & 0x7C0) >> 6)) << 8;
			b |= (0x80 | (c & 0x3F)) << 0;
		} else if (c < 0x010000) { // 0800 - FFFF
			b = (0xE0 | ((c & 0xF000) >> 12)) << 16;
			b |= (0x80 | ((c & 0xFC0) >> 6)) << 8;
			b |= (0x80 | (c & 0x3F)) << 0;
		} else { // 0x010000 - 
			b = (0xF0 | ((c & 0x1C0000) >> 18)) << 24;
			b |= (0x80 | ((c & 0x3F000) >> 12)) << 16;
			b |= (0x80 | ((c & 0xFC0) >> 6)) << 8;
			b |= (0x80 | (c & 0x3F)) << 0;
		}
		ret += b.toString(16).toUpperCase();
	}

	return ret;
}

function GetUnicodeLEHexString(str) {
	var ret = "";
	for (var i = 0; i < str.length; i++) {
		var b = str.charCodeAt(i);
		var bs = "";
		//convert UNICODE BE to LE

		var lb = (b & 0xff00) >> 8;
		var hb = (b & 0x00ff) >> 0;
		if (hb < 0x10) bs += "0";
		bs += hb.toString(16).toUpperCase();
		if (lb < 0x10) bs += "0";
		bs += lb.toString(16).toUpperCase();

		ret += bs;
	}
	return ret;
}

function conv(i) {
	i &= 0xFFFFFFFF;
	var r = i % 0x100000000;
	if (i >= 0 && r > 0x80000000) r = r - 0x100000000;
	if (i < 0 && r < 0x80000000) r = r + 0x100000000;
	return r & 0xFFFFFFFF;
}

function ProcessKeyword(str) {
	var s = str;
	s = s.toLowerCase();
	s = s.replace(/\'|·|\$|\&|–/g, "");
	//trim all spaces
	s = s.replace(/(\s*)|(\s*$)/g, "");
	//truncate all symbols
	s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, "");
	s = s.replace(/[-/:-@[-`{-~]+/g, "");
	s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, "");
	//fb.trace(s);
	return s;
}
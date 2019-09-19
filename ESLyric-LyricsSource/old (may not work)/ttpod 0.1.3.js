// ======================================================
// Created by Jeannela <jeannela@foxmail.com>
// Updated: 2015-12-21 17:41
// Refer: www.bkjia.com/jQuery/1017034.html
// ======================================================

/** 说明：
 * ESLyric 的天天动听歌词搜索脚本，仅适用于 ESLyric！*/

var xmlHttp = new ActiveXObject("Msxml2.ServerXMLHTTP.6.0");
var debug = false; // 如果要调试的话，改为 true.

function get_my_name() {
	return "天天动听";
}

function get_version() {
	return "0.1.3";
}

function get_author() {
	return "Jeannela";
}

function start_search(info, callback) {

	var searchURL, lyricURL;
	var title = info.Title;
	var artist = info.Artist;

	// Process keywords
	title = process_keywords(title);
	artist = process_keywords(artist);
	searchURL = "http://so.ard.iyyin.com/s/song_with_out?q=" + encodeURIComponent(title) + "+" + encodeURIComponent(artist);
	debug && console(searchURL);

	try {
		xmlHttp.open("GET", searchURL, false);
		xmlHttp.send();
	} catch(e) {
		console("Search failed");
		return;
	}

	var newLyric = fb.CreateLyric();

	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

		var results = json(xmlHttp.responseText);
		var data = results.data;

		var tracks = [];

		debug && console("data.length > " + data.length);
		// Download lyric
		for (var j = 0; j < data.length; j++) {
			try {
				xmlHttp.open("GET", generate_url(data[j].singer_name, data[j].song_name, data[j].song_id), false);
				xmlHttp.send();
			} catch(e) { continue; }

			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				try {
					var lrc_ = json(xmlHttp.responseText).data.lrc;
					if (lrc_ && lrc_ != "") { 
						tracks.push({
							lyric: lrc_,
							title: data[j].song_name,
							artist: data[j].singer_name
						});

						debug && console(lrc_);
					};
				} catch(e) {
					continue;
				}
			}
		}

		if (tracks.length > 0) {
			// 排除相同的歌词（完全相同的）
			for (var i = 0; i < tracks.length; i++) {
				for (var j = i+1; j < tracks.length; j++) {
					if (tracks[i].lyric === tracks[j].lyric) {
						tracks.splice(j, 1);
						j--;
					}
				}
			}

			// 排除无效歌词
			for (var i = 0; i < tracks.length; i++) {
				if (tracks[i].lyric.indexOf("无歌词") > -1) {
					tracks.splice(i, 1);
				}
			};

			for (var i = 0; i < tracks.length; i++) {
				newLyric.LyricText = tracks[i].lyric;
				newLyric.Title = tracks[i].title;
				newLyric.Artist = tracks[i].artist;
				newLyric.Source = get_my_name();
				callback.AddLyric(newLyric);
			}
		}

	}
	newLyric.Dispose();
}

function generate_url(artist, title, song_id) {
	return "http://lp.music.ttpod.com/lrc/down?lrcid=&artist=" + encodeURIComponent(artist) + "&title=" + encodeURIComponent(title) + "&song_id=" + song_id;
}

function process_keywords(str) {
	var s = str;
	s = s.toLowerCase();
	s = s.replace(/\'|·|\$|\&|–/g, "");
	//truncate all symbols
	s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, "");
	s = s.replace(/[-/:-@[-`{-~]+/g, "");
	s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, "");
	return s;
}

function json(text) 
{
	try{
		var data=JSON.parse(text);
		return data;
	}catch(e){
		return false;
	}
}

function console(s) {
	fb.trace("TTpod: " + s);
};


//json2.js
if(typeof JSON!=='object'){JSON={};}
(function(){'use strict';function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

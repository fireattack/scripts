//===================================================
//=========Xiami Music Source For ESLyric============
//===============ohyeah 2014-07-20===================
//===================================================

var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
var xmlDoc = new ActiveXObject("MSXML.DOMDocument");

function get_my_name()
{
    return "虾米音乐";
}

function get_version() 
{
    return "0.0.1";
}

function get_author() 
{
    return "ohyeah";
}

function start_search(info,callback)
{
	var url;
	var title = info.Title;
	var artist = info.Artist;

	//process keywords
	title = process_keywords(title);
	artist = process_keywords(artist);

	url = "http://www.xiami.com/search/song?key=" + title + "+" + artist;
	try {
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
	} catch (e) {
		return;
	}
    
    var new_lyric = fb.CreateLyric();

	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		//parse HTML
		var rex = new RegExp("<a.*?href=\".*?/song/(\\d+).*?><b.*?key_red","g");

		var songid = [];

		for(var i= 0;;i++){
			ret = rex.exec(xmlhttp.responseText);
			if(ret == null)break;
			songid[i] = ret[1];
		}

		for(var i=0; i<songid.length;i++){
			
			url = "http://www.xiami.com/song/playlist/id/" + songid[i];
			try {
					xmlhttp.open("GET",url,false);
					xmlhttp.send();
			} catch (e) {
					continue;
			}

			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				//parse XML
				var xml_text = xmlhttp.responseText;
				xmlDoc.loadXML(xml_text);
				//fb.trace(xml_text);
				var track_list = xmlDoc.getElementsByTagName("trackList");
				
				var results = [];

				var count = 0;
				
				for (var j = 0; j < track_list.length; j++) {

					var track = track_list[j].getElementsByTagName("track");

					for(var k=0;k<track.length;k++){
						results[count++] = {
							title: track[k].getElementsByTagName("title")[0].childNodes[0].nodeValue,
							artist: track[k].getElementsByTagName("artist")[0].childNodes[0].nodeValue,
							album: track[k].getElementsByTagName("album_name")[0].childNodes[0].nodeValue,
							lyric_url: track[k].getElementsByTagName("lyric")[0].childNodes[0].nodeValue
						};
					}
					
				}

				//download lyrics
				for(var l=0;l<results.length;l++){
					if(!results[l].lyric_url)continue;
					try {
						xmlhttp.open("GET",results[l].lyric_url,false);
						xmlhttp.send();
					} catch (e) {
						continue;
					}
					//add it to eslyric.
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						new_lyric.Title = results[l].title;
						if(results[l].artist)new_lyric.Artist = results[l].artist;
						if(results[l].album)new_lyric.Album = results[l].album;
						new_lyric.Source = get_my_name();
						new_lyric.LyricText = xmlhttp.responseText;
						callback.AddLyric(new_lyric);
					}
				}
			}
		}
	}

    new_lyric.Dispose();
}

function process_keywords(str)
{
	var s = str;
	s = s.toLowerCase();
	s = s.replace(/\'|·|\$|\&|–/g, "");
	//truncate all symbols
	s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, "");
	s = s.replace(/[-/:-@[-`{-~]+/g, "");
	s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, "");
	return s;
}

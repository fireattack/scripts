//Callback functions

//called when eslyric needs script's name. used in lyric source scripts or lyric parser scripts.
function get_my_name();

//called when eslyric needs script's version. used in lyric source scripts or lyric parser scripts.
function get_version();

//called when eslyric needs script's author. used in lyric source scripts or lyric parser scripts.
function get_author();

//called when searching lyrics. used in lyric source scripts
//params:
//info - ITrackInfo object. 
//callback - IESLyricCallback object
function start_search(info,callback);

//called when searching lyrics(if search filter enabled). used in lyric filter script.
//params:
//tf - ITitleFormat object. 
//notes: return true to prevent current item/track to search lyrics.
function is_item_filtered(tf);

//called when searching lyrics(if custom search parameter enabled). used in lyric search parameter script.
//params:
//tf - ITitleFormat object. 
//notes : return string that used in the following searching progress.
function get_title(tf);
function get_artist(tf);



// Global objects:
//   fb - IFbUtils
//   utils - IESUtils

//Interfaces

interface ITrackInfo{
Properties:
	(readonly) String Title;//title of a track
	(readonly) String Artist;
	(readonly) String Album;
	(readonly) String RawPath;//track's rawpath (e.g "file://c:\\____.mp3")
	(readonly) UINT SubSong;
	(readonly) double Length;
};


interface ILyricInfo {
Properties:
	// title of lyric, notes that the title and artist field MUST be provided, or may be fitlered by eslyric
	(r,w) String Title;
	(r,w) String Artist;
	(r,w) String Album;//opt
	//plaintext lyric
	(r,w) String LyricText;
	//binary lyric, eslyric will get 'LyricText' first, if empty, then get 'LyricData'
	(r,w) String LyricData;
	//file type of lyric, default : "lrc"
	(r,w) String FileType;
	//location of lyric
	(r,w) String Location;
	//source of lyric, usually just the script's name
	(r,w) String Source;
Methods:
	void Dispose();//destroy this object
};


interface IESLyricCallback {
Methods:
	//create a new ILyricInfo object
    ILyricInfo CreateLyric();
	//add new lyric to eslyric
	void AddLyric(ILyricInfo lyric);
};

interface IHttpClient {
Properties:
	//status code of a http request
	(readonly)int StatusCode;
	//raw headers of a http request
	(readonly)String RawHeaders;
	//useragent used in http request, set before doing request.
	(r,w)String UserAgent;
Methods:
	//add a http header - "name: value"
	//e.g : client.AddHttpHeader("header1", "val1") 
	//   or client.AddHttpHeader("header1:val1\r\nheader2:val2")
	void AddHttpHeader(name, val);
	//add post data
	// e.g : client.AddPostData("param1", "val1")
	//    or client.AddPostData("param1=val1&param2=val2")
	void AddPostData(name, val);
	//add cookie
	//e.g : client.AddCookie("name1", "val1")
	//   or client.AddCookie("name1=val1;name2=val2");
	void AddCookie(name, val);
	//do http request
	String Request(url, verb = "GET");
	//reset headers/post data/cookies
	void Reset();
};


interface IESUtils {
Methods:
	IHttpClient CreateHttpClient();
	String ReadTextFile(filename, codepage = 0);
	String LCMapString(src,lcid,flag);
	String ZCompress(data);
	String ZUnCompress(data);
	String ANSIToUnicode(data);
	String ANSIToUTF8(data);
	String UTF8ToUnicode(data);
	String UTF8ToANSI(data);
	String UnicodeToUTF8(data);
	String UnicodeToANSI(data);
};


interface IFbUtils {
Properties:
	(readonly) String ComponentPath;
	(readonly) String FoobarPath;
	(readonly) String ProfilePath;
Methods:
	void trace(...);
	IFbProfiler CreateProfiler(name="");
};

interface IFbProfiler {
Properties:
    (readonly) int Time;//ms
    
Methods:
    void Reset();
    void Print();
}

interface ITitleFormat {
Methods：
    String Eval(expr);
}

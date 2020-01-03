plain = `[ti:デビきゅー (《入间同学入魔了》TV动画片尾曲)]
[ar:芹澤優 (せりざわ ゆう)]
[al:デビきゅー]
[by:]
[offset:0]
[kana:1111111111111せり11ゆう1し1きょく1へん1きょく2きょう1き1かみ1がた1ほ1じゅん1び1ばん1たん1い1かん2きょう1わたし1てん1し1あく1ま1きゅう1きゅう1きゅう1こころ1きゅう1きゅう1あく1ま1たましい1う]
[00:00.00]デビきゅー (《入间同学入魔了》TV动画片尾曲) - 芹澤優 (せりざわ ゆう)
[00:02.34]词：os.nishi
[00:02.60]曲：ak.homma
[00:03.01]编曲：MEG.ME
[00:03.47]デビきゅー デビきゅー
[00:04.77]デビきゅー デビきゅーと
[00:12.82]よし 今日こそ決めるわ
[00:15.49]髪型チェック スカートはたいて
[00:18.74]きみに褒められる 準備は万端
[00:23.44]そでをつかんだらキュンとする？
[00:26.09]つまさきふれたら
[00:27.44]ドキッとするかしら？
[00:29.35]かわいいって言わせちゃう
[00:32.32]プランは完ペキ
[00:35.47]今日の私はムテキなの
[00:38.12]もはや天使？
[00:39.08]いや悪魔級にキュート
[00:41.86]まいっちゃうでしょ
[00:46.15]デビデビデビ級 デビcute
[00:48.75]くらくらさせるわ きみのこと
[00:51.41]デビデビデビ級 デビcute
[00:54.12]めらめらもえる この心
[00:56.76]デビデビデビ級 デビcute
[00:59.37]きみをふりむかせるためなら
[01:04.17]デビ級 デビcute
[01:07.40]悪魔にだって魂売るわ
[01:11.55]デビきゅー デビきゅー
[01:12.83]デビきゅー デビきゅーと `
translation = `[ti:デビきゅー (《入间同学入魔了》TV动画片尾曲)]
[ar:芹澤優 (せりざわ ゆう)]
[al:デビきゅー]
[by:]
[offset:0]
[kana:1111111111111せり11ゆう1し1きょく1へん1きょく2きょう1き1かみ1がた1ほ1じゅん1び1ばん1たん1い1かん2きょう1わたし1てん1し1あく1ま1きゅう1きゅう1きゅう1こころ1きゅう1きゅう1あく1ま1たましい1う]
[00:00.00]//
[00:02.34]//
[00:02.60]//
[00:03.01]//
[00:03.47]恶魔级 恶魔级
[00:04.77]恶魔级可爱
[00:12.82]好! 今天要决一胜负
[00:15.49]检查发型 拍拍裙子
[00:18.74]做好被你夸奖的准备
[00:23.44]抓住衣袖会让你心跳吗
[00:26.09]触碰指尖
[00:27.44]会让你紧张吗
[00:29.35]让你夸奖我可爱
[00:32.32]计划完美
[00:35.47]今天的我可爱无敌
[00:38.12]已经是天使？
[00:39.08]不! 恶魔级的可爱
[00:41.86]对我神魂颠倒了吧
[00:46.15]恶魔恶魔恶魔级 恶魔级可爱
[00:48.75]把你迷得晕头转向
[00:51.41]恶魔恶魔恶魔级 恶魔级可爱
[00:54.12]这颗熊熊燃烧的心
[00:56.76]恶魔恶魔恶魔级 恶魔级可爱
[00:59.37]为了你的回眸不择手段
[01:04.17]恶魔级 恶魔级可爱
[01:07.40]愿意把灵魂出卖给恶魔
[01:11.55]恶魔级 恶魔级
[01:12.83]恶魔级 恶魔级可爱 `

function qm_generate_translation(plain, translation) {    
    var arr_plain = plain.split("\n");
    var arr_translation = translation.split("\n");
    var translated_lyrics = "";
    for (var i = translation.indexOf("kana") == -1 ? 5 : 6; i < arr_plain.length; i++) {
        translated_lyrics += arr_plain[i] + "\n";
        var timestamp = "";
        if (i < arr_plain.length - 1) {
            timestamp = format_time(to_millisecond(arr_plain[i + 1].substr(1, 8)) - 10);
        }
        else {
            timestamp = format_time(to_millisecond(arr_plain[i].substr(1, 8)) + 5000);
        }
        if (arr_translation[i] == "腾讯享有本翻译作品的著作权" || arr_translation[i].indexOf("//") != -1) {
            translated_lyrics += timestamp + arr_translation[i].substring(10).replace("//", "　　") + "\n";
        } else {
            translated_lyrics += timestamp + arr_translation[i].substring(10) + "\n";
        }
    }
    return translated_lyrics;
}

function to_millisecond(timeString) {
    return parseInt(timeString.slice(0, 2), 10) * 60000 + parseInt(timeString.substr(3, 2), 10) * 1000 + parseInt(timeString.substr(6, 2), 10) * 10;
}

function zpad(n) {
    var s = n.toString();
    return (s.length < 2) ? "0" + s : s;
}

function format_time(time) {
    var t = Math.abs(time / 1000);
    var h = Math.floor(t / 3600);
    t -= h * 3600;
    var m = Math.floor(t / 60);
    t -= m * 60;
    var s = Math.floor(t);
    var ms = Math.round((t - s) * 100);
    if (ms == 100) {
        ms = 0;
        s = s + 1;
    }
    var str = (h ? zpad(h) + ":" : "") + zpad(m) + ":" + zpad(s) + "." + zpad(ms);
    str = "[" + str + "]";
    return str;
}

console.log(qm_generate_translation(plain, translation))
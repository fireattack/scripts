var i = document.createElement('iframe');
i.style.display = 'none';
document.body.appendChild(i);
window.console = i.contentWindow.console;

a = $$('div.MomentCapsuleItem div.MomentCapsuleItemTweet-byline small.time a');
arr = [];
a.forEach(element => {
    arr.push(element.href);
});

console.log(arr.length);

var findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    return results;
}

var remove = (element) => {
    console.log(`Removing ${element}...`);
    let tweet_id = element.split('/').pop();
    fetch("https://twitter.com/i/moments/edit/1184206735764008960/remove", {
            "credentials": "include",
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en-US,en;q=0.9,ja;q=0.8",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "x-twitter-active-user": "yes"
            },
            "referrer": "https://twitter.com/i/moments/edit/1184206735764008960",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": `authenticity_token=c89a82a2ca821277cf500704c9fd4b6edc229d91&moment_id=1184206735764008960&tweet_id=${tweet_id}`,
            "method": "POST",
            "mode": "cors"
        }).then((response) => {
            if (response.status != 200) console.log(`${tweet_id}: Error!`)
            else console.log(`${tweet_id}: Removed!`);
        });
}

arr = findDuplicates(arr);
arr.forEach(remove);

console.log('Check unwanted tweets..');
arr2 = [
    'https://twitter.com/__FerrisWheel/status/1191188337802928128',
    'https://twitter.com/matryo_apple/status/1187745863612928002',
    
    'https://twitter.com/Mnoo_1021/status/1184525688067575808',
    "https://twitter.com/healstar/status/1194127205141401600",
    "https://twitter.com/tktiau/status/1193492736671805440",
    "https://twitter.com/__FerrisWheel/status/1193455206454853632",
    "https://twitter.com/S_F_1203/status/1191697436604944385",
    "https://twitter.com/crosophie/status/1191272331634544640",
    "https://twitter.com/pachi_k/status/1186127262573219841",
    "https://twitter.com/__FerrisWheel/status/1185161664477327362",
    "https://twitter.com/yuzudes2/status/1187368817221160960",
    "https://twitter.com/nejimeinu/status/1188829279104012288",
    "https://twitter.com/kawask31/status/1190609875618762753",
    "https://twitter.com/healstar/status/1189444462004465665",
    "https://twitter.com/hirano_mkmk/status/1190252960938221569",
    'https://twitter.com/iris__0220/status/1190224250184986624',
    'https://twitter.com/vivid_pokotan/status/1189834796282703872',
    'https://twitter.com/mori_twin/status/1189398072268181505',
    'https://twitter.com/himengamgmg1129/status/1187208496598511616',
    'https://twitter.com/pachi_k/status/1190470639108292608',
    'https://twitter.com/__FerrisWheel/status/1193135286689026048',
    'https://twitter.com/himengamgmg1129/status/1186343498951192579',
    'https://twitter.com/hagi_marche/status/1189070442809774080'

]

arr2.forEach(remove);
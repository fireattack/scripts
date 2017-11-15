function odds(str, nthAfterLastProc) {
    let a = 0, b = 0, j = 0;
    do {
        j = str.indexOf(proc+normal.repeat(nthAfterLastProc-1), j)
        if (j!=-1) {
            if (str[j+nthAfterLastProc] == proc) a++;
            else b++;
            j=j+nthAfterLastProc;
        }
        else break;
    }
    while (j + nthAfterLastProc < str.length);
    return [a, b];
}

// m = miss, z = hit
var butterfly = 'mmzzzmzzmmzzzmzzzzmzmzmzmzzzmzzzmmzmzzzzmzmmzzzmzmmzzzmzzzzmzzzzmmzmmzzzzmzzzmmzmmzzzzzmzzzzmmzzmmzmzmzzmzmzzmzmzzzzmzzzmzzzmmzzmzmzzzzmzmzzmzzzmmzmzzzzmmzmzzzzmmzzzzmzmzmzzzmzzzzmmzzzzmmzmzzzzmzmmzzmzzzzmzmzmzzzzmzzmzmzzzmmzzzzmmmzzzmzzzzzmzmzzzzmmmmzzzzmmzzzzzmmmzzzmz' + 'zmzzzzzzmzzzmmzmzmmzzzzmzmzzmmzzzzzmzzzmmmzzzmmzzzmmzzzzzmzzmzzzmmzzzmmzzzzmzmzmmzzmzzmzzzzmzmzzzmmzzzmzzzzzmmmzzmzmzmzzzmzzmzmzzzzzzmzmzmmzzzzmzmzmzmzzmzzzmzmzmzzmzzzzzmzmmzzmzzmzmzzzzmzmzzmmzzmzmzzzzzzmzmmzzmzmzzmzzzmzzzzzmzmmzzmzzzzmzmzzzmzmzmzzmzzmmzzzmzzmzz' + 'zzzzzmzmzmzzmzmzzzmzzmzmzzzmzzmzmzzmzmzzzmmzzzmzzzzmzzmzmmmzzzzzmzmmmzzzzzzmzzzmmmzzzzzmzzzmmmmzzzzzzzmmmzmzzzzzmzmzzmzmzzzzzmmzmmzzzzmzzmzmzmzzzmzzmmzzzzmzmmzzzmmzzzmzzzzzmmmzzzmzmzzzmzzmzzzzmzzmzmmzzmzzmzzzmzzzmzzmzzmzmmzmzzzzmzmzzzzmmzmzzmzzmzzmzzmzzmzzzmzzzmzzzmzzmmzmzmmzzzmzzmzmzzzzmzmzmzzzzmmzzmzmzzzzmmzz';

// m = crit, z = normal
var jugglvl1 =  'zzzmzzmzzzzzmzzzzzzzzzzzzmzmzmzzzzmmzzzzzzzzzzmzmzzzmzzzzzzzzmmzzzmzzzzzzzzmzzmzzzzzzzmzzzmzzzzmzmzzzzzzzmzzzmzzzzzzzmzzzzmmzzzzmzzmzzzzzzzzzmzzzzmzzzmzmzzzzzzzmzzzzzmzzzzmzmzzzzmzzzzmzzmzzzzzmzzzzzzzmzzzzzmzzzzmmzzzzmzzzzzmzmzzzzzzz'+'zmzzzzzmzzzzzzzmzzmzzzzzzmmzzzzzzmzzzzzzmzzmzzzzzmzzzmzmzzzmzzzzzzzzzzzmzzzzmmzzzmzzzzzzmzzzmzzzzzmzmzzzzmzzzzzzzzmzzzmzzzmzzzzzzzzzmmzmzzzmzzzzzzzzmzzzzzzmmzmzzzzzzzzzzzzzmzmzzzmzzzmzzmzzzzzzzzzmzmzzzmmzzzzmzzzzzzmzzzzzzmzzzzmzzzmzzmzzzzmzzzzzmzzzmzzzzzzzzmzmzzzzmzzzzzzzzzzzmmzzzzmzmzzzmzzzzzzmzzmzzzzm';

var proc = 'm';
var normal = 'z';
var str = butterfly; //pick the one you want to test: butterfly or jugglvl1

var [a, b] = odds(str, 1);
console.log(`Proc chance for first hit after last proc: ${a/(a+b)}`);
var [a, b] = odds(str, 2);
console.log(`Proc chance for second hit after last proc: ${a/(a+b)}`);    

for (var i = 0, len = str.length; i < len; i++) {
  if (str[i] == proc) a++;
  else b++;  
}
console.log(`Overall odds: ${a/(a+b)}`);
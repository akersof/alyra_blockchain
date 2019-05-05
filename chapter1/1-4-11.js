const crypto = require('crypto');
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getRandomString = n => {
    let rndStr = [];
    let rndBytes = crypto.randomBytes(n);
    for(let i = 0; i < n; ++i)
        rndStr.push(ALPHABET[rndBytes[i] % 26]);
    return rndStr.join('');
};

const startWith = (str, n) => {
    let res = getRandomString(n);
    while(!res.startsWith(str)) {
        res = getRandomString(n);
    }
    return res;
};

let start = process.hrtime();
let res = startWith('Z', 10);
let end = process.hrtime(start);
console.log(`${res} found -> Execution time: ${end[0]}s ${end[1] / 1000000}ms}`);

start = process.hrtime();
res = startWith('ZZ', 10);
end = process.hrtime(start);
console.log(`${res} found -> Execution time: ${end[0]}s ${end[1] / 1000000}ms}`);

start = process.hrtime();
res = startWith('ZZZZ', 10);
end = process.hrtime(start);
console.log(`${res} found -> Execution time: ${end[0]}s ${end[1] / 1000000}ms}`);

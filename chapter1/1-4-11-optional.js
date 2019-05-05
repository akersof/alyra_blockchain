const crypto = require('crypto');
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getRandomSHA256 = () => {
    let rndBytes = crypto.randomBytes(32);
    return crypto.createHash('sha256').update(rndBytes).digest('hex').toUpperCase();
};

const startWith = str => {
    let sha = getRandomSHA256();
    while(!sha.startsWith(str)) {
        sha = getRandomSHA256();
    }
    return sha;
};

let start = process.hrtime();
let res = startWith('A');
let end = process.hrtime(start);
console.log(`${res} found -> Execution time: ${end[0]}s ${end[1] / 1000000}ms}`);

start = process.hrtime();
res = startWith('AA');
end = process.hrtime(start);
console.log(`${res} found -> Execution time: ${end[0]}s ${end[1] / 1000000}ms}`);

start = process.hrtime();
res = startWith('AAAA');
end = process.hrtime(start);
console.log(`${res} found -> Execution time: ${end[0]}s ${end[1] / 1000000}ms}`);
//return a human readable date from epoch time
const strDate = (seconds) => {
    return new Date(seconds * 1000).toGMTString();
};

//Convert little endian hex string to big endian hex string
const le2be = str => {
    let beStr = "";
    for(let i = 0; i < str.length; i += 2)
        beStr = str[i] + str[i + 1] + beStr;
    return beStr;
};

//Take a bits field as str of length 8 (4 bytes) and return the target
const bits2Target = (str) => {
    if (str.length !== 8)
        throw new Error('Bits field must have 8 digits');
    let expStr = str.slice(0, 2);
    let coefStr = str.slice(2);
    let zeroSuffix = new Array(parseInt(expStr, 16) * 2 - 6).fill(0).join('');
    let zeroPrefix = new Array(64 - zeroSuffix.length - 6).fill(0).join("");
    return zeroPrefix + coefStr + zeroSuffix;
};

const difficulty = (target) => {
    return parseInt('0x00000000ffff0000000000000000000000000000000000000000000000000000', 16) / parseInt(target, 16);
};

const varInt2Decimal = (str) => {
    let prefix = str.slice(0, 2).toUpperCase();
    switch(prefix) {
        case 'FD':
            return parseInt(le2be(str.slice(2, 6).toString('hex')), 16);
        case 'FE':
            return parseInt(le2be(str.slice(2, 10).toString('hex')), 16);
        case 'FF':
            return parseInt(le2be(str.slice(2, 18).toString('hex')), 16);
        default:
            return parseInt(prefix, 16);
    }
};

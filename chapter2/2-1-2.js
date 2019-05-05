const MAX_TARGET = 0x00000000FFFF0000000000000000000000000000000000000000000000000000;

const calculerDifficulte = (bits) => {
    if(bits.toUpperCase().startsWith('0X'))
        bits = bits.slice(2);
    let coef = parseInt(bits.slice(2), 16);
    let exp = parseInt(bits.slice(0, 2), 16);
    let target = coef * Math.pow(2, (8 * (exp - 3)));
    return MAX_TARGET / target;
} ;
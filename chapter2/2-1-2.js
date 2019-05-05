const MAX_TARGET = 0x00000000FFFF0000000000000000000000000000000000000000000000000000n;

const difficulty = bits => {
    let coef = BigInt("0x" + bits.slice(2));
    let exp = BigInt("0x" + bits.slice(0, 2));
    let target = coef * 2n ** (8n * (exp-3n));
    return MAX_TARGET / target;
};

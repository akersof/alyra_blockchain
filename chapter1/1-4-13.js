const proofOfWork = (exp, coef, hash) => {
    //Convert everything to BigInt
    exp = BigInt(exp);
    coef = BigInt(coef);
    hash = hash.toUpperCase();
    let prefix = "";
    if(!hash.startsWith("0X")) prefix = "0x";
    let hashValue = BigInt(prefix + hash);
    let target = coef * 2n ** (8n * (exp-3n));
    return target < hashValue;
};
/*
    A naive implementation of RSA encryption and decryption
    algo:
        1) choose 2 prime numbers p and q
        2) calculate n = p * q
        3) calculate totient = (p-1)(q - 1)
        4) choose a prime e with 0 < e < totient with e is co-prime to totient (use gcd) -> e is PUBLIC KEY
        5) calculate d with e * d = 1 (mod totient) <=> ed+k(p - 1)(q - 1) = 1 <=> d = (1 + k * totient) / e)
        cypher with M^e (mod n)
        decypher with C^d (mod n)
 */

//the max range from 2 - MAX_PRIME for choosing a prime number;
const MAX_PRIME = 100;

//FUCK YOU JAVASCRIPT LEARN FUCKING MATHS, WORST LANGUAGE EVER
//const mod = (n, m) => {
//    return ((n % m) + m) % m;
//};

// a list of prime number between 2 and n
const primeList = n => {
    //n is not number or is negative? go away!
    if(Number.isNaN(n) || n < 0) return;
    //a list of number from 2 to n
    const nbList = Array.from({length: n}, (v, k) => k + 1).slice(1);
    //we recursively drop non prime numbers from nbList
    const go = (acc, currIndex) => {
        if(currIndex > acc.length - 1) return acc;
        else {
            const rest = acc.filter(elem => elem === acc[currIndex] || elem % acc[currIndex] !== 0);
            return go(rest, ++currIndex);
        }
    };
    return go(nbList, 0);
};

//Given two integers (b, n), returns (gcd(b, n), a, m) such that
//     a*b + n*m = gcd(b, n).
const egcd = (b, n) => {
    let [x0, x1, y0, y1] = [1, 0, 0, 1];
    while(n !== 0) {
        [q, b, n] = [Math.floor(b / n), n, b % n]; //q global? TODO: check javascript implicit scope of variable
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }

    return [b, x0, y0];
};

const generateKeys = () => {
    let e = 3; //PuBLIC KEY@
    let primeLst = primeList(MAX_PRIME);
    let p = primeLst[Math.floor(Math.random() * primeLst.length)];
    while(p === e) p = primeLst[Math.floor(Math.random() * primeLst.length)];
    let q = primeLst[Math.floor(Math.random() * primeLst.length) ];
    while(p === q || p === e) q = primeLst[Math.floor(Math.random() * primeLst.length) ];
    console.log("DEBUG:", "p =", p, "q=", q);
    let n = p * q;
    console.log("DEBUG: modulus of the public and private key", "n=", n);
    let totient = (p - 1) * (q - 1);
    console.log("DEBUG:", "totient=", totient);
    //let e = 17; //common help in math..#TODO: understand why.. helpfull for the maths?? a bit a randomness maybe?
    console.log("DEBUG: public key", "e=", e);
    let d = egcd(e, totient)[1];
    d = d % totient;
    if(d < 0) d += totient;
    console.log("DEBUG: private key", "d=", d);
    let MSG = 2;
    console.log("Message: ", MSG);
    let enc = Math.pow(MSG, e) % n;
    console.log("Encrypted: ", enc);
    console.log("Decrypted: ", Math.pow(enc, d) % n);
};

console.log(generateKeys());
console.log("When a good key is generated, NaN is printed")
console.log("Javascript is too bad for working with big num, manually checking on haskell interpreter show me the good result");



//take a character apply caesar cipher
const rotate = (char, n) => {
    if(n < 0) return rotate(char, n + 26);
    let s = char;
    let charCode = char.charCodeAt(0);
    if(charCode >= 65 && charCode <= 90)
        s = String.fromCharCode((charCode - 65 + n) % 26 + 65);
    else if(charCode >= 97 && charCode <= 122)
        s = String.fromCharCode((charCode - 97 + n) % 26 + 97);
    return s;
};

//Put all char in upper case, remove everything that is not a character
const sanitize = str => {
     return  str.toUpperCase()
                .split("")
                .filter(elem => (elem.charCodeAt(0) >= 65 && elem.charCodeAt(0) <= 90))
                .join("");
};

//Return the index in alphabet for a Char
// A -> 0, B -> 1, Z -> 25
const indexAlphabet = char => {
    return char.toUpperCase().charCodeAt(0) - 65;
};

//Split a string str chunk of size n and return the array
const chunkString = (str, size) => {
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
};

//Resolution of Training C is equivalent to chunkString(sanitize(str), n);

//Encrypt using Vigenere cypher
const encVigenere = (str, key) => {
    let encStr = "";
    let chunkArray = chunkString(sanitize(str), key.length);
    chunkArray.forEach((elem) => {
        elem.split('').forEach((char, i) => {
            encStr = encStr + rotate(char, indexAlphabet(key[i]));
        });
    });
    return encStr;
};


//Decrypt an encrypted string with vigenere cypher
const decVigenere = (str, key) => {
    let decStr = "";
    let chunkArray = chunkString(str, key.length);
    chunkArray.forEach((elem) => {
        elem.split('').forEach((char, i) => {
            decStr = decStr + rotate(char, -1 * indexAlphabet(key[i]));
        });
    });
    return decStr;
};

//Test Encryption into Decryption:
let msg = "coucou Toi,123123 alors1? comment ca va?";
let key = "DODU";
let enc = encVigenere(msg, key);
let dec = decVigenere(enc, key);
console.log("message: ", msg);
console.log('encrypted: ', enc);
console.log('decrypted: ', dec);
// #TODO: Use a french dictionary to automatize the check of the cleared text obtain in training D.

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

//training C: Useful function for breaking Vigenere cypher.
const regroup = (str, n) => {
    let grp = new Array(n).fill("");
    let tmp = sanitize(str);
    for(let i = 0; i < tmp.length; ++i){
        grp[i % n] = grp[i % n] + tmp[i];
    }
    return grp;
};

//Training D: decypher message:
let secret =
    "PVADGHFLSHPJNPLUVAGXVVRBRUKCGXEVQINPVBXLVZLRMKFLSXEZQXOGCCHXEICIXUKSCXKEDDKORRXHPHSXGGJRRHPESTJWVBTJWVJFNGJSCLQ" +
    "LBJGUVSATNRJXFKKCBTKJOJXEVJJBQLATNZHSXECUCIBGELTGVGCJOGERPMQLRBHOVLIKGMCAXTCCHXEICIXUKYRVGJQXUNVYIHWJATLVSGTGRFSGJ" +
    "WFGXEARSCITFZAXOVBJLGTPTMEVOJBHRGIITFZAXOVBPGUCCHXEICIVGJRFNKCNTNVVRGXFZTJEILCIKCYGGXXVJTHGUGEXHZLXMRRPSXEYGUYTVPA" +
    "XPZEBXFLQEAKEVHBXFSHOQLJTSRVPRXTCCHLGTPTMUTCHMNRRPVJVBTECIYXLQECCNPJCCLEVQIECKYRAGUCATRYGAHUFNWBGRSRHPKPPBTVJTF" +
    "AJRTKGVQIICIBTYKEGIBQEBJGCLRGXQIBGXSLCAXRIMQEGDCXEGJRXGCTATLUZZAXCCYGTKJMCWCEQAXUDWHMGICHWGCYCMKHSXMGJCJEUUCGT" +
    "TVQXGKKGTLRRPKBGELTGVRJPVQDNGXJVLHBQEBJFAJRTKGVRAXEYPXLVZYCBUDCTLVSCPNEFSEINLQGTFZAPEGEADKGCCBRUKCGXGJRRXSLGTLVR" +
    "ZHHNLKTGVZLPVEVQHBDCCPECIYXLQERWHORQSTSLGCEGGJJLIIYCWVYCDEQXGTGFVRDNVVJPVJICIBGERTFGUGTOCCCTMNRPTYGICCVGVLRHTVYJ" +
    "CQLPSAWZBTMQLRTECKFTHNFEXXEYPTMKVLCXKEQXLVVQJKNVDPBVHSTECIYIBQEYABVVQPKTVRTTWJCJBNUSBRUKCGXNVKNLVVPTXUKQPVTVQX" +
    "OQLQEKGWCGXBZJTLVKPPGUTCCWCERXEGJRSBXZLPEQIQFNGCCHXEICIXUKNGHHRLTEGJCRKGKCHMKDKPGGERPECTMCWKKGDGJLKPBPVGAXUK" +
    "FJFCZLTMEVQIIQLPFNQZDXWGCCPLCMMRTVZMCECGPDUNVKPMKJYIBQEJPKGWJTQKFLEAKCMHHRYGFNGZLIXTIMVXNVQTVTVRXGVVPGHIVJWNOR" +
    "LXMGUSHXEICILKTCITKKSCFAJRTKGVJAXPVJXGVVPGHIVPPBVGYHEGDWHMGICCXUKNPLWECRTVVEDKKVNWBNFQDIJZOJX";

//Try to find the best approximation of key with a maximum length of n
// In French we know that the most used letter are e and a. So we need to find the best key that show up the maximum of
// e and a when we try a decypher. Then we could perform an easy brute force for finding the remaining component of the key

//most useful rewrite of frequency function of exercice 1.3.2
class Occur {
    constructor(letter, freq = 1) {
        this.letter = letter;
        this.freq = freq;
    }
    inc() { ++this.freq;}
}
const frequency = str => {
    str = sanitize(str);
    let result= []; //array of Occur objects
    //fill our result array;
    for(let i = 0; i < str.length; ++i) {
        let found = result.find(elem => elem.letter === str[i]);
        found ? found.inc() : result.push(new Occur(str[i]));
    }
    //sort our array in descend way.
    result.sort((elem1, elem2) => elem2.freq > elem1.freq ? 1: -1);
    return result;
};

//Return the keys with the highest possibility for each possible size from 1 to max inclusive
const findKeys = (str, max) => {
    let keys = [];
    //A key has the a size from 1 to max
    for(let i = 0; i < max; ++i) {
        let grp = regroup(str, i + 1);
        //Find the letters with the highest frequency in each chunk
        //Our hypothesis is the letters found are the enciphered version of "E"
        let key = "";
        for (let j = 0; j < grp.length; ++j) {
            let encE = frequency(grp[j])[0].letter;
            let offset = indexAlphabet(encE) - indexAlphabet("E");
            offset = offset < 0 ? offset + 26 : offset;
            key = key +  String.fromCharCode(65 + offset);
        }
        keys.push(key);
    }
    return keys;
};

//Test Encryption into Decryption:
console.log("Training A and B:");
let msg = "coucou Toi, Ze 1337 alors? comment ca va ajd?";
let key = "DODU";
let enc = encVigenere(msg, key);
let dec = decVigenere(enc, key);
console.log("message: ", msg);
console.log('encrypted: ', enc);
console.log('decrypted: ', dec);

//Test regroup function
console.log("Training C:");
let reg = regroup(msg, key.length);
console.log(reg);

console.log("Training D:");
console.log("Secret message:", secret);
let keys = findKeys(secret, 5); // our key has a max length of 5
console.log(`Best possible keys are ${keys.join(", ")}`);
// For each key try to decipher the text
keys.forEach(key => {
    console.log("############################################");
    console.log(`Decipher with key ${key}`);
    console.log(decVigenere(secret, key));
});
console.log("We obtain a clear text in French with the key CRYPT");
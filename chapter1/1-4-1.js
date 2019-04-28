/*
    Convert a decimal number to an hexadecimal string in both big and little endian
 */

const HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const dec2hex = n => {
    let result = [];
    do {
        result.push(HEX[n % 16]);
        n = Math.floor(n / 16);
    }while(n > 0);
    if(result.length % 2 !== 0)
        result.push(0);
    result.reverse();
    //group by byte
    let tmp = [];
    for(let i = 0; i < result.length; i += 2)
        tmp.push(result[i] + result[i + 1]);
    let le = "";
    let output = `${n} -> 0x ${tmp.join(' ')} (big endian)\n  -> 0x ${tmp.reverse().join(' ')} (little endian)`;
    console.log(output);

};

console.log(dec2hex(466321));
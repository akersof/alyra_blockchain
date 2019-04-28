const HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const dec2hex = n => {
    let nb = n;
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
    let prefix = "";
    let varInt = [...tmp];
    varInt.reverse();
    if(nb > 253) {
        if(nb < 0xffff) {
            prefix = 'FD';
            while(varInt.length !== 2)
                varInt.push("00");
        }
        else if(nb < 0xffffffff) {
            prefix = 'FE';
            while(varInt.length !== 4)
                varInt.push("00");
        }
        else if (nb < 0xffffffffffffffff) {
            prefix = 'FF';
            while(varInt.length !== 8)
                varInt.push("00");
        }
    }
    varInt.unshift(prefix);
    let output =
        `${nb} -> 0x ${tmp.join(' ')} (big endian)\n    -> 0x ${tmp.reverse().join(' ')} (little endian)\n    -> 0x ${varInt.join(' ')} (notation variable)`;
    console.log(output);

};

console.log(dec2hex(466321));
console.log(dec2hex(131));
console.log(dec2hex(643));
console.log(dec2hex(255));

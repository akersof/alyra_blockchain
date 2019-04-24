const crypto = require('crypto');
/*
Buffer.from(msg);
nifMessage.toStrin('hex');
parseInt(bufMessage.toString(hex),  16);

let arrayMessage = new Uint8Array(buffmessage);

const msg = "";
const secret = "";
const key = "";

*/


const generatePad = (size) => {
    return crypto.randomBytes(size).toString('hex');

};

const applyPad = (message, pad) => {
    let msgBuff = Buffer.from(message);
    let padBuff = Buffer.from(pad, 'hex');
    let encBuff = Buffer.alloc(message.length);
    for(let i = 0; i < msgBuff.length; ++i)
        encBuff[i] = msgBuff[i] ^ padBuff[i];
    //console.log(padBuff);
    //console.log(msgBuff);
    //console.log(secretBuff);
    //console.log(secretBuff.toString('hex'));
    return encBuff.toString();

};

const msg = "coucou toi";
console.log("msg: ", msg);
let pad = generatePad(msg.length);
console.log("pad: ", pad );
let enc = applyPad(msg, pad);
console.log("enc: ", enc);
let dec = applyPad(msg, pad);
console.log("dec", dec);

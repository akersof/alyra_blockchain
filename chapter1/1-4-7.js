/*
    check if this P2PKH is true:
    verifyP2PKH("0x483045022100d544eb1ede691f9833d44e5266e923dae058f702d2891e4ee87621a433ccdf4f022021e40
    5c26b0483cd7c5636e4127a9510f3184d1994015aae43a228faa608362001210372cc7efb1961962bba20db0c6a3eebdde0ae60698
    6bf76cb863fa460aee8475c", "0x76a9147c3f2e0e3f3ec87981f9f2059537a355db03f9e888ac") -> True
 */

// Will will enhance the classes created at exercices 1.4.4 and add this features in class Transaction

//little endian hex string to big endian
const le2be = str => {
    let beStr = "";
    for(let i = 0; i < str.length; i += 2)
        beStr = str[i] + str[i + 1] + beStr;
    return beStr;
};

//take a buffer with the VarInt field at index 0, and return a list containing,
//the size of the VarInt field itself (prefix with value), and the size in coming data
const readVarIntField = buff => {
    let viSize = 1;
    let viValue = 0;
    let prefix = buff[0].toString(16).toUpperCase();
    switch(prefix) {
        case 'FD':
            viSize += 2;
            viValue = parseInt(buff.slice(1, 1 + viSize).toString('hex'), 16);
            break;
        case 'FE':
            viSize += 4;
            viValue = parseInt(buff.slice(1, 1 + viSize).toString('hex'), 16);
            break;
        case 'FF':
            viSize += 8;
            viValue = parseInt(buff.slice(1, 1 + viSize).toString('hex'), 16);
            break;
        default:
            //the prefix we read is in fact the value here cause no prefix.
            viValue = parseInt(prefix, 16);
            break;
    }
    return [viSize, viValue];
};

//Input related constants
const TXID_SIZE = 32;
const OUTPUT_INDEX_SIZE = 4;
const SEQ_SIZE = 4;

class Input {
    constructor() {
        this.txId = "";
        this.outIndex = "";
        this.scriptSig = "";
        this.sequence = "";
        this.signature = "";
        this.pubKey = "";
        this.size = 0;

    }
    //construct an entry from hex string.
    from(entry){
        let curIndex = 0;
        let buff = Buffer.from(entry, 'hex');
        //Get previous transaction ID
        this.txId = le2be(buff.slice(curIndex, curIndex + TXID_SIZE).toString('hex'));
        curIndex += TXID_SIZE;
        //get output index
        this.outIndex = parseInt(le2be(buff.slice(curIndex, curIndex + OUTPUT_INDEX_SIZE).toString('hex')), 16);//.toString('hex');
        curIndex += OUTPUT_INDEX_SIZE;
        //Get scriptSig
        let [viSize, viValue] = readVarIntField(buff.slice(curIndex));
        curIndex += viSize;
        this.scriptSig = buff.slice(curIndex, curIndex + viValue).toString('hex');
        //
        let [sigVarIntSize, signatureSize] = readVarIntField(buff.slice(curIndex));
        curIndex += sigVarIntSize;
        this.signature = buff.slice(curIndex, curIndex + signatureSize).toString('hex');
        curIndex += signatureSize;
        let [pubVarIntSize, pubKeySize] = readVarIntField(buff.slice(curIndex));
        curIndex += pubVarIntSize;
        this.pubKey = buff.slice(curIndex, curIndex + pubKeySize).toString('hex');
        curIndex += pubKeySize;
        //
        //curIndex += viValue;
        this.sequence = buff.slice(curIndex, curIndex + SEQ_SIZE).toString('hex');
        curIndex += SEQ_SIZE;
        this.size = curIndex;
    }
    str(){
        let txId = `previous tx: ${this.txId}`;
        let outIndex = `output index: ${this.outIndex}`;
        let scriptSig = `scriptSig: ${this.scriptSig}`;
        let signature = `\tsignature: ${this.signature}`;
        let pubKey = `\tpublic key: ${this.pubKey}`;
        let sequence = `sequence: ${this.sequence}`;
        return `${txId}\n${outIndex}\n${scriptSig}\n${signature}\n${pubKey}\n${sequence}\n`;
    }
}

// Output related constant
const SATOSHI_SIZE = 8;
class Output {
    constructor(){
        this.amount = 0;
        this.scriptPubKeySize = 0;
        this.scriptPubKey = "";
        this.size = 0;
    }
    from(str) {
        let curIndex = 0;
        let buff = Buffer.from(str, 'hex');
        this.amount = parseInt(le2be(buff.slice(curIndex, SATOSHI_SIZE).toString('hex')), 16);
        curIndex += SATOSHI_SIZE;
        let [viSize, viValue] = readVarIntField(buff.slice(curIndex));
        this.scriptPubKeySize = viValue;
        curIndex += viSize;
        this.scriptPubKey = buff.slice(curIndex, curIndex + this.scriptPubKeySize).toString('hex');
        curIndex += this.scriptPubKeySize;
        this.size = curIndex;
    }
}

//Transaction related constants
const VERSION_SIZE = 4;
const LOCKTIME_SIZE = 4;
const SCRIPT_OPERANDE = [0X76, 0xA9, 0X88, 0xAC]; const 
class Transaction{
    constructor() {
        this.version = 0;
        this.inputCount = 0;
        this.inputs = []; // an array of input
        this.outputCount = 0;
        this.outputs = []; // an array of output
        this.lockTime = 0;
        this.size = 0;
    }
    from(str){
        let curIndex = 0;
        let buff = Buffer.from(str, 'hex');
        //Get the version
        this.version = parseInt(le2be(buff.slice(curIndex, VERSION_SIZE).toString('hex')), 16);
        curIndex += VERSION_SIZE;
        //get InputCount
        let [fieldSize, viValue] = readVarIntField(buff.slice(curIndex));
        this.inputCount = viValue;
        curIndex += fieldSize;
        // get inputs
        for(let i = 0; i < this.inputCount; ++i) {
            let input = new Input();
            input.from(buff.slice(curIndex));
            this.inputs.push(input);
            curIndex += input.size;
        }
        //get ouputs
        [fieldSize, viValue] = readVarIntField(buff.slice(curIndex));
        this.outputCount = viValue;
        curIndex += fieldSize;
        for(let i = 0; i < this.outputCount; ++i) {
            let output = new Output();
            output.from(buff.slice(curIndex));
            this.outputs.push(output);
            curIndex += output.size;
        }
        this.lockTime = parseInt(le2be(buff.slice(curIndex, curIndex + LOCKTIME_SIZE).toString('hex')), 16);
        curIndex += LOCKTIME_SIZE;
        this.size = curIndex;
    }
    str(){
        let version = `version: ${this.version}`;
        let inputCount = `nb inputs: ${this.inputCount}`;
        let inputs = "";
        for(let i = 0; i < this.inputs.length; ++i) {
            inputs = inputs + `\ninput ${i + 1}:\n`;
            let txId = `\tprevious tx: ${this.inputs[i].txId}`;
            let outIndex = `\toutput index: ${this.inputs[i].outIndex}`;
            let scriptSig = `\tscriptSig: ${this.inputs[i].scriptSig}`;
            let signature = `\tsignature: ${this.inputs[i].signature}`;
            let pubKey = `\tpublic key: ${this.inputs[i].pubKey}`;
            let sequence = `\tsequence: ${this.inputs[i].sequence}`;
            inputs = inputs + `${txId}\n${outIndex}\n${scriptSig}\n${signature}\n${pubKey}\n${sequence}`;
        }
        let outputCount = `nb outputs: ${this.outputCount}`;
        let outputs = "";
        for(let i = 0; i < this.outputs.length; ++i) {
            outputs = outputs + `\noutput ${i + 1}:\n`;
            let amount = `\tamount: ${this.outputs[i].amount} -> ${this.outputs[i].amount * Math.pow(10, -8)} BTC`;
            let script = `\tscript pub key: ${this.outputs[i].scriptPubKey}`;
            outputs = outputs + `${amount}\n${script}`;
        }
        let lockTime = `lock time: ${this.lockTime}`;
        return `${version}\n${inputCount}${inputs}\n${outputCount}${outputs}\n${lockTime}\n`;

    }
    verifyP2PKH(scriptSig, scriptPubKey){
        //First extract signature and public key from scriptSig
        if(scriptSig.toUpperCase().startsWith('0X'))
            scriptSig = scriptSig.slice(2);
        if(scriptPubKey.toUpperCase().startsWith('0X'))
            scriptPubKey = scriptPubKey.slice(2);
        let curIndex = 0;
        let scriptSigBuff = Buffer.from(scriptSig, "hex");
        let [sigVarIntSize, signatureSize] = readVarIntField(scriptSigBuff.slice(curIndex));
        curIndex += sigVarIntSize;
        let signature = scriptSigBuff.slice(curIndex, curIndex + signatureSize).toString('hex');
        curIndex += signatureSize;
        let [pubVarIntSize, pubKeySize] = readVarIntField(scriptSigBuff.slice(curIndex));
        curIndex += pubVarIntSize;
        let pubKey = scriptSigBuff.slice(curIndex, curIndex + pubKeySize).toString('hex');
        curIndex += pubKeySize;
        let stack = [];
        //checking sanity of scriptPubKey format
        let scritPubKeyBuff = Buffer.from(scriptPubKey, "hex");



        console.log(signature);
        console.log(pubKey);

    }
}

const transaction = new Transaction();
transaction.verifyP2PKH("0x483045022100d544eb1ede691f9833d44e5266e923dae058f702d2891" +
    "e4ee87621a433ccdf4f022021e405c26b0483cd7c5636e4127a9510f3184d1994015aae43a2" +
    "28faa608362001210372cc7efb1961962bba20db0c6a3eebdde0ae606986bf76cb863fa460aee8475c",
    "0x76a9147c3f2e0e3f3ec87981f9f2059537a355db03f9e888ac");

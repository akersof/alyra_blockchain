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
            viValue = parseInt(le2be(buff.slice(1, 1 + viSize)).toString('hex'), 16);
            break;
        case 'FE':
            viSize += 4;
            viValue = parseInt(le2be(buff.slice(1, 1 + viSize).toString('hex')), 16);
            break;
        case 'FF':
            viSize += 8;
            viValue = parseInt(le2be(buff.slice(1, 1 + viSize).toString('hex')), 16);
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

//A starting working example of an Entry class.
//Just enough for 1.4.3 exercice done.
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

const exercice =
    "941e985075825e09de53b08cdd346bb67075ef0ce5c94f98853292d4bf94c10d010000006b483045022100ab44ef4" +
    "25e6d85c03cf301bc16465e3176b55bba9727706819eaf07cf84cf52d02203f7dc7ae9ab36bead14dd3c83c8c030bf8" +
    "ce596e692021b66441b39b4b35e64e012102f63ae3eba460a8ed1be568b0c9a6c947abe9f079bcf861a7fdb2fd577ed" +
    "48a81Feffffff";
let input = new Input();
input.from(exercice);
console.log(input.str());

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
            viValue = parseInt(le2be(buff.slice(1, 1 + viSize).toString('hex')), 16);
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
        let scriptSigSize = viValue;
        this.scriptSig = buff.slice(curIndex, curIndex + viValue).toString('hex');
        /* NEED TO REWORK THIS
        let [sigVarIntSize, signatureSize] = readVarIntField(buff.slice(curIndex));
        curIndex += sigVarIntSize;
        this.signature = buff.slice(curIndex, curIndex + signatureSize).toString('hex');
        curIndex += signatureSize;
        let [pubVarIntSize, pubKeySize] = readVarIntField(buff.slice(curIndex));
        curIndex += pubVarIntSize;
        this.pubKey = buff.slice(curIndex, curIndex + pubKeySize).toString('hex');
        curIndex += pubKeySize;
        */
        curIndex += viValue;
        this.sequence = buff.slice(curIndex, curIndex + SEQ_SIZE).toString('hex');
        curIndex += SEQ_SIZE;
        console.log('SEQUENCE: ', this.sequence);
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
}

const exercice = "0100000001f129de033c57582efb464e94ad438fff493cc4de4481729b859712368582" +
    "75c2010000006a4730440220155a2ea4a702cadf37052c87bfe46f0bd24809759acff8" +
    "d8a7206979610e46f6022052b688b784fa1dcb1cffeef89e7486344b814b0c578133a7" +
    "b0bce5be978a9208012103915170b588170cbcf6380ef701d19bd18a526611c0c69c62" +
    "d2c29ff6863d501affffffff02ccaec817000000001976a9142527ce7f0300330012d6" +
    "f97672d9acb5130ec4f888ac18411a000000000017a9140b8372dffcb39943c7bfca84" +
    "f9c40763b8fa9a068700000000";

const inputExample =
    "941e985075825e09de53b08cdd346bb67075ef0ce5c94f98853292d4bf94c10d010000006b483045022100ab44ef4" +
    "25e6d85c03cf301bc16465e3176b55bba9727706819eaf07cf84cf52d02203f7dc7ae9ab36bead14dd3c83c8c030bf8" +
    "ce596e692021b66441b39b4b35e64e012102f63ae3eba460a8ed1be568b0c9a6c947abe9f079bcf861a7fdb2fd577ed" +
    "48a81Feffffff";

const thai = "0200000001ec774267aa31840ffccdb3bd9eabd1" +
    "8d7939ff3f886f240a7671be1bc9e65822000000" +
    "00fd1f0100483045022100de9971ad9edbf07725" +
    "f186e35bb2f494e202b42f6cc8f4f20bb00f88dd" +
    "daef6e0220447cc3a6e3cde7140767a358c30738" +
    "99a145fa2d618edf8aac052b4617766b79014730" +
    "4402201964730e5ba682064cc45464e71d250357620ae2af7540c1c72e91efb5f65ee40220420dad875996ce076420149babbd2c0e81d6330aaec0b72f1c41805602ad065b014c8b522103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d21027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59021023a11cfcedb993ff2e7523f92e359c4454072a66d42e8b74b4b27a8a1258abddd2102e9d617f38f8c3ab9a6bde36ce991bafb295d7adba457699f8620c8160ec9e87a54aeffffffff01605af405000000001600140b85d9b75f55ad9d42ea2ae9a245568ca34932f600000000";


console.log("TRANSACTION TEST:");
let transaction = new Transaction();
transaction.from(thai);
console.log(transaction.str());
//console.log(transaction.size);
//let input = new Input();
//input.from('00483045022100de9971ad9edbf07725f186e35bb2f494e202b42f6cc8f4f20bb00f88dddaef6e0220447cc3a6e3cde7140767a358c3073899a145fa2d618edf8aac052b4617766b790147304402201964730e5ba682064cc45464e71d250357620ae2af7540c1c72e91efb5f65ee40220420dad875996ce076420149babbd2c0e81d6330aaec0b72f1c41805602ad065b014c8b522103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d21027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59021023a11cfcedb993ff2e7523f92e359c4454072a66d42e8b74b4b27a8a1258abddd2102e9d617f38f8c3ab9a6bde36ce991bafb295d7adba457699f8620c8160ec9e87a54ae');
//console.log(input.str());
/*console.log("INPUT TEST:");
let input = new Input();
input.from(inputExample);
console.log(input.size);*/
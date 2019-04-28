
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
        this.TXID = "";
        this.outIndex = "";
        this.scriptSig = "";
        this.sequence = "";

    }
    //construct an entry from hex string.
    from(entry){
        let curIndex = 0;
        let buff = Buffer.from(entry, 'hex');
        //Get previous transaction ID
        this.TXID = le2be(buff.slice(curIndex, curIndex + TXID_SIZE).toString('hex'));
        curIndex += TXID_SIZE;
        //get output index
        this.outIndex = parseInt(le2be(buff.slice(curIndex, curIndex + OUTPUT_INDEX_SIZE).toString('hex')), 16);//.toString('hex');
        curIndex += OUTPUT_INDEX_SIZE;
        //Get scriptSig
        let [viSize, viValue] = readVarIntField(buff.slice(curIndex));
        curIndex += viSize;
        this.scriptSig = buff.slice(curIndex, curIndex + viValue).toString('hex');
        curIndex += viValue;
        this.sequence = buff.slice(curIndex, curIndex + SEQ_SIZE).toString('hex');
    }
    str(){
        let TXID = `previous tx: ${this.TXID}`;
        let outIndex = `output index: ${this.outIndex}`;
        let scriptSig = `scriptSig: ${this.scriptSig}`;
        let sequence = `sequence: ${this.sequence}`;
        return `${TXID}\n${outIndex}\n${scriptSig}\n${sequence}\n`;
    }
}

//Transaction related constants
const VERSION_SIZE = 4;

class Transaction{
    constructor() {
        this.version = 0;
        this.inputCount = 0;
        this.inputs = []; //an array of entry
        this.outputs = [];
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



    }
    str(){
        let version = `version: ${this.version}`;
        let inputCount = `nb input: ${this.inputCount}`;
        return `${version}\n${inputCount}`;
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

let transaction = new Transaction();
transaction.from(exercice);
console.log(transaction.str());

let input = new Input();
input.from(inputExample);
console.log(input.str());
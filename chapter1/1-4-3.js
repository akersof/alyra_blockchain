const PREV_TX_SIZE = 32;
const EXIT_INDEX_SIZE = 4;
const SEQ_SIZE = 4;

//little endian to big endian
//take a string and return an Int
// TODO works as long as this is a 4 bytes number ?
const le2be = str => {
    let beString = "";
    for(let i = 0; i < str.length; i += 2)
        beString = str[i] + str[i + 1] + beString;
    return beString;
};

//take a VarInt as hexString and return the value
const readVarInt = str =>{

};

//take a buffer with the VarInt field at index 0, and return a list containing,
//the size of the VarInt field, and the value associated to this varInt
const readVarIntField = buff => {
    let viSize = 1;
    let viValue = 0;
    let prefix = buff[0].toString(16).toUpperCase();
    switch(prefix) {
        case 'FD':
            viSize += 2;
            break;
        case 'FE':
            viSize += 4;
            break;
        case 'FF':
            viSize += 8;
            break;
        default:
            viValue = parseInt(prefix, 16);
            break;
    }
    return [viSize, viValue];
};

//A starting working example of an Entry class.
//Just enough for 1.4.3 exercice done.
class Entry {
    constructor() {
        this.prevTx = "";
        this.index = "";
        this.scriptSig = "";
        this.sequence = "";
    }
    //construct an entry from hex string.
    // TODO: can be done better. Try to check old code on PE and ELF disassembler.
    from(entry){
        let curIndex = 0;
        let buff = Buffer.from(entry, 'hex');
        this.prevTx = buff.slice(curIndex, curIndex + PREV_TX_SIZE).toString('hex');
        curIndex += PREV_TX_SIZE;
        let index = buff.slice(curIndex, curIndex + EXIT_INDEX_SIZE).toString('hex');//.toString('hex');
        this.index = parseInt(le2be(index), 16);//.parseInt(16);//.reverse().join().parseInt(16);
        curIndex += EXIT_INDEX_SIZE;
        let [viSize, viValue] = readVarIntField(buff.slice(curIndex));
        console.log(viSize);
        console.log(viValue);
        curIndex += viSize;
        this.scriptSig = buff.slice(curIndex, curIndex + viValue).toString('hex');
        curIndex += viValue;
        this.sequence = buff.slice(curIndex, curIndex + SEQ_SIZE).toString('hex');
    }
    str(){
        let prevTx = `previous tx: ${this.prevTx}`;
        let index = `index: ${this.index}`;
        let scriptSig = `scriptSig: ${this.scriptSig}`;
        let sequence = `sequence: ${this.sequence}`;
        return `${prevTx}\n${index}\n${scriptSig}\n${sequence}\n`;
    }
}

const exercice =
    "941e985075825e09de53b08cdd346bb67075ef0ce5c94f98853292d4bf94c10d010000006b483045022100ab44ef4" +
    "25e6d85c03cf301bc16465e3176b55bba9727706819eaf07cf84cf52d02203f7dc7ae9ab36bead14dd3c83c8c030bf8" +
    "ce596e692021b66441b39b4b35e64e012102f63ae3eba460a8ed1be568b0c9a6c947abe9f079bcf861a7fdb2fd577ed" +
    "48a81Feffffff";
let entry = new Entry();
entry.from(exercice);
console.log(entry.str());
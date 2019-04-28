
//little endian hex string to big endian
const le2be = str => {
    let beStr = "";
    for(let i = 0; i < str.length; i += 2)
        beStr = str[i] + str[i + 1] + beStr;
    return beStr;
};

//Transaction related constants
const VERSION_SIZE = 4;

class Transaction{
    constructor() {
        this.version = 0;
        this.inputCount = 0;
        this.entries = []; //an array of entry
    }
    from(str){
        let curIndex = 0;
        let buff = Buffer.from(str, 'hex');
        //Get the version
        this.version = parseInt(le2be(buff.slice(curIndex, VERSION_SIZE).toString('hex')), 16);
        curIndex += VERSION_SIZE;
        //Get inputCount


    }
    str(){
        let version = `version: ${this.version}`;
        return `${version}\n`;
    }
}

const exercice = "0100000001f129de033c57582efb464e94ad438fff493cc4de4481729b859712368582" +
    "75c2010000006a4730440220155a2ea4a702cadf37052c87bfe46f0bd24809759acff8" +
    "d8a7206979610e46f6022052b688b784fa1dcb1cffeef89e7486344b814b0c578133a7" +
    "b0bce5be978a9208012103915170b588170cbcf6380ef701d19bd18a526611c0c69c62" +
    "d2c29ff6863d501affffffff02ccaec817000000001976a9142527ce7f0300330012d6" +
    "f97672d9acb5130ec4f888ac18411a000000000017a9140b8372dffcb39943c7bfca84" +
    "f9c40763b8fa9a068700000000";

let transaction = new Transaction();
transaction.from(exercice);
console.log(transaction.str());
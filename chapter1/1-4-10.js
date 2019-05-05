const VERSION_SIZE = 4;
const HASH_BLOCK_SIZE = 32;
const MERKLE_SIZE = 32;
const TIME_SIZE = 4;
const BITS_SIZE = 4;
const NONCE_SIZE = 4;

//little endian hex string to big endian
const le2be = str => {
    let beStr = "";
    for(let i = 0; i < str.length; i += 2)
        beStr = str[i] + str[i + 1] + beStr;
    return beStr;
};


class BlockHeader{
    constructor() {
        this.version = 0;
        this.prevBlockHash = "";
        this.hashMerkleRoot = "";
        this.timestamp = "";
        this.bits = "";
        this.nonce = "";

    }
    from(hexStr) {
        let buff = Buffer.from(hexStr, 'hex');
        let index = 0;
        this.version = parseInt(le2be(buff.slice(index, VERSION_SIZE).toString('hex')));
        index += VERSION_SIZE;
        this.prevBlockHash = buff.slice(index, index + HASH_BLOCK_SIZE).toString('hex');
        index += HASH_BLOCK_SIZE;
        this.hashMerkleRoot = buff.slice(index, index + MERKLE_SIZE).toString('hex');
        index += MERKLE_SIZE;
        this.timestamp = parseInt(le2be(buff.slice(index, index + TIME_SIZE).toString('hex')), 16);
        index += TIME_SIZE;
        this.bits = le2be(buff.slice(index, index + BITS_SIZE).toString('hex'));
        index += BITS_SIZE;
        this.nonce = le2be(buff.slice(index, index + NONCE_SIZE).toString('hex'));
        index += NONCE_SIZE;
    }
    str() {
        let version = `version: ${this.version}`;
        let versionHex = `version hex: ${this.version.toString(16)}`;
        let prevBlocHash = `prev block hash: ${this.prevBlockHash}`;
        let merkleRoot = `merkleroot: ${this.hashMerkleRoot}`;
        let timeStamp = `time : ${this.timestamp}`;
        let date = `date: ${new Date(this.timestamp * 1000).toGMTString()}`;
        let bits = `bits: ${this.bits}`;
        let nonce = `nonce: ${this.nonce}`;

        return `${version}\n${versionHex}\n${prevBlocHash}\n${merkleRoot}\n${timeStamp}\n${date}\n${bits}\n${nonce}`;
    }
}



const sample1 =
    "0000002006226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1" +
    "fc7b2b73cf188910f6012bbc61ef34b869cce2a27b0ac7bae48654c" +
    "a5480a23fec84940b81258615006014d5cffff7f2000000000";
const sample2 =
    "00000020fa573ab1dd5f16177db75390db93988078548d62c1b9617" +
    "525a1488f22dcb36af1dd951123097a440a8c8772aab6d46c4ab95a" +
    "8035b4b264421100ef4a77ac3607014d5cffff7f2000000000";

let ex1 = new BlockHeader();
ex1.from(sample1);
let ex2 = new BlockHeader();
ex2.from(sample2);
console.log("SAMPLE 1");
console.log(ex1.str());
console.log('\n');
console.log("SAMPLE 2");
console.log(ex2.str());
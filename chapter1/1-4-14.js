//4:50am wine time...
/*
     validationPOW(“0x01000000008de6ae7a37b4f26a763f4d65c5bc7feb1ad9e3ce0fff4190c067f0000000000913281d
b730c5cff987146330508c88cc3e642d1b9f5154854764fd547e0a54eaf26849ffff001d2e4a4c3d010100000001000000
0000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d013fffffffff0100f205
2a010000004341041ada81ea00c11098d2f52c20d5aa9f5ba13f9b583fda66f2a478dd7d95a7ab615159d98b63df2e6f3e
cb3ef9eda138e4587e7afd31e7f434cbb6837e17feb0c5ac00000000”)-> true
 */

const crypto = require('crypto');

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
        this.hex = "";
    }
    from(hexStr) {
        if(hexStr.toUpperCase().startsWith('0X'))
            hexStr = hexStr.slice(2);
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
        this.hex = buff.slice(0, index).toString('hex');
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
        let hex = `hex: ${this.hex}`;

        return `${version}\n${versionHex}\n${prevBlocHash}\n${merkleRoot}\n${timeStamp}\n${date}\n${bits}\n${nonce}\n${hex}`;
    }
    checkPOW() {
        let blockHash = le2be(crypto.createHash('sha256').update(crypto.createHash('sha256')
                            .update(Buffer.from(this.hex, 'hex')).digest()).digest('hex'));
        let coef = BigInt("0x" + this.bits.slice(2));
        let exp = BigInt("0x" + this.bits.slice(0, 2));
        let target = coef * 2n ** (8n * (exp-3n));
        return BigInt('0x' + blockHash) < target;
    }
}

const sample = "0x01000000008de6ae7a37b4f26a763f4d65c5bc7feb1ad9e3ce0fff4190c067f0000000000913281d" +
    "b730c5cff987146330508c88cc3e642d1b9f5154854764fd547e0a54eaf26849ffff001d2e4a4c3d010100000001000000" +
    "0000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d013fffffffff0100f205" +
    "2a010000004341041ada81ea00c11098d2f52c20d5aa9f5ba13f9b583fda66f2a478dd7d95a7ab615159d98b63df2e6f3e" +
    "cb3ef9eda138e4587e7afd31e7f434cbb6837e17feb0c5ac00000000";

const blockHeader = new BlockHeader();
blockHeader.from(sample);
console.log(blockHeader.str());
console.log('Proof of work: ', blockHeader.checkPOW());
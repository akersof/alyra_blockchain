const Client = require('bitcoin-core');

//Utils functions
const range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
};

const le2be = str => {
    let beStr = "";
    for(let i = 0; i < str.length; i += 2)
        beStr = str[i] + str[i + 1] + beStr;
    return beStr;
};


class BitcoinClient {
    // #TODO: read these values from a config file too;
    constructor(network = 'regtest', port = 18443, username = 'bitcoin', password = 'bitcoin') {
        this.network = network;
        this.port = port;
        this.username = username;
        this.password = password;
        this.connection = new Client({
            network: this.network,
            port: this.port,
            username: this.username,
            password: this.password
        });
    }
    //return the number of block.
    async getBlockCount() {
        return this.connection.getBlockCount();
    }
    //return the hash of a block height
    async getBlockHash(height) {
        //number of blocks minus genesis block
        let nb = await this.getBlockCount();
        if (height > nb)
            throw new Error(`${nb} blocks in blockchain, you can't get the ${height}th block`);
        return this.connection.getBlockHash(height);
    }
    async getLastBlockHash(n) {
        //number of blocks minus genesis block
        let nb = await this.getBlockCount();
        if (n > nb) n = nb;
        let lst = range(nb - n, nb).reverse();
        return Promise.all(lst.map((index) => this.getBlockHash(index)));
    }
    async getBlock(hash) {
        return this.connection.getBlock(hash, true);
    }
    async getBlocByHeight(height) {
        return this.getBlockHash(height).then((hash) => this.getBlock(hash));
    }
    async getLastBlock(n) {
        let lstHash = await this.getLastBlockHash(n);
        return Promise.all(lstHash.map((hash) => this.getBlock(hash)));
    }
    async decodeRawTransaction(hexStr) {
        return this.connection.decodeRawTransaction(hexStr);
    }
    async getTransaction(txid) {
        return this.connection.getTransaction(txid);
    }
    async getTransactionsByBlockHash(hash) {
        let jsonBlock = await this.getBlock(hash);
        if(parseInt(jsonBlock['nTx']) >= 1) {
           return Promise.all(jsonBlock['tx'].map((txid) => this.getTransaction(txid)));
        } else return [];
    }
    async getTransactionsByBlockHeight(height) {
        return this.getBlockHash(height).then((hash) => this.getTransactionsByBlockHash(hash));

    }
    async getBlockchainInfo() {
        return this.connection.getBlockchainInfo();
    }
}


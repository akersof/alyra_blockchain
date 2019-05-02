const Client = require('bitcoin-core');

//Utils functions
const range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
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
    async getLastBlock(n) {
        let lstHash = await this.getLastBlockHash(n);
        return Promise.all(lstHash.map((hash) => this.getBlock(hash)));
    }
    async decodeRawTransaction(hexStr) {
        return this.connection.decodeRawTransaction(hexStr);
    }
}
const bc = new BitcoinClient();
//bc.getLastBlock(5).then(console.log);

const thai = "0200000001ec774267aa31840ffccdb3bd9eabd1" +
    "8d7939ff3f886f240a7671be1bc9e65822000000" +
    "00fd1f0100483045022100de9971ad9edbf07725" +
    "f186e35bb2f494e202b42f6cc8f4f20bb00f88dd" +
    "daef6e0220447cc3a6e3cde7140767a358c30738" +
    "99a145fa2d618edf8aac052b4617766b79014730" +
    "4402201964730e5ba682064cc45464e71d250357620ae2af7540c1c72e91efb5f65ee40220420dad875" +
    "996ce076420149babbd2c0e81d6330aaec0b72f1c41805602ad065b014c8b522103745c9aceb84dcdeddf2c" +
    "3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d21027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57e" +
    "bcf0c42364d3822c59021023a11cfcedb993ff2e7523f92e359c4454072a66d42e8b74b4b27a8a1258abdd" +
    "d2102e9d617f38f8c3ab9a6bde36ce991bafb295d7adba457699f8620c8160ec9e87a54aeffffffff01605a" +
    "f405000000001600140b85d9b75f55ad9d42ea2ae9a245568ca34932f600000000";
bc.decodeRawTransaction(thai).then(console.log);





/*
// const bitcoinCli = new Client({ network: 'regtest',port:'18443', username: 'bitcoin', password: 'bitcoin'});

const getBlockCount = () => {
    return client.getBlockCount();
};

const getBlockHashNth = async (n) => {
    let nb = await getBlockCount();
    if(n > nb)
        throw new Error(`${nb} blocks in blockchain, you can't get the ${n}th block`);
    return client.getBlockHash(n);
};

const getBlockByHash = async (hash) => {
    return client.getBlockByHash(hash, {extension: 'json'});
};






const thai = "0200000001ec774267aa31840ffccdb3bd9eabd1" +
    "8d7939ff3f886f240a7671be1bc9e65822000000" +
    "00fd1f0100483045022100de9971ad9edbf07725" +
    "f186e35bb2f494e202b42f6cc8f4f20bb00f88dd" +
    "daef6e0220447cc3a6e3cde7140767a358c30738" +
    "99a145fa2d618edf8aac052b4617766b79014730" +
    "4402201964730e5ba682064cc45464e71d250357620ae2af7540c1c72e91efb5f65ee40220420dad875996ce076420149babbd2c0e81d6330aaec0b72f1c41805602ad065b014c8b522103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d21027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59021023a11cfcedb993ff2e7523f92e359c4454072a66d42e8b74b4b27a8a1258abddd2102e9d617f38f8c3ab9a6bde36ce991bafb295d7adba457699f8620c8160ec9e87a54aeffffffff01605af405000000001600140b85d9b75f55ad9d42ea2ae9a245568ca34932f600000000";

//client.decodeRawTransaction(thai, true).then(console.log);

//getBlockCount().then(console.log);
//getBlockHashNth(107).then((hash) => client.getBlockByHash(hash)).then(console.log);
*/
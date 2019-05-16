let dapp = {};
const connectMetamask = async () => {
    try {
        //ask metamask for connection
        const addresses = await ethereum.enable();
        console.log(addresses);
        const address = addresses[0];
        //connect to the node given by object Web3
        const provider = new ethers.providers.Web3Provider(ethereum);
        dapp = {address, provider};
        console.log(dapp);

    }catch(err) {console.log(err);}
};

//take a string id from an html document, and value as innerHTML content of the tag related to id
const toHtml = (id, value) => {
    document.getElementById(id).innerHTML = value;
};

const getBalance = async () => {
    const balance = await dapp.provider.getBalance(dapp.address);
    return  ethers.utils.formatEther(balance);

};

const getBlockNumber = async () => {
    return  await dapp.provider.getBlockNumber();

};

const getGasPrice = async () => {
    const gasPrice = await dapp.provider.getGasPrice();
    return  ethers.utils.formatEther(gasPrice);
};

(async () => {
    await connectMetamask();
    toHtml("address", dapp.address);

    let balance = await getBalance();
    toHtml("balance", balance);
    console.log(`balance: ${balance}`);

    let lastBlock = await getBlockNumber();
    toHtml("lastblock", lastBlock);
    console.log(`last block height: ${lastBlock}`);

    let gasprice = await getGasPrice();
    toHtml("gasprice", gasprice);
    console.log(`current gas price: ${gasprice}`);
})();


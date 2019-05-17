let dapp = {};

//Connect to metamask
const connectMetamask = async () => {
    try {
        //ask metamask for connection
        const addresses = await ethereum.enable();
        const address = addresses[0];
        //connect to the node given by object Web3
        const provider = new ethers.providers.Web3Provider(ethereum);
        dapp = {address, provider};

    }catch(err) {console.log(err);}
};

//take a string id from an html document, and value as innerHTML content of the tag related to id
const toHtml = (id, value) => {
    document.getElementById(id).innerHTML = value;
};


const getBalance = async (addr) => {
    const balance = await dapp.provider.getBalance(addr);
    return  ethers.utils.formatEther(balance);

};

const init = async () => {
    await connectMetamask();
    toHtml("contractaddr", contractAddress);
    toHtml("addr", dapp.address);
    toHtml("netname", (await dapp.provider.getNetwork()).name);
    toHtml("balance", await getBalance(dapp.address));
    //init contract
    dapp.contract = new ethers.Contract(contractAddress, contractABI, dapp.provider);
    dapp.signer = dapp.contract.connect(dapp.provider.getSigner(dapp.address))
    dapp.contract.on('Submit', (student, hash) => {
        console.log(`${student} submits homework ${hash}`);
        document.getElementById('output').innerHTML=`Thank you ${student}, homework submitted with hash ${hash}`;
    });
};

//handle submit url button
document.getElementById('submitUrl').addEventListener('click', async (event) => {
    const url = document.getElementById('urlInput').value;
    const hash = await dapp.contract.hashHomeWork(url);
    await dapp.signer.send(hash);
});


const userInterface = async () => {
  toHtml("cred", await dapp.contract.cred(dapp.address));
};

(async () => {
    await init();
    await userInterface();
})();

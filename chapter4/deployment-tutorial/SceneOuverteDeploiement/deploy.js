const fs = require('fs')
const ethers = require('ethers')
const output = require('./build/SceneOuverte')
const so = output.contracts['contracts/SceneOuverte.sol:SceneOuverte']

async function deployAll() {
 var provider = new ethers.providers.JsonRpcProvider("http://localhost:7545")
 const signer = provider.getSigner(0)
 let factory = new ethers.ContractFactory(so.abi, so.bin, signer)
 let contract = await factory.deploy()
 console.log('En deploiement:',contract.address)
 fs.writeFileSync('./src/data.js', `const CONTRACT_ADDRESS="${contract.address}";\n` );
 fs.appendFileSync('./src/data.js', `const CONTRACT_ABI=${so.abi};`);
}
deployAll()
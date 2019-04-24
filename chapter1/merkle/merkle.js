//const program = require('commander');
//const crypto = require('crypto');
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

/*
program
    .version("1.0.0")
    .arguments('<data...> ' )
    .action(function(data){
        console.log("Data: ", data);
        let treeSize = 0;
        let tmp = Math.ceil(Math.log2(data.length));
        for (let i = 0; i <= Math.ceil(Math.log2(data.length)); ++i) {
            treeSize += Math.pow(2, i);
        }
        let tree = new Array(treeSize).fill("");
        data.forEach((elem, i) => {
            tree[tree.length - 1 - i] = crypto.createHash('sha256').update(elem).digest('hex').toString();
        });
        tree.reverse();
        console.log(tree);
        //let chunked = chunk(tree, 2);
        let depth = tmp;
        for(let i = 0; i < tree.length - 1; i+=2) {
            let toHash = tree[i] + (tree[i + 1] === "" ? tree[i] : tree[i + 1]);
            let hashed = crypto.createHash('sha256').update(toHash).digest('hex').toString();
            tree[Math.pow(2, depth) - 1] = hashed;
        }

        //let tree = inputData.map(elem => crypto.createHash('sha256').update(elem).digest('hex').toString());
        console.log(tree);
    });

program.parse(process.argv);
*/

const leaves = ['AA', 'BB', 'cc', 'DD', 'EE'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256);
const root = tree.getRoot().toString('hex');
//const leaf = SHA256('a');
//const proof = tree.getProof(leaf)
//console.log(tree.verify(proof, leaf, root)) // true

MerkleTree.print(tree);

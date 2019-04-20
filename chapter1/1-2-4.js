/*
    Find an algorithm for finding transactions that will provide us best reward in changing currencies
    Bellow what we know:
        84 Doge -> 32 LTC (1 Doge = 0.381 LTC)

        29 Doge -> 80 ETH (1 Doge = 2.75 ETH)

        300 ETH ->  62 BTC (1 ETH = 0.206 BTC)

        288 LTC -> 2304 ETH (1 LTC = 8 ETH)

        27 BTC -> 46 Doge (1 BTC = 1.7 Doge)

        33 BTC -> 16 LTC (1 BTC = 0.48 LTC)

 A classical graph theory problem. This is a Weighted undirected cyclic graph
 */


const DOGE = 0;
const ETH = 1;
const LTC = 2;
const BTC = 3;

const strMap = {
    0: "DOGE",
    1: "ETH",
    2: "LTC",
    3: "BTC"
};

const adjMat = [
    // Doge, ETH, LTC, BTC
    [1 , 2.75, 0.381, 1 / 1.7], // Doge
    [1 / 2.75, 1, 1 / 8, 0.206], // ETH
    [1 / 0.381, 8, 1, 1 / 0.48], // LTC
    [1.7, 1 / 0.206, 0.48, 1], // BTC
];

//if a child node is already visited we can still go on, but we have convert back to our root node next :)
//take a matrix/graph , a starting node and perform a DFS.
// This function return a list containing the max reward, and an object with string of transaction as key, and reward as value.
const dfs = (matrix, root) => {
    const currencies = 100;
    const visited= {0: false, 1: false, 2: false, 3: false};
    //log all possible transactions and the benefit we made
    let log = {};
    const go = (node,parent, visited, coins, history) => {
        //if(node === root && visited[root] === true) return coins;
        if(node === root && parent !== null) {
            history += ` -> ${strMap[root]} from ${currencies} to ${coins} ${strMap[root]}`;
            log[history] = coins;
            return coins;
        }
        else if(visited[node] === true) {
            coins *= matrix[node][root];
            history += ` -> ${strMap[node]} -> ${strMap[root]} from ${currencies} to ${coins} ${strMap[root]}`;
            log[history] = coins;
            return coins;
        }
        else {
            visited[node] = true;
            if(node !== root) history += ` -> ${strMap[node]}`;
            const childs = [DOGE, ETH, LTC, BTC].filter(elem => elem !== node &&  elem !== parent);
            parent = node;
            let best =  Math.max(...childs.map(
                elem => go(elem, parent, {...visited}, coins * matrix[node][elem], history )
            ));
            return best;
        }
    };
    return [go(root,  null,{...visited}, currencies, `${strMap[root]}`), log];
};

//little helper function for finding a key by value in an object:
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

//let [maxDoge, logDoge] = dfs(adjMat, DOGE);
let [maxDoge, logDoge] = dfs(adjMat, DOGE);
let [maxETH, logETH] = dfs(adjMat, ETH);
let [maxLTC, logLTC] = dfs(adjMat, LTC);
let [maxBTC, logBTC] = dfs(adjMat, BTC);
console.log("The best transactions for each currencies: ");
console.log("Starting with 100 Doge: ");
console.log(`\t${getKeyByValue(logDoge, maxDoge)} ratio: ${maxDoge / 100}`);
console.log("Starting with 100 ETH: ");
console.log(`\t${getKeyByValue(logETH, maxETH)} ratio: ${maxETH / 100}`);
console.log("Starting with 100 LTC: ");
console.log(`\t${getKeyByValue(logLTC, maxLTC)} ratio: ${maxLTC / 100}`);
console.log("Starting with 100 BTC: ");
console.log(`\t${getKeyByValue(logBTC, maxBTC)} ratio: ${maxBTC / 100}`);

// To solve the problem we could start from each node with a starting amount, do a breadth-first traversal or
// depth-first traversal, and check the benefits or losses we made. But this is a cyclic graph so we need a detect cycles.
// The best paths should be the paths with the higher benefits.


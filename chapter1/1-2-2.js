/*
    Solving the Knapsack problem. See https://en.wikipedia.org/wiki/Knapsack_problem for more details
    Bellow the problem to solve (in french):
 --
On définit un ensemble de transactions avec leur taille (en octets) et leur pourboire (en satoshis) associés :

Taille (octets):        2000    6000     800      700      1200     1000     1300     600
Pourboire (satoshis) :  13000   9000    2000     1500      3500     2800     5000    1500

Étant donné un bloc donc la taille maximale est 6 000 octets, quelles sont les transactions qui devraient être incluses
pour récupérer le meilleur pourboire ?
Définir un algorithme pour résoudre ce problème quel que soit le nombre de transactions. On pourra essayer une approche
exhaustive qui essaye toutes les combinaisons de transactions et une approche plus tactique.
Quelle est sa complexité ?
--
*/

const MAX_BLOC_SIZE = 6000;

// raw data saved in a Map data structure. Map is a good alternative to Object literals as type of keys
// is not converted to string. key is a transaction size in bytes and value is the reward in satoshis
const transactionMap = new Map([
    [2000, 13000],
    [6000, 9000],
    [800, 2000],
    [700, 1500],
    [1200, 3500],
    [1000, 2800],
    [1300, 5000],
    [600, 1500]
]);

//A transaction is defined by a size in byte, a reward in satoshis and a ratio satoshis/byte
class Transaction {
    constructor(size, reward){
        this.size = size;
        this.reward = reward;
        this.ratio = reward / size; // Higher is the ratio, better is our transaction! useful for solution 2
    }
}

//Fill up a list with all known transactions with Transaction objects constructed with data from transactionMap
const transactions =
    Array.from(transactionMap.entries()).map(([size, reward]) => new Transaction(size, reward));

//Get the current size in bytes of a list of Transaction objects
const getCurrentSize = transactionList => {
    if(transactionList.length === 0 ) return 0;
    return transactionList.map(el => el.size).reduce((acc, curr) => acc + curr);
};

//Get the current reward in satoshis of a list of Transaction Objects
const getCurrentReward = transactionList => {
    if(transactionList.length === 0) return 0;
    return transactionList.map(el => el.reward).reduce((acc, curr) => acc + curr);
};
/*
    Solution 1:
    Try all the possible combinations and take the one with the highest reward
    #TODO: If we found more than 1 solutions, take the one with the less transactions.
    We use recursive binary search for this. The complexity of this algorithm is O(2^n)
 */
const SOL1_COMPLEXITY = "O(2^n)";
// First find all the possible combinations
// A combination is a list of possible transactions
// The total size in bytes of all the transactions for 1 combination has to be less or equal to 6000
const findCombination = transactions => {
    //helper function for passing our data across the recursive call. This way we avoid global variables
    //acc is the accumulation of all transactions found for 1 combination, remaining is the rest of the possible transactions.
    const go = (acc, remaining) => {
        //Terminal cases
        if(getCurrentSize(acc) > MAX_BLOC_SIZE) return acc.slice(0, -1);
        else if(remaining.length === 0) return acc;
        //step for recursion
        else {
            let a = go([...acc, remaining[0]], remaining.slice(1));
            let b = go ([...acc], remaining.slice(1));
            return getCurrentReward(a) > getCurrentReward(b) ? a : b;
        }
    };
    return go([], transactions);
};

console.log("###########################################");
console.log(`Solution 1 => complexity ${SOL1_COMPLEXITY}`);
const combination = findCombination(transactions);
console.log(`The best combination is ${JSON.stringify(combination)}`);
console.log(`Reward: ${getCurrentReward(combination)}`);
console.log(`Bloc size used: ${getCurrentSize(combination)}/${MAX_BLOC_SIZE} bytes`);
console.log("###########################################");


/*
    Solution 2:
    Our optimal solution should use first the transactions with the highest satoshis/reward ratio.
    #TODO: We can also optimize more by checking if the remaining bytes can give us more reward by dropping
    #the last transaction and check if the addition of remaining transactions can give more reward by filling more space
 */

//Find combination on a sorted list of transactions (highest ratio to lowest)
const findCombinationOpti = sortedTransactions => {
    const go = (acc, remaining) => {
        if(getCurrentSize(acc) > MAX_BLOC_SIZE) return acc.slice(0, -1);
        else if(remaining.length === 0) return acc;
        else return go([...acc, remaining[0]], remaining.slice(1));
    };
    return go([], sortedTransactions);
};
console.log('\n');
console.log("###########################################");
console.log("SOLUTION 2 with optimization: (we can still optimize more using special exceptions applied to our problem)");
//Sorting from highest satoshis/bytes ratio to lower
transactionsSorted = transactions.sort((fst, snd) => snd.ratio - fst.ratio);
const combinationOpti = findCombinationOpti(transactionsSorted);
console.log(`The combination with a generic optimization is ${JSON.stringify(combinationOpti)}`);
console.log(`Reward: ${getCurrentReward(combinationOpti)}`);
console.log(`Bloc size used: ${getCurrentSize(combinationOpti)}/${MAX_BLOC_SIZE} bytes`);
console.log("###########################################");
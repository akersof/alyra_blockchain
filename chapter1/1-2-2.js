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

const BLOC_SIZE = 6000;

// raw data saved in a Map data structure. Map is a good alternative to Object literal as type of keys
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

//A transaction is defined by a size, a reward and a ratio satoshis/bits
class Transaction {
    constructor(size, reward){
        this.size = size;
        this.reward = reward;
        this.ratio = reward / size; // Higher is the ratio, better is our transaction!
    }
}

//Fill up a transactions list with Transaction object constructed with data from transactionMap
const transactions = Array.from(transactionMap.entries()).map(([size, reward]) => new Transaction(size, reward));

/*
    Solution 1:
    Try all the possible combinations and take the one with the higher reward
    If we found more than 1 solutions, take the one with the less transactions.
    We use recursive binary search for this.
 */


console.log(transactions);

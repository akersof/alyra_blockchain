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

//transaction map "size: reward"
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

const parseMap = map => {
    let total = 0;
    
};

const something = map => {
    map.delete(2000);
};

//something(transactionMap);
for(const [key, value] of transactionMap) {
    console.log(`${key}: ${value}`);
}
console.log(transactionMap.keys());
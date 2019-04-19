/*
    Write a better implementation of the factorial function below:

    function factorielRecursifNaif(n) {
        if(n === 0) {
            return 1
        } else {
            return n * factorielRecursifNaif(n-1)
        }
    }
    good resources can be found at:
        - http://www.cecm.sfu.ca/personal/pborwein/PAPERS/P29.pdf
        - http://www.cs.berkeley.edu/~fateman/papers/factorial.pdf
        - https://gmplib.org/manual/Factorial-Algorithm.html
        - https://oeis.org/A000142/a000142.pdf
 */

// First, we should use a tail recursive function. This way we don't need to pop out the stack backward when we reach
// a terminal case. Tail recursive function gives good hints to compilers for optimizations. Tail recursive
// functions are written with the help of an helper function, often written in the scope of function we want to recurse on.
// BUT in REAL WORLD, if we want to get the best score in execution time we should not use recursion if the language
// doesn't optimize it and translate into imperative machine code. Haskell is a good language for this because it
//doesn't use a call stack for performing recursion.

// Second, The best algorithm to express factorial is known and called the dsc factorization (for divide swing and conquer).
// I am not a mathematician so i will just implement it.
// The method is described in http://www.cecm.sfu.ca/personal/pborwein/PAPERS/P29.pdf and well documented in
// https://oeis.org/A000142/a000142.pdf
// In short we can quickly determine the primes as well as the right power for each prime using a sieve approach.
// Computing each power can be done efficiently using repeated squaring, and then the factors are multiplied together.


// The naive factorial function
const factorialNaive = n => {
    if(Number.isNaN(n) || n < 0) return;
    //Helper function for tail recursive call
    const go = (acc, n) => {
        return n === 1 || n === 0 ? acc : go(acc * n, n - 1);
    };
    return go(1, n);
};

//Return the list of all odd number from 1 to n
const oddList = n => {
  return Array.from({length: n}, (v, k) => k + 1).filter(nb => nb % 2 !== 0);
};

// The medium factorial as explained in course 1.2.2
// Better than the naive factorial, but still not the best algorithm.
const factorialMedium = n => {
    //little function for getting the product of all odd numbers between [1..n]
    const oddProduct = n => {
        if(n === 0) return 0;
        let res = 1;
        n % 2 === 0 ? --n : n;
        for (let i = 1; i <= n; i += 2)
            res *= i;
        return res;
    };
    if(Number.isNaN(n) || n < 0) return;
    const go = (acc, n) => {
        //unfortunately we need bignum library for performing painless bitwise operation.
        return n === 1 || n === 0 ? acc : go(acc * oddProduct(n) * Math.pow(2, Math.floor(n / 2)), Math.floor(n / 2));
    };
    return go(1, n);
};

// TODO: this is the best version of the factorial function but enough time to finish.
// Find all prime number between 2 and n, using the well known Sieve of Eratosthenes.
// function primeList take a number n and return a list of prime numbers between 2 and n
const primeList = n => {
    //n is not number or is negative? go away!
    if(Number.isNaN(n) || n < 0) return;
    //a list of number from 2 to n
    const nbList = Array.from({length: n}, (v, k) => k + 1).slice(1);
    //we recursively drop non prime numbers from nbList
    const go = (acc, currIndex) => {
        if(currIndex > acc.length - 1) return acc;
        else {
            const rest = acc.filter(elem => elem === acc[currIndex] || elem % acc[currIndex] !== 0);
            return go(rest, ++currIndex);
        }
    };
    return go(nbList, 0);
};

//Find the prime factorization of a number
//function take a number as parameter and return a list of prime factors
const primeFactorization = n => {
    const primes = primeList(n);
    const go = (acc, remainder) => {
        //our remainder is prime no need to continue
        if(primes.includes(remainder)) {
            return [...acc, remainder]; // i know... but i like immutable data. GG es6 for this awful syntax.
        //remainder is not prime so we need to find a prime factor and continue recursion.
        } else {
            const primeFactor = primes.find((elem) => remainder % elem === 0);
            return go([...acc, primeFactor], remainder / primeFactor);
        }
    };
    return go([], n);
};


//Test  our factorial
const n = parseInt(process.argv[2]);
let start = process.hrtime();
let res = factorialNaive(n);
let end =  process.hrtime(start);
console.log(`factorialNaive(${n})      = ${res} => Execution time: ${end[0]}s ${end[1] / 1000000}ms`);

start = process.hrtime();
res = factorialMedium(n);
end = process.hrtime(start);
console.log(`factorialMedium(${n})     = ${res} => Execution time: ${end[0]}s ${end[1] / 1000000}ms`);

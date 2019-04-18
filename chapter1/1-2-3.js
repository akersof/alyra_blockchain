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

// First we should use a tail recursive function. This way we don't need to pop out the stack backward when we reach
// a terminal case. Tail recursive function gives good hints to compilers for optimizations. Tail recursive
// functions are written with the help of an helper function, often written in the scope of function we want to recurse on.

// Second The best algorithm to express factorial is known. I am not a mathematician so i will just implement it.
// The method is describe in http://www.cecm.sfu.ca/personal/pborwein/PAPERS/P29.pdf.

const factorial = n => {
    if(Number.isNaN(n) || n < 0) return;
    //Helper function for tail recursive call
    const go = (acc, n) => {
        return n === 1 || n === 0 ? acc : go(acc * n, n - 1);
    };
    return go(1, n);
};

//Test factorial
const n = parseInt(process.argv[2]);
console.log(factorial(n));

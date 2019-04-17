/*
    Ask an integer to a user and calculate the factorial of this number.
 */
const readline = require('readline');

//a simple recursive function for finding factorial of n
const factorial = n => {
    if(n === 0 || n === 1) return 1;
    else
        return n * factorial(n - 1);
};

//Calculate the number of operation, this factorial is an O(n) algorithm
const nbOfOperation = n => n -1;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const isValidInput = nb => !(Number.isNaN(parseInt(nb)));

rl.question('Enter a number: ', (answer) =>{
    let nb = parseInt(answer);
    if(!isValidInput(nb)) {
        console.log("Error: Invalid input, please enter an integer");
        rl.close();
    } else {
        console.log(`Starting process, it will take ${nbOfOperation(nb)} step for calculating !${nb}`);
        let res = factorial(nb);
        console.log(`!${nb}= ${res}`);
        rl.close();
    }
});


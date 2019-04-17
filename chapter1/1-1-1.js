/*
    Exercise 1.1.1:
    User has to find a number between 1 - 100
    run with: node 1-1-1.js
 */
const readline = require('readline');

const MIN = 1;
const MAX = 100;
const SECRET = Math.floor(Math.random() * MAX) + MIN;
const DEBUG_MODE = true;

// Read mode on readline at: https://nodejs.org/api/readline.html
// An easy way to build interactive prompt user interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('#############################################');
console.log('# GUESS MY NUMBER (ex 1.1.1 /Alyra course)  #');
console.log('#############################################');
if(DEBUG_MODE)
    console.log(`DEBUG: secret = ${SECRET}`);

//Recursive game loop.
const game = (turn) => {
    rl.question(`Choose a number between ${MIN} and ${MAX}: `, (answer) => {
        const nb = parseInt(answer);
        //Enter DEBUG to show the secret number to find
        if(DEBUG_MODE && answer.toUpperCase() === "DEBUG") {
            console.log(`DEBUG: secret = ${SECRET}`);
            game(turn);

        }
        else if(Number.isNaN(nb) || nb > MAX || nb < MIN) {
            console.log('Error: invalid input, try again.');
            game(turn);
        }
        else if(nb > SECRET) {
            console.log(`${nb} is too high`);
            game(++turn);
        }
        else if(nb < SECRET) {
            console.log(`${nb} is too low`);
            game(++turn);
        }
        else if(nb === SECRET) {
            console.log(`Congratulations you win in ${++turn} turn`);
            //close the prompt readline interface;
            rl.close();
        }
        else {
            console.log(`Error: Unhandled exception please fill a bug.`);
            rl.close();
        }
    });
};

//Launch the game here
game(0);



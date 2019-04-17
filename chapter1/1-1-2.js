/*
    Program should find a number entered by a user between MAX and MIN
    Recursive binary search is used
 */
const readline = require('readline');

// Read mode on readline at: https://nodejs.org/api/readline.html
// An easy way to build interactive prompt user interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MIN = 1;
const MAX = 100;
//Program starts the guessing process at the half of the range between MAX and MIN
const DEFAULT = Math.floor((MAX - MIN) / 2);

const isValidInput = nb => {
    return !(Number.isNaN(nb) || nb > MAX || nb < MIN);

};

//Recursive game loop
const game = () => {
    rl.question('Enter a number, CPU will try to find it using binary search: ', (answer) => {
        let secret = parseInt(answer);
        if (!isValidInput(secret)) {
            console.log('Error: invalid input, try again.');
            game();
        } else {
            //If input OK start the guessing
            guessing(secret, DEFAULT);
            //close the prompt
            rl.close();
        }
    });
};

//Recursive binary search
const guessing = (secret, guess) => {
    //Helper function to help in recursion, helpful for avoiding global variables
    const go = (secret, guess, min, max, count) => {
        count++;
        console.log(`Guess: ${guess} at turn ${count}`);
        //Little check if something is going wrong
        if(guess <= MIN || guess >= MAX) {
            console.log("Error: you can't go beyond the limit. ");
            console.log("Program aborted");
        } else if(guess === secret) {
            console.log(`Found ${secret} in ${count} turn${count > 1 ? "s" : ""}`);
        } else{
            //Binary search here
            return guess > secret ?
                  go(secret, Math.floor(guess - (guess - min) / 2), min, guess, count)
                : go(secret, Math.floor(guess + (max - guess) / 2), guess, max, count);}
    };
    return go(secret, guess, MIN, MAX, 0);
};


console.log('#############################################');
console.log('# CPU GUESS NUMBER (ex 1.1.2 /Alyra course) #');
console.log('#############################################');

//Launch the game here
game();
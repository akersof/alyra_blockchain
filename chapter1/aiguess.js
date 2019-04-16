/*  Program should find a number between MAX and MIN.
    Recursive binary search is used
 */


//The number to guess is passed as a command line argument.
let res = parseInt(process.argv[2]);
const MAX = 100;
const MIN = 1;
//We start our guesses at the MAX / 2;
const DEFAULT = Math.floor(MAX / 2);

const guessing = (res, guess) => {
    //Helper function
    const go = (res, guess, min, max, count) => {
        count++;
        console.log(`Guess: ${guess} at turn ${count}`);
        //Little check if something is going wrong
        if(guess <= MIN || guess >= MAX || count >= 20) {
            console.log("Error: you can't go beyond the limit. ");
            console.log("Program aborted");
        } else if(guess === res) {
            console.log(`Found ${res} in ${count} turn${count > 1 ? "s" : ""}`);
        } else{
            //Binary search here
            return guess > res ?
                  go(res, Math.floor(guess - (guess - min) / 2), min, guess, count)
                : go(res, Math.floor(guess + (max - guess) / 2), guess, max, count);}
    };
    return go(res, guess, MIN, MAX, 0);
};

guessing(res, DEFAULT);
/*
    Check id a word passed as a parameter is a palindrome
 */

const isPalindrome = str => {
    //Success terminal case
    if(str.length === 0 || str.length === 1) return true;
    //Failure terminal case
    else if(str[0] !== str[str.length -1]) return false;
    //str can still be a palindrome so far, let recurse a step more
    else
        return isPalindrome(str.substring(1,str.length - 1));
};


// The string to test is passed as a command line parameter
// e.g. node 1-1-3.js RADAR
let str = process.argv[2].split(" ").join("");

if (isPalindrome(str))
   console.log(`${str} is a palindrome`);
else
    console.log(`${str} is not a palindrome`);
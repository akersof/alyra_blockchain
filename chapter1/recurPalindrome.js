/*
    Check is a word passed as a parameter is a palindrome
 */

const isPalindrome = str => {
    //Success terminal case
    if(str.length === 0 || str.length === 1) return true;
    //Failure terminal case
    else if(str[0] !== str[str.length -1]) return false;
    else
        //Step
        return isPalindrome(str.substring(1,str.length - 1));
};


let str = process.argv[2].split(" ").join("");

if (isPalindrome(str))
   console.log(`${str} is a palindrome`);
else
    console.log(`${str} is not a palindrome`);
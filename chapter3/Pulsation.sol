pragma solidity ^0.5.7;

contract Pulsation {
    uint public beat;
    constructor () public {
        beat = 0;
    }
    function addBeat() public {
        beat++;
    }
}
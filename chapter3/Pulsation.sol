pragma solidity ^0.5.7;

contract Pulsation {
    uint public beat;
    string private message;
    constructor (string memory _message) public {
        beat = 0;
        message = _message;
    }
    function addBeat() public returns(string memory) {
        beat++;
        return message;
    }
}

contract Clock {
    Pulsation pulse;
    constructor(address pulseAddr) public{
        pulse = Pulsation(pulseAddr);

    }
    function doPulse() public {
        pulse.addBeat();
    }

}
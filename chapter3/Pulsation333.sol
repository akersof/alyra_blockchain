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
    Pulsation tic;
    Pulsation tac;
    string[] public balancer;
    Pulsation current;


    constructor() public{}

    function addTicTac(address pulseTic, address pulseTac) public {
        tic = Pulsation(pulseTic);
        tac = Pulsation(pulseTac);
        current = tic; // we start with tic

    }

    //alternates call between tic and tac contract
    function pulseBalancer() public {
        balancer.push(current.addBeat());
        if(current == tac) current = tic;
        else current = tac;
    }
}
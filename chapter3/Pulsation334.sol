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

    function addTicTac() public {
        tic = new Pulsation("tic");
        tac = new Pulsation("tac");
        current = tic; // we start with tic

    }

    //alternates call between tic and tac contract
    function pulseBalancer(uint times) public {
        for(uint i = 0; i < times; ++i) {
            balancer.push(current.addBeat());
            if(current == tac) current = tic;
            else current = tac;
        }
        current = tac;
    }
}
pragma solidity ^0.5.7;

contract Pulsation {
    uint private nonce;
    uint public beat;
    string private message;
    constructor (string memory _message) public {
        beat = 0;
        message = _message;
    }
    function addBeat() public returns(string memory) {
        uint rnd = random();
        beat++;
        if(rnd == 0) return "WHOOPS";
        else return message;
    }

    //naive implemention of randomness using timestamp, sender address, and a nonce.
    //TODO: need to check with xavier about randomness
    function random() internal returns (uint) {
        uint randomnumber = uint(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 10;
        nonce++;
        return randomnumber;
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

    function compareString(string memory str1, string memory str2) internal pure returns (bool) {
        if(bytes(str1).length != bytes(str2).length) return false;
        else return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function inspect() public view returns(uint256){
        for(uint i = 0; i < balancer.length; ++i) {
            if( compareString(balancer[i], "WHOOPS")) return i;

        }
    }

}
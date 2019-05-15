pragma solidity ^0.5.8;

import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Credibility {
    using SafeMath for uint256;
    mapping (address => uint256) public cred;
    bytes32[] private homework;

    modifier hasEnoughCred(uint value) {
        require(cred[msg.sender].sub(value) > 0, 'not enough cred');
        _;
    }

    modifier isStudent(address dst) {
        require(cred[dst] > 0, 'you can only transfer cred to other students');
        _;
    }

    function hashHomeWork(string memory url) public pure returns(bytes32){
        return keccak256(bytes(url));
    }

    function transfer(address dst, uint value) public hasEnoughCred(value) isStudent(dst) {
        cred[msg.sender] -= value;
        cred[dst] += value;
    }

    function send(bytes32 hashHomeWork) public returns(uint) {
        homework.push(hashHomeWork);
        uint reward;
        if(homework.length == 1) reward = 30;
        else if(homework.length == 2) reward = 20;
        else reward = 10;
        cred[msg.sender] += reward;
        return reward;
    }

}
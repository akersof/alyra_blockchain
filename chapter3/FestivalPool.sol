pragma solidity ^0.5.7;
contract FestivalPool {
    mapping (address => uint) managers;

    constructor() public {
        managers[msg.sender] = 100;

    }

    function transferManage(address manager, uint parts) public {
        managers[manager] += parts;
    }

    function isManager(address manager) public view returns(bool) {
        if(managers[manager] > 0) return true;
        return false;
    }
}
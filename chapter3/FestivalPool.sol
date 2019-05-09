pragma solidity ^0.5.7;
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/master/contracts/math/SafeMath.sol";

contract Management {
    using SafeMath for uint256;
    mapping (address => uint) managers;
    uint private costs;
    uint dateFestival;

    constructor() internal {
        managers[msg.sender] = 100;
        dateFestival = now;
    }

    function transferManage(address manager, uint parts) public {
        require(isManager(msg.sender), "you are not a manager.");
        require(managers[msg.sender] >= parts);
        managers[manager] += parts;
        managers[msg.sender] -= parts;
    }

    function isManager(address manager) public view returns(bool) {
        if(managers[manager] > 0) return true;
        return false;
    }

    function pay(address payable dest, uint amount) public {
        require(isManager(msg.sender));
        require(dest != address(0));
        require(amount > 0);
        dest.transfer(amount);
        costs.add(amount);
    }

    function () external payable {

    }

    function getReward() public {
        require(block.timestamp >= dateFestival + 2 weeks);
        require(isManager(msg.sender));
    msg.sender.transfer(address(this).balance)
    }

}

contract FestivalPool is Management {
    using SafeMath for uint256;
    mapping(address => bool) mob; //mob = people going to festival
    uint remainTickets = 100;
    string[] public sponsors;

    constructor() public {
        dateFestival = now;
    }

    function sponsor(string memory name) public payable {
        require(msg.value >= 30 ether, 'minimum 30 ethers for sponsoring');
        sponsors.push(name);
    }


    function buyTicket() public payable {
        require(!mob[msg.sender]);
        require(msg.value >= 500 finney,"Place à 0.5 Ethers");
        require(remainTickets > 0,"no more tickets");
        mob[msg.sender] = true;
        remainTickets--;
    }
}
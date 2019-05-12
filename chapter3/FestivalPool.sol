pragma solidity ^0.5.7;
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Associate {
    using SafeMath for uint256;

    mapping(address => uint) public associates;

    constructor () internal {
        associates[msg.sender] = 100; //start with 100% shares
    }

    modifier isAssociate(address user) {
        require(associates[user] > 0 , 'user is not an associate');
        _;
    }

    modifier isShareCorrect(uint equity) {
        require(associates[msg.sender] >= equity, 'not enough equity');
        _;
    }

    function share(address associate, uint equity)  public
    isAssociate(msg.sender)
    isShareCorrect(equity)
    {
        associates[associate] += equity;
        associates[msg.sender] -= equity;
    }

    function getBalance() public isAssociate(msg.sender) view returns (uint256){
        return address(this).balance;
    }

    modifier noNullAddress(address payable dst) {
        require(dst != address(0), 'dest is null address');
        _;
    }

    modifier enoughCash(uint amount) {
        require(amount > 0, 'negative amount');
        require(address(this).balance > amount, 'not enough ethers in smart contract');
        _;
    }


    function payBill (address payable dst, uint amount) public
    isAssociate(msg.sender)
    noNullAddress(dst)
    enoughCash(amount)
    {
        dst.transfer(amount);
    }

}

contract FestivalPool is Associate {
    using SafeMath for uint256;

    uint public creationDate;
    uint constant public DURATION = 1 weeks;
    uint public endDate;
    uint constant public MAX_TICKET = 500;
    uint public remaingTickets = MAX_TICKET;
    uint constant ticketPrice = 500 finney;
    mapping(address => uint) festivalgoers;
    string[] public sponsors;

    constructor() public {
        creationDate = now;
        endDate = creationDate.add(DURATION);
    }


    modifier isPriceCorrect(uint nbTickets) {
        if(nbTickets == 0) nbTickets = 1;
        require(msg.value >= ticketPrice.mul(nbTickets), 'not enough money sent');
        _;
    }

    modifier hasEnoughTickets (uint nbTickets) {
        require(remaingTickets >= nbTickets);
        _;
    }

    //anonymous sponsors
    function () external payable {}

    function sponsor(string memory name) public payable {
        require(msg.value >= 30 ether, 'at least 30');
        sponsors.push(name);

    }

    function buyTicket(uint nbTickets) public payable isPriceCorrect(nbTickets) hasEnoughTickets(nbTickets){
        if(nbTickets == 0) nbTickets = 1;
        festivalgoers[msg.sender] += nbTickets;
        remaingTickets -= nbTickets;
        //money back if too much money given... we are not thieves
        if(msg.value > ticketPrice.mul(nbTickets)) msg.sender.transfer( msg.value.sub(ticketPrice.mul(nbTickets)));
    }

}
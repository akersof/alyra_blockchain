pragma solidity ^0.5.7;
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Associate {
    using SafeMath for uint256;
    uint public creationDate;
    uint constant public DURATION = 1 weeks;
    uint public endDate;
    uint constant internal MAX_PAY_BILL_PER_DAY = 10 ether;
    mapping(uint => uint) payBillPerDay;
    mapping(address => uint) public associates;
    uint private remaingParts = 100;

    constructor () internal {
        associates[msg.sender] = 100; //start with 100% shares

        creationDate = now;
        endDate = creationDate.add(DURATION);
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
        require(address(this).balance >= amount, 'not enough ethers in smart contract');
        _;
    }

    modifier maxExpense(uint amount) {
        uint currentDay = (now - creationDate).div(60).div(60).div(24);
        require(payBillPerDay[currentDay].add(amount) <= MAX_PAY_BILL_PER_DAY, "maximum ethers per day spent already.");
        _;
    }

    modifier isFestivalFinished() {
        require(now > endDate, 'festival is not ended yet.');
        _;
    }

    function payBill (address payable dst, uint amount) public
    isAssociate(msg.sender)
    noNullAddress(dst)
    enoughCash(amount)
    maxExpense(amount)
    {
        dst.transfer(amount);
        uint currentDay = (now - creationDate).div(60).div(60).div(24);
        payBillPerDay[currentDay] += amount;
    }

    function getBenefit() public isAssociate(msg.sender) isFestivalFinished {
        remaingParts.sub(associates[msg.sender]);
        if(remaingParts == 0) selfdestruct(msg.sender);
        uint percentage = uint256(100).div(associates[msg.sender]);
        msg.sender.transfer(address(this).balance.div(percentage));
    }

}

contract Festival is Associate {
    using SafeMath for uint256;

    uint constant public MAX_TICKET = 500;
    uint public remaingTickets = MAX_TICKET;
    uint constant ticketPrice = 500 finney;
    mapping(address => uint) festivalgoers;
    string[] public sponsors;

    constructor() public {

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
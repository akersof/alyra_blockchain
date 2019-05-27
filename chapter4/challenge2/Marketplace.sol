pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;


import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Job {
    enum Status {OPENED, STARTED, CLOSED}
    struct Offer {
        address owner;
        uint reward;
        uint delay;
        string description;
        uint fame;
        Status status;
        address payable [] applicants ;
    }
    Offer public offer;
    constructor(address _owner, uint _reward, uint _delay, string memory _description, uint _minFame ) public {
        offer.owner = _owner;
        offer.reward = _reward;
        offer.delay = _delay;
        offer.description = _description;
        offer.fame = _minFame;          //required fame to apply this offer
        offer.status = Status.OPENED;
    }

    function applyOffer (address payable _address) public {
        offer.applicants.push(_address);
    }

}

contract Marketplace {
    using SafeMath for uint256;
    address owner;
    struct User {
        address addr;
        string name;
        string description;
        uint fame;
        bool isBlackListed;
    }
    mapping(address => User) private users ;
    Job[] public jobs ;

    constructor(address _owner) public {
        owner = _owner;
    }


    //Registration functions
    modifier onlyNotRegistered (address _address) {
        require(!isRegistered(_address), "User already registered");
        _;
    }

    modifier onlyRegistered (address _address) {
        require(isRegistered(_address), "User not registered");
        _;
    }

    function isRegistered(address _address) public view returns(bool){
        return users[_address].addr != address(0x0);
    }
    event Registration(address addr);
    function register(string memory _name,string memory _description) public onlyNotRegistered(msg.sender){
        users[msg.sender] = User(msg.sender, _name, _description, 1, false);
        emit Registration(msg.sender);
    }

    //Information functions
    function showUser(address _address) public view onlyRegistered(_address) returns(User memory) {
        return users[_address];
    }

    //Interactions functions
    //address _owner, uint _reward, uint _delay, string memory _description, uint _minFame
    function postJob(uint _reward, uint _delay, string memory _description, uint _minFame) public  onlyRegistered(msg.sender){
        jobs.push(new Job(msg.sender, _reward, _delay, _description, _minFame));
    }

    function applyJob(address _contract) public onlyRegistered(msg.sender) {
        for(uint i = 0; i < jobs.length; i++) {
            if(address(_contract) == address(jobs[i])) {
                jobs[i].applyOffer(msg.sender);
            }
        }
    }

    function showJobs() public view returns(Job[] memory){
        return jobs;
    }

}
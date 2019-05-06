pragma solidity ^0.5.7;

contract queue {
    uint256 public peopleCount = 0;
    mapping(uint => Person) public peoples;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _; // ???
    }

    struct Person{
        uint _id;
        string _firstName;
        string _lastName;
    }

    constructor() public  {
        owner = msg.send;
    }

    function addPerson(string memory _firstName, string memory _lastName) public onlyOwner{
        incrementCount();
        peoples[peopleCount] = Person(peopleCount, _firstName, _lastName);
    }

    function incrementCount() internal {
        peopleCount += 1;
    }
}

pragma solidity ^0.5.7;
contract Assembly {
    address[] members;

    function join() public {
        if(!isMember(msg.sender)) {
            members.push(msg.sender);
        }
    }

    function isMember(address user) public view returns(bool) {
        for(uint i = 0; i < members.length; i++) {
            if(members[i] == user) return true;
        }
        return false;
    }
}
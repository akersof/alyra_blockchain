pragma solidity ^0.5.7;
contract Assembly {
    address[] members;
    string[] proposals;
    uint[] forVotes;
    uint[] againstVotes;
    uint[] blankVotes;
    // internal constant
    int constant forVote = 1;
    int constant againstVote = -1;
    int constant blankVote = 0;

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

    function propose(string memory proposal) public {
        if(isMember(msg.sender)) {
            proposals.push(proposal);
            forVotes.push(0);
            againstVotes.push(0);
            blankVotes.push(0);
        }
    }
    // TODO: need more test on indexProposal, need to be in array range
    function vote(uint indexProposal, int choice) public {
        if(isMember(msg.sender)) {
            if(choice == forVote) forVotes[indexProposal]++;
            else if(choice == againstVote) againstVotes[indexProposal]++;
            else blankVotes[indexProposal]++;
        }
    }
    // TODO: need more test on indexProposal, need to be in array range
    function count(uint indexProposal) public view returns(int) {
        return int(forVotes[indexProposal]) - int(againstVotes[indexProposal]);
    }

}
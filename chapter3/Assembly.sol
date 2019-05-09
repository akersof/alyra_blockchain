pragma solidity ^0.5.7;
contract Assembly {
    struct Proposal{
        string description;
        uint forVotes;
        uint againstVotes;
        uint blankVotes;
        uint maxDate;
        mapping (address => bool) aVote;
    }
    Proposal[] proposals;

    address[] members;

    // internal constant
    int constant forVote = 1;
    int constant againstVote = -1;
    int constant blankVote = 0;
    uint constant MAX_TIMESTAMP = 604800; // 1 week

    function join() public {
        require(!isMember(msg.sender), "you are already a member");
        members.push(msg.sender);
    }

    function isMember(address user) public view returns(bool) {
        for(uint i = 0; i < members.length; i++) {
            if(members[i] == user) return true;

        }
        return false;
    }

    //check if a user already voted for a proposal
    function didVote(uint indexProposal, address user) public view returns(bool) {
        require(indexProposal < proposals.length, "out of range index");
        return proposals[indexProposal].aVote[user];
    }

    function propose(string memory proposal) public {
        require(isMember(msg.sender), "You have to be a member to submit a proposal");
        proposals.push(Proposal(proposal, 0, 0, 0, now + MAX_TIMESTAMP));
    }

    function vote(uint indexProposal, int choice) public {
        require(indexProposal < proposals.length, "out of range index");
        require(isMember(msg.sender), "you have to be a member to vote on a proposal");
        require(!didVote(indexProposal, msg.sender), "you already voted for this proposal");
        require(now <= proposals[indexProposal].maxDate, "Proposal time expired");
        if(choice == forVote) proposals[indexProposal].forVotes++;
        else if(choice == againstVote) proposals[indexProposal].againstVotes++;
        else proposals[indexProposal].blankVotes++;
        proposals[indexProposal].aVote[msg.sender] = true;
    }
    function count(uint indexProposal) public view returns(int) {
        require(indexProposal < proposals.length,"out of range index");
        return int(proposals[indexProposal].forVotes) - int(proposals[indexProposal].againstVotes);
    }

}
// TODO: create a member struct
// TODO: The contract creator is no more and administrator but an ower his rights can't be revoked
// TODO: administor election follows  democracy rules
// TODO: apparently delete array[index] create gap inside array, find a way to solve this.

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
    //should use a struct for members cause this is a big mess actually
    address[] members;
    address[] administrators;
    string public assemblyName;
    mapping(address => uint) warning; //counting warning on user, is >= 2 put it in blacklist
    address[] blackList;

    // internal constant
    int constant forVote = 1;
    int constant againstVote = -1;
    int constant blankVote = 0;
    uint constant MAX_TIMESTAMP = 604800; // 1 week

    constructor(string memory name) public{
        assemblyName = name;
        administrators.push(msg.sender);
    }

    //admin functions
    function isAdmin(address user) public view returns(bool) {
        for(uint i = 0; i < administrators.length; i++) {
            if(administrators[i] == user) return true;
        }
        return false;
    }

    //all administrators can promote an address for admin rights
    function addAdmin(address user) public {
        require(isAdmin(msg.sender), 'you are not an administrator');
        administrators.push(user);
    }

    //resgination
    function resign() public {
        require(isAdmin(msg.sender), 'you are not an administrator');
        for(uint i = 0; i < administrators.length; ++i) {
            if(administrators[i] == msg.sender) delete administrators[i];
        }
    }

    function deleteProposal(uint indexProposal) public {
        require(isAdmin(msg.sender), 'you are not an administrator');
        require(indexProposal < proposals.length, "out of range index");
        delete proposals[indexProposal];
    }

    //warn a user, if warning >= 2 delete it and put it in blackList
    function warningUser(address user) public {
        require(isAdmin(msg.sender), 'you are not an administrator');
        require(isMember(user));
        warning[user]++;
        if(warning[user] >= 2) {
            //put user in blackLists
            blackList.push(user);
            for(uint i = 0; i < members.length; ++i) {
                if(members[i] == user) delete members[i];
            }
        }
    }

    //members functions
    function join() public {
        require(!isMember(msg.sender), "you are already a member");
        require(!inBlackList(msg.sender), "you are in black list, you can't join anymore");
        members.push(msg.sender);
    }

    function inBlackList(address user) public view returns(bool) {
        for(uint i = 0; i < blackList.length; i++) {
            if(blackList[i] == user) return true;
        }
        return false;
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
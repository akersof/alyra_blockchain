pragma solidity ^0.5.7;

contract Administrators {
    mapping(address => bool) internal administrators;
    modifier onlyAdmin() {
        require(administrators[msg.sender] == true, 'you have to be an administrators to perform this task.');
        _;
    }
    function addAdmin(address user) internal onlyAdmin {
        administrators[user] = true;
    }
    //administrator self resignation
    function resignAdmin() internal onlyAdmin {
        administrators[msg.sender] = false;
    }


}

contract Assembly is Administrators{
    enum Vote {Yes, No, Blank}
    uint constant DELAY = 604800; // 1 week
    address public owner;
    string public assemblyName;
    mapping(uint => Proposal) public proposals;
    uint proposalsCount;
    mapping(address => Member) public members;

    struct Proposal{
        uint id;
        bool active;
        string description;
        uint forVotes;
        uint againstVotes;
        uint blankVotes;
        uint delay;
        mapping (address => bool) aVote;
    }
    struct Member {
        address addr;
        bool isAdmin;
        uint warning; //number of warning > 2 = iBlackListed true
        bool isBlackListed;
    }

    constructor(string memory name) public{
        assemblyName = name;
        owner = msg.sender;
    }


    modifier onlyMember() {
        require(members[msg.sender].addr != address(0) && members[msg.sender].isBlackListed == false,
            'you have to be a member to perform this task.');
        _;
    }

    modifier onlyActiveProposal(uint indexProposal) {
        require(proposals[indexProposal].active == true, "this proposal doesn't exists.");
        _;
    }

    function deleteProposal(uint indexProposal) public onlyAdmin onlyActiveProposal(indexProposal){
        proposals[indexProposal].active = false;
    }


    //warn a user, if warning >= 2 blackList the user
    function warningUser(address user) public onlyAdmin {
        require(members[user].addr != address(0), 'user not a member');
        require(members[user].isBlackListed != true, 'user already black listed');
        members[user].warning++;
        if(members[user].warning >= 2) members[user].isBlackListed = true;

    }

    //members functions
    function join() public {
        require(members[msg.sender].addr == address(0), 'you are already a member');
        members[msg.sender].addr = msg.sender;

    }


    //check if a user already voted for a proposal
    modifier didNotVote(uint indexProposal){
        require(indexProposal <= proposalsCount, "out of range index");
        require(proposals[indexProposal].aVote[msg.sender] == false, "you already voted for this proposal");
        _;
    }

    modifier onlyProposalExists(uint indexProposal) {
        require(indexProposal <= proposalsCount, 'out of range index proposal');
        _;
    }

    modifier isProposalOpen(uint indexProposal) {
        require(now <= proposals[indexProposal].delay, 'this proposal is closed, too late.');
        require(proposals[indexProposal].active == true, 'this proposal is not active anymore');
        _;
    }

    function propose(string memory proposal) public onlyMember{
        proposalsCount++;
        proposals[proposalsCount] = Proposal(proposalsCount, true, proposal, 0, 0, 0, now + DELAY);
    }


    function vote(uint indexProposal, Vote vote) public
    onlyProposalExists(indexProposal)
    onlyMember
    isProposalOpen(indexProposal)
    didNotVote(indexProposal)
    {
        if(vote == Vote.Yes) proposals[indexProposal].forVotes++;
        else if(vote == Vote.No) proposals[indexProposal].againstVotes++;
        else proposals[indexProposal].blankVotes++;
        proposals[indexProposal].aVote[msg.sender] = true;
    }

    function count(uint indexProposal) public onlyProposalExists(indexProposal) view returns(int){
        return int(proposals[indexProposal].forVotes) - int(proposals[indexProposal].againstVotes);
    }

    function toString(address x) internal pure returns (string memory) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }

    //Assembly administrator election
    function election(address user) public onlyMember{
        require(administrators[user] == false, 'user is already an administrator');
        propose(toString(user));
    }

}
pragma solidity ^0.5.7;

contract SceneOuverte {
    string[12] public passagesArtistes;
    uint public freeSlot = 12;
    uint tour;
    //memory = this string doesn't exist int the blockchain and is stored in memory only
    function sInscrire(string memory nomDArtiste) public {
        require (freeSlot > 0);
        passagesArtistes[12 - freeSlot] = nomDArtiste;
        freeSlot--;
    }
    function passerArtisteSuivant() public{
        tour++;
    }
    function artisteEnCours() public view returns (string memory) {
        require(tour < 12 - freeSlot);
        return passagesArtistes[tour];
    }
}

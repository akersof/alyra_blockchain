pragma solidity ^0.5.7;
contract SceneOuverte {
    string[12] passagesArtistes;
    uint creneauxLibres = 12;
    uint tour;

    function sInscrire(string memory nomDArtiste) public {
        require(creneauxLibres > 0);
        passagesArtistes[12-creneauxLibres] = nomDArtiste;
        creneauxLibres -= 1;

    }

    function passerArtisteSuivant() public {
        require(tour < passagesArtistes.length);
        tour += 1;
    }

    function artisteEnCours () public view returns (string memory) {
        if(tour < passagesArtistes.length - creneauxLibres){
            return passagesArtistes[tour];
        } else {
            return "FIN";
        }
    }
}
const SceneOuverte = artifacts.require("SceneOuverte");

module.exports = function(deployer) {
    deployer.deploy(SceneOuverte).then(
        SceneOuverte.sInscrire("bozo");
    );
};

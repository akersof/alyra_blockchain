let nbEth = parseInt(process.argv[2]);      // nb ETH in deposit
let initEth = nbEth;
let courEth = parseInt(process.argv[3]); //cour de l'ET

let investissement = nbEth * courEth;
let colat = parseInt(process.argv[4]);

let dai = (nbEth * courEth / colat)* 100;

console.log("nbEth", nbEth)
console.log("courEth", courEth)
console.log("colat", colat)
console.log("dai", dai)

console.log("** le cours à triplé ***");

nbEth +=  (dai / courEth);

console.log("nbrEth après achat ", nbEth );

courEth *= 3;
console.log("le cours * 3 ",courEth );

let remboursement = dai / courEth;
console.log("Remboursement  ",remboursement.toFixed(2) );

nbEth -=remboursement;
console.log("Dépot nbEth  ", nbEth.toFixed(2) );

let CA = nbEth  ; // dépot en ETH
console.log("Chiffre d'affaire ", CA.toFixed(2) ,'ETH' );

let gainNet = CA - initEth;

console.log("gain Net après", gainNet.toFixed(2) ,'ETH' );

gainNet *= courEth;

console.log("gainNet ", gainNet.toFixed(2) ,'$' );

if (CA >= investissement * 3 ){

    console.log("on se retire");

}else{

    console.log("Go print du Dai");
}
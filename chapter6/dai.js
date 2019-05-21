//const process  = require('process');

const LIQUIDATION = 150;

let nbEth = process.argv[2];      // nb ETH in deposit
let courEth = process.argv[3]; //cour de l'ET
let dai = process.argv[4]; //number of generated DAI

let colat = (nbEth * courEth / dai) * 100; //percentage
let liquidCour = ((150  / 100) * dai) / nbEth; // en dollar

const msg1 = "###################################################\n" +
            "#################LIQUIDATOR########################\n" +
            "###################################################\n";

const msg2 = "###################################################\n" +
             "#################SPECULATOR########################\n" +
             "###################################################\n";

console.log(msg);
console.log("colat:", colat, "%");
console.log("liquidCour", liquidCour, " dollars");


let remboursement = dai / liquidCour;
let remaining = nbEth - remboursement;
console.log("apres remboursement de la dette:", remaining.toFixed(2), " ETH" );
let dixpourcent = (dai / 10) / liquidCour ;
remaining -= dixpourcent;
console.log("apres pool : ", remaining.toFixed(2), "ETH");
let troispourcent = (dai * 0.03) / liquidCour;
remaining -= troispourcent;
console.log('apres 3 pourcent ', remaining.toFixed(2), "ETH");
console.log((remaining * liquidCour).toFixed(2) , 'dollars remaining');






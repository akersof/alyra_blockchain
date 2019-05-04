const express = require('express');
const app = express();
const ejs=require('ejs')
const fs=require('fs')
app.set('view engine', 'ejs');
//utilisation du repertoire 'public' pour servir les pages web
app.use(express.static('public'));
app.listen(8080);
console.log("BLOCKCHAIN POWER")

//function de TEST 
/*app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});*/

//Enlever l'appel du browser vers favicon
app.get('/favicon.ico', (req, res) => res.status(204));

//Recuperer les transactions à partir du fichier mockdata.json sur le server //appel par transactionCollection
app.get('/transactions',function(req,res){
    var trans=fs.readFileSync('mockdata.json');
    var jsontrans=JSON.parse(trans)
    console.log('trans',trans);
    var translib=JSON.stringify(jsontrans)
    console.log('translib',translib);
    res.send(translib)
})


//Example page de test
app.get('/', function(req, res) {
    res.render('Transaction', {
    });
});

//Example page de test
app.get('/index/bloc', function(req, res) {
    res.render('bloc', {
    });
});
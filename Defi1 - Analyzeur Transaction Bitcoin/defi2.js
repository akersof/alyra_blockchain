const express = require('express');
const app = express();
const ejs=require('ejs')
const fs=require('fs')
const bitcoinClient=require('./bitcoin-rpc')
const Cible=require('./cible')
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
app.get('/getDifficulte',function(req,res){
    //var trans=fs.readFileSync('mockdata.json');
    
    let coeff=req.query.coefficient
    let exposant=req.query.exposant
    let cible=Cible.constructionCible(coeff,exposant)
    //console.log("cible construite",cible)
    let diff=Cible.calculerDifficulte(cible)
    //console.log("<<<<<<<<<<<<<<difficulte finie>>>>>>>>>>>>>>>><",diff)
    let result={difficulte:diff}
    res.send(result)
})
app.get('/decodeRawTransaction',function(req,res){
    //var trans=fs.readFileSync('mockdata.json');
    
    let bclient= new bitcoinClient.BitcoinClient()
    let exp=req.query.hex
    bclient.decodeRawTransaction(exp).then(function(data){
        //console.log(data)
        //var jsontrans=JSON.parse(data)
        var translib=JSON.stringify(data)
        res.send(translib)                                             
    });
  
})

app.get('/blocks',function(req,res){
    //var trans=fs.readFileSync('mockdata.json');
    
    let bclient= new bitcoinClient.BitcoinClient()
    bclient.getLastBlock(10).then(function(data){
        //console.log(data)
        //var jsontrans=JSON.parse(data)
        var blocklib=JSON.stringify(data)
        res.send(blocklib)                                             
    });
  
})



//Example page de test
app.get('/', function(req, res) {
    res.render('Transaction', {
    });
});

app.get('/index/convertiseur', function(req, res) {
    res.render('convertiseur', {
    });
});
 
app.get('/index/index2', function(req, res) {
    res.render('index2', {
    });
});

// app.get('/index/bloc', async function(req, res) {
//     console.log("index bloc",req.query, req.query["id"])
//     let id=Number(req.query["id"])
//     console.log("id ===>",id)
//     // let id = req.query["id"]
//     var bclient= new bitcoinClient.BitcoinClient()
//     let blocjson = await bclient.getBlocByHeight(id)
//     let txjsonList = await bclient.getTransactionsByBlockHeight(id)
//     console.log("blocjson ===>",blocjson)
//     console.log("****************** txjsonList *******",txjsonList)
   
//     res.render('bloc',[blocjson,txjsonList])

// });


app.get('/index/bloc', async function(req, res) {
    console.log("index bloc",req.query, req.query["id"])
    let id=Number(req.query["id"])
    console.log("id ===>",id)
    // let id = req.query["id"]
    var bclient= new bitcoinClient.BitcoinClient()
    let blocjson = await bclient.getBlocByHeight(id)
    let txjsonList = await bclient.getTransactionsByBlockHeight(id)

    let json = {
        hashBloc: blocjson['hash'],
        txjsonList: txjsonList,
        id: id
    };

    // res.send(json);
    res.render('bloc',json)

});
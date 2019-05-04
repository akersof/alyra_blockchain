//Chargement des dépendances front
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/public',
    packages: [],
    paths: {
          //'crypto-js': 'path-to/bower_components/crypto-js/crypto-js'
            'backbone':'../backbone-min',
            'underscore':'../underscore-min',
            'jquery':'../jquery-3.4.0.min',
            'boiteOutils':'../boiteOutils',
    },
    shim: {
        'backbone':{
            deps : ['jquery','underscore'],
            exports : 'Backbone'
            }}
});

// Main app logic.
requirejs(['jquery','backbone','underscore','boiteOutils'],
function($,backbone,_,boiteOutils) {

var blockModel=backbone.Model.extend({url:'/blocks'})

var blockCollection=backbone.Collection.extend({
    model:blockModel,
    url:'/blocks',
    parse:function(data){
            var self=this;
            data.forEach(function(element){let block=new self.model(element);self.add(block)})
            return data}
})

var blockView=backbone.View.extend({

    templateblock:_.template("<tr><td><%= height %></td><td><%= time %></td><td><%= nTx %></td><td><%= size %></td><td><a href='./index/bloc?id=<%= height %>'><button type='button' class='btn btn-warning'>Voir</button></a></td></tr>"   
    
   
    ),

    initialize:function(){
        var self=this
        this.collection= new blockCollection()
    },
    render:function(){
        var self=this
        this.collection.fetch({
            success:function(data){
                for(var i =0;i<self.collection.models.length; i++){
                    console.log("block data",data,self.collection.models)
                    let height=self.collection.at(i).attributes["height"];
                    let time=self.collection.at(i).attributes["time"];
                    let nTx=self.collection.at(i).attributes["nTx"];
                    let size=self.collection.at(i).attributes["size"];
                    let weight=self.collection.at(i).attributes["weight"];
                    $('#block').append(self.templateblock({height:height,time:time,nTx:nTx,size:size,weight:weight}));

                }}})}
})
    
    
//Creation d'un model et d'une collection de transactions
var transactionModel=backbone.Model.extend({
    url:'/transactions'
})
    
var transactionCollection = backbone.Collection.extend({
    data:[],
    initialize: function(){
        //this.fetch();console.log("transactions fetch",this.models)
    },
    model:transactionModel,
    url:'/transactions',
    parse:function(data){
            var self=this;
            data.forEach(function(element){let transi=new self.model(element);self.add(transi)})
            return data},
})

var transactionsView=backbone.View.extend({
   /* el:'#transactions',
    templateHeader:_.template("<div id='entete'><h2><strong><%= hash %></strong></h2><p>HEXA VALUE <%= hex %></p></div>"                          
                       ),*/
    templateHeader:_.template("<tr><td><%= hash %></td></td>"                          
                       ),


    
    initialize:function(){
        var self=this
        this.collection= new transactionCollection()
    },
    render:function(){
        var self=this
        this.collection.fetch({
            success:function(){
                for(var i =0;i<self.collection.models.length; i++){
                    
                 
                    let hash=self.collection.at(i).attributes["hash"];
                    let hex=self.collection.at(i).attributes["hex"];
                    let vin=self.collection.at(i).attributes["vin"];
                    let vout=self.collection.at(i).attributes["vout"];
             
                    $('#hash').append(self.templateHeader({hash:hash}));
    
            }}
        })
    }    
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////
var viewTransaction=new transactionsView();
console.log("view transaction",viewTransaction)
viewTransaction.render();

var viewBlocks=new blockView();
viewBlocks.render();
console.log("view blocks",viewBlocks)
    
    
////////////////////////////////////////////////////////////////////////////
    console.log("It is up")
    //DecodeRawTransaction
    backbone.Events.on('submitHexReader', function(){ 
        let input =  document.getElementById("hexReader").value;
        let q={"hex":input}
        console.log(input)
        // $('#transactionContainer').innerHTML= ''
        let templateHash = _.template("<p style='border:1px solid #FFD700; padding:20px; text-align:left;'>Raw Transaction Decode </br> Hash: <%= txid %><br/>Locktime : <%= locktime %></br> Version: <%= version %> </br></br> INPUT: </br> TXid:<%= input.txid %> </br></br> OUTPUT: </br> Value: <%= output.value %> </p>")
        
         //let templateHash = _.template("<p style='border:1px solid #FFD700; padding:20px;'>Raw Transaction Decode </br> Hash: <%= txid %><br/>Locktime : <%= locktime %></br> Version: <%= version %> </br> INPUT: <%= vin %> </br> TXid:<% input["txid"]%> OUTPUT: <%= vout %> </p>")
        
        $.ajax({
            url:"/decodeRawTransaction",
            type:'GET',
            data:q
        }).done(function(result){
            console.log("done decode",result)
            var reader=JSON.parse(result)
            let txid = reader['txid'];
            let locktime = reader['locktime'];
            let version = reader['version'];
            let vin=JSON.stringify(reader['vin'])
            let vout=JSON.stringify(reader['vout'])
            let _vin=vin.substr(1,vin.length-2)
            let _vout=vout.substr(1,vout.length-2)
            
            let input=JSON.parse(_vin)
            let output=JSON.parse(_vout)
            
            $('#txid').html(txid);
            $('#txid2').append(templateHash({txid:txid,locktime:locktime, version:version, vin:_vin,vout:_vout,input:input,output:output}));
            // console.log(reader)
           
        })
        
    });
    //HexToDec
    backbone.Events.on('submitHex', function(){ 
        let input =  document.getElementById("inputHex").value;
        let calc= boiteOutils.HexToDec(input);
        let result=calc;console.log(result);            
    });
    //HexToDec
    backbone.Events.on('submitDec', function(){ 
        let input =  document.getElementById("inputDec").value;
        let calc= boiteOutils.DecToHex(input);
        let calc2=boiteOutils.dec2hex(input) 
        console.log("Result 1",calc,"result 2",calc2);            
    });
    //DecToLittleEndian
    backbone.Events.on('submitLE', function(){ 
        let input =  document.getElementById("inputLE").value;
        let calc= boiteOutils.convertToLE(input);
        let result=calc;console.log(result);            
    });
    //VarInt to Dec
    backbone.Events.on('submitVarInt', function(){ 
        let input =  document.getElementById("inputVarInt").value;
        // let calc= boiteOutils.convertVarInt(input);
        let calc= boiteOutils.varInt2Decimal(input);
        $('#result').html(calc)
        // let result=calc;console.log(result);            
    });


    //Convert Bits to target
    backbone.Events.on('submitCibleBits', function(){ 
        let input =  document.getElementById("inputCibleBits").value;
        // let calc= boiteOutils.convertVarInt(input);
        let calc= boiteOutils.bits2Target(input); 
        $('#result').html(calc)
        // let result=calc;console.log(result);            
    });


    //Cible to Difficult
    backbone.Events.on('submitDifficulty', function(){ 
        //let coeff =  document.getElementById("inputCoefficient").value;
        let target = document.getElementById("inputDifficulty").value;
        //let q={coefficient:coeff,exposant:exposant}
        let diff=boiteOutils.difficulty(target)
        $('#result').html(diff)
                   
    });
    
//Gestion des clicks    
//Click dans BoiteOutils    
    //Hex to Dec
    $(document).on('click', '#submitHex', function(event){
        console.log("Event")
        Backbone.Events.trigger('submitHex');
    });
    //Dec to Hex
    $(document).on('click', '#submitDec', function(event){
        console.log("Event")
        Backbone.Events.trigger('submitDec');
    });
    //Dec to LittleEndian
     $(document).on('click', '#submitLE', function(event){
        console.log("Event")
        Backbone.Events.trigger('submitLE');
    });
    //Varint to Dec
     $(document).on('click', '#submitVarInt', function(event){
        console.log("Event")
        Backbone.Events.trigger('submitVarInt');
    });

    //Convert Bits to target
       $(document).on('click', '#submitCibleBits', function(event){
        console.log("Event")
        Backbone.Events.trigger('submitCibleBits');
    });


    //Difficulte Cible
     $(document).on('click', '#submitDifficulty', function(event){
        console.log("Event")
        Backbone.Events.trigger('submitDifficulty');
    });
    
    
    //Click dans hexReader
    $(document).on('click', '#submitHexReader', function(event){
        console.log("Event HexReader")
        Backbone.Events.trigger('submitHexReader');
    });
    
    
})
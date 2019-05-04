//Chargement des dépendances front
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/public',
    packages: [],
    paths: {
          //'crypto-js': 'path-to/bower_components/crypto-js/crypto-js'
            'backbone':'/backbone-min',
            'underscore':'/underscore-min',
            'jquery':'/jquery-3.4.0.min'
    },
    shim: {
        'backbone':{
            deps : ['jquery','underscore'],
            exports : 'Backbone'
            }}
});

// Main app logic.
requirejs(['jquery','backbone','underscore'],
function($,backbone,_) {
//Message de bienvenue
console.log("lets start")

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
    // el:'#hash',
    templateHeader:_.template("<tr><td><%= hash %></td></td>"                          
                       ),

    // templateHeader2:_.template("<tr><td><%= hex %></td></tr>"                        
    //                    ),

    initialize:function(){
        var self=this
        this.collection= new transactionCollection()
    },

    render:function(){
        var self=this
        this.collection.fetch({
            success:function(){
                for(var i =0;i<self.collection.models.length; i++){

                    console.log("i =>",i)
                   
                    
                    let hash=self.collection.at(i).attributes["hash"];
                    let hex=self.collection.at(i).attributes["hex"];
                    let vin=self.collection.at(i).attributes["vin"];
                    let vout=self.collection.at(i).attributes["vout"];

                    console.log("hash =>",hash)

                $('#hash').append(self.templateHeader({hash:hash}));
                // $('#hex').append(self.templateHeader2({hex:hex}));
                //stop
                // self.$el.append(self.templateCollection({collection : self.collection}));

                // self.$el.append(self.templateBody({vin:JSON.stringify(vin),vout:JSON.stringify(vout)}));    
                    //utiliser.html pour remplacer la valeur, append pour ajouter à la liste
                    //self.$el.html(self.templateHeader({hash:hash,hex:hex}));
            }}
        })
    }    
})

var view=new transactionsView();
console.log("view transaction",view)
view.render();    

//end require    
})
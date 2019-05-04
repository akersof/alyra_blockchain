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
    el:'#transactions',
    templateHeader:_.template("<div id='entete'><h2><strong><%= hash %></strong></h2><p>HEXA VALUE <%= hex %></p></div>"                          
                       ),
    templateBody:_.template("<div id='corps'><h3><strong>V IN</strong></h3><%= vin %><p>VOUT<%= vout %></p></div>"),
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
                //Write in the DOM
               // var temp = _.template($('#headerTransaction').html(), {transaction: self.collection.at(i)});
                    //$("#transactions").html(template);
                self.$el.append(self.templateHeader({hash:hash,hex:hex}));
                self.$el.append(self.templateBody({vin:JSON.stringify(vin),vout:JSON.stringify(vout)}));    
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
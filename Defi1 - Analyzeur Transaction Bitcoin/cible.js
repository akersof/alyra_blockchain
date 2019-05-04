exports.constructionCible=function(coefficient,exposant){
        
    let cible = coefficient*2**(8*(exposant-3))
    console.log("cible",cible)
    
    //Transformation de la cible sur 256 bits
/*    let cibleHexa=cible.toString(16)
    console.log("cible hexa: ",cibleHexa)
    //get length of cible hexa:
    let l=cibleHexa.length
    //build Buffer with 256 bits at 0 and fill from cible.lenght 
    let target=new Buffer.allocUnsafe(32).fill(0)
    let cibleBuf=target.fill(cibleHexa,32-l)
    console.log("Cible BUFFER",target)
    let found=target.indexOf("9")
    console.log(found, l)
    let found1=cibleBuf.indexOf("9")
    console.log(found1, l)*/
    
    return cible
    
};


exports.cibleAtteinte=function(cible,hash){

    //NODEJS EXAMPLE
/*    const buf = Buffer.allocUnsafe(6);
    buf.writeIntBE(0x1234567890ab, 0, 6);
    console.log("<<<<<<<<<<<<<<<<<buf>>>>>>>>>>>>>>>>>>><<",buf);*/
    //hash is already a buffer from randomBytes output
    
    console.log("cible_bytes: ",cible, "cible_length",cible.length, "hash_bytes: ",hash, hash.length)
    //comparaison bit par bit
    let x=Buffer.compare(hash,cible)
    if(x==-1){
        console.log("x",x,"\n")
        console.log("<<<<<<<<<<<<<<<<<<<Done>>>>>>>>>>>>>>>>>>>><<< ", "hash: ",hash," cible: ",cible,"\n");return true
    }
    else{
        return false
    }
};
exports.calculerDifficulte=function(cible){
    
    let ciblemax=(2**16-1)*2**208
    //lecture d'un entier signé?
    console.log("<<<<<<<<<<MA CIBLE>>>>>>>>>>>>>",typeof(cible),"  ", cible)
    if(typeof cible==='object'){console.log("not  a number in cible");var cibleI=cible.readIntBE()}
    else{var cibleI=cible; console.log("Number in cible:",cibleI)}
    
    console.log("cibleMax",ciblemax,"et", "cible: ",cible,"cible signed integer: ", cibleI)
    if(cibleI!=0){var d=ciblemax/cibleI}
    else{console.log("cible???",parseInt(cible));var d=ciblemax/cible}
    
    console.log("difficulte de: ",d)
    return d
}
//generation du hash sur 256 bits
const crypto=require('crypto')

exports.essai=function(c,e){        
    // generate random number of 256 bits
    let h=crypto.randomBytes(32)
    let cible=constructionCible(c,e)
    let v=cibleAtteinte(cible,h)
    if(v){return true}else{essai(c,e)}
}
//TEST
//essai(4,3)

//TEST
//essai(245345,16)
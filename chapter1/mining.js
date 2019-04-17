const hachage = str => {
  let condensat = 0;
  for (let i = 0; i< str.length; ++i){
    condensat = (condensat + str.charCodeAt(i) * 3** i) % 65536
  }
  return condensat 
};


const minage =  (str, target) => {
  console.log("Mining. Target is", target)
  nonce=0
  do {
    nonce = nonce +1
    chaineCandidate = str + nonce
    condensat = hachage(chaineCandidate)
    console.log("nonce = ",nonce,"Call on [", chaineCandidate, "] condensat = ",condensat, )
  } while(condensat>=target)
  console.log(">>> found nonce", nonce)
}

// Just a test
minage("picsou", 10000);

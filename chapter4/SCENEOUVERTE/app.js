let user = {}
let dapp = {}

function ajouterArtiste(){
  let artiste = document.getElementById("nomartiste")
  dapp.ContratSigner.sInscrire(artiste.value);

}

async function connectMetamask() {
  try {
    const addresses = await ethereum.enable()
    user.address = addresses[0]

    const provider = new ethers.providers.Web3Provider(ethereum)
    let Contrat=new ethers.Contract(contractAddress, contractABI, provider)
    let ContratSigner=Contrat.connect(provider.getSigner(user.address))

    dapp = { provider, Contrat, ContratSigner}

    console.log("DApp ready: ", dapp)
    console.log("User ready: ", user)


  } catch(err) {
    console.error(err);
  }
}

( async function () {
  await connectMetamask();
  dapp.provider.getNetwork().then(
      ntw => {document.getElementById("Network").innerHTML = JSON.stringify(ntw);
        console.log(ntw)
      });

  let cr = await dapp.Contrat.creneauxLibres();
  document.getElementById('cr').innerHTML = cr;

  let curart = await dapp.Contrat.artisteEnCours();
  document.getElementById("curartiste").innerHTML = curart;

  let lst = await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => dapp.Contrat.passagesArtistes(index)));
  document.getElementById('lstartiste').innerHTML = lst;


}());


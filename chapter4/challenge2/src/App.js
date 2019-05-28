import React, {useState, useEffect} from 'react';
import './App.css';
import {useMetaMask} from "./hooks/metamask";
import {Dapp} from "./components/dapp";
import DappContext from "./dappContext";

function App(props) {
    const [dapp, loading] = useMetaMask();
  return (
      <DappContext.Provider value={dapp}>
          {loading ? "loading..." : <Dapp className="App"/>}
      </DappContext.Provider>
  );
}

export default App;

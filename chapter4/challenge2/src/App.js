import React, {useState, useEffect} from 'react';
import './App.css';
import {useMetaMask} from "./hooks/metamask";
import {Dapp} from "./components/dapp";
import DappContext from "./dappContext";

function App(props) {
    const metaConnection = useMetaMask();
    const [dapp, setDapp] = useState(metaConnection);
    useEffect(() => {
        setDapp(metaConnection);
    }, [metaConnection]);
  return (
      <DappContext.Provider value={dapp}>
          <Dapp className="App"/>
      </DappContext.Provider>
  );
}

export default App;

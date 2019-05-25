import React from 'react';
import './App.css';
import {useMetaMask} from "./hooks/metamask";

function App(props) {
  const [address, provider, network, balance] = useMetaMask([]);

  return (
    <div className="container">
      <h1>Market Jobs Place</h1>
      <h3>Hello {address}</h3>
      <p>network: {network}</p>
      <p>balance: {balance}</p>
    </div>
  );
}

export default App;

import React, {useContext} from "react";
import DappContext from "../dappContext";

const Header = () => {
    const dapp = useContext(DappContext);
    return(<header className="header">
        <h1>Marketplace CryptoJobs</h1>
        <p>on {dapp.network} at {dapp.contract.address}</p>
    </header>);
};

export default Header;
import React, {useContext, useState, useEffect} from 'react';
import DappContext from "../dappContext";
import Header from "./header";
import Footer from "./footer";
import Registration from "./registration";
import Dashboard from "./dashboard";


export const Dapp = (props) => {
    const dapp = useContext(DappContext);
    const [isReady, setIsReady] = useState(false);
    const [isRegistered, setRegistered] = useState(false);
    useEffect(() =>{
        if(dapp && Object.keys(dapp).length > 0)
            setIsReady(true);
        }, [dapp]);
    useEffect( () => {
        if(isReady)
            (async () => {
                const registered = await dapp.contract.isRegistered(dapp.address);
                setRegistered(registered);
            })();
    }, [isReady, dapp.address, dapp.contract]);
    if(isReady) {
        return(
            <div>
                <Header />
                {!isRegistered ? <Registration className="main"/> : <Dashboard className="main"/>}
                <Footer />
            </div>
        );
    }
    return (<div className="container">{isReady ? dapp.contract.address : "Connection with metamask..."}</div>);
};
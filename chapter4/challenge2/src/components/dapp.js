import React, {useContext, useState, useEffect} from 'react';
import DappContext from "../dappContext";
import Header from "./header";
import Footer from "./footer";
import Registration from "./registration";
import Dashboard from "./dashboard";

//hooks used
import {useIsRegistered} from "../hooks/interactContract";


export const Dapp = (props) => {
    const dapp = useContext(DappContext);
    const [isRegistered, isLoading] = useIsRegistered(dapp);
    if(!isLoading) {
        return(
            <div>
                <Header />
                {!isRegistered ? <Registration className="main"/> : <Dashboard className="main"/>}
                <Footer />
            </div>
        );
    }
   return (<div className="container">{isLoading ? dapp.contract.address : "Connection with metamask..."}</div>);
};
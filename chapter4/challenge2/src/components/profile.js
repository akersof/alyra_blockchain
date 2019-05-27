import React, {useContext, useEffect, useState} from 'react';
import DappContext from "../dappContext";

const Profile = () => {
    const dapp = useContext(DappContext);
    const [information, setInformation] = useState([]);
    useEffect(() => {
        (async () => {
        const info = await dapp.contract.showUser(dapp.address);
        console.log(info);
        setInformation(info);})()
    }, []);
    console.log(information);
    if(information.length > 0)
        return(
            <div className="container">
                <p>Address: {information[0]}</p>
                <p>Name: {information[1]}</p>
                <p>Description: {information[2]}</p>
                <p>Fame: {information[3].toNumber()} </p>
                <p>Black Listed: {information[4].toString()}</p>
            </div>
    );
    return <p>....</p>
};

export default Profile
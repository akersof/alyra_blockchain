import React, {useState, useContext} from 'react';
import DappContext from "../dappContext";

function Registration(props) {
    const dapp = useContext(DappContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    return(
        <div>
            <h1>THIS IS THE REGISTRATION FORM</h1>
            <input type="text" value={name} placeholder="described yourself.." onChange={(event) => setName(event.target.value)}/>
            <input type="text" value={description} placeholder="described yourself.." onChange={(event) => setDescription(event.target.value)}/>
            <input type="button" value="register" onClick={(event) => dapp.signer.register(name, description)}/>
        </div>
    );
}

export default Registration;
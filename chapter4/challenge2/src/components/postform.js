import React, {useState, useContext} from 'react';
import DappContext from "../dappContext";

function PostForm(props) {
    const dapp = useContext(DappContext);
    const [reward, setReward] = useState("");
    const [delay, setDelay] = useState("");
    const [description, setDescription] = useState("");
    const [fame, setFame] = useState("");
    return(
        <div className="postJob">
            <h1>THIS IS THE REGISTRATION JOB POST FORM</h1>
            <input type="text" value={reward} placeholder="reward..." onChange={(event) => setReward(event.target.value)}/>
            <input type="text" value={delay} placeholder="delay in days.." onChange={(event) => setDelay(event.target.value)}/>
            <input type="text" value={description} placeholder="describ project.." onChange={(event) => setDescription(event.target.value)}/>
            <input type="text" value={fame} placeholder="minimum..fale" onChange={(event) => setFame(event.target.value)}/>
            <input type="button" value="post job" onClick={(event) => dapp.signer.postJob(parseInt(reward), parseInt(delay), description, parseInt(fame))}/>
        </div>
    );
}

export default PostForm;
import React, {useContext} from 'react';
import DappContext from "../dappContext";
import Profile from './profile'

function Dashboard(props) {
    const dapp = useContext(DappContext);
    return(
        <div>
            <Profile/>
        </div>
    );
}

export default Dashboard;
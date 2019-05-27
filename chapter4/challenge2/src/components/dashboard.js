import React, {useContext} from 'react';
import DappContext from "../dappContext";
import Profile from './profile'
import PostForm from "./postform";
import JobList from "./joblist";

function Dashboard(props) {
    const dapp = useContext(DappContext);
    return(
        <div>
            <Profile/>
            <PostForm />
            <JobList />
        </div>
    );
}

export default Dashboard;
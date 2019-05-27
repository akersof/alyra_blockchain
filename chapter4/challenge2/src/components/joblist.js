import React, {useState, useEffect, useContext} from 'react';
import DappContext from "../dappContext";

function JobList(props) {
    const dapp = useContext(DappContext);
    const [jobList, setJobList] = useState([]);
    useEffect(() => {
        (async () => {
            const lst = await dapp.contract.showJobs();
            setJobList(lst);
        })();
    });
    if(jobList.length > 0)
        return(
            <div>
                <ul>
                {jobList.map((job) => <li>{job}</li> )}
                </ul>
            </div>
        );
    return (<div></div>);
}

export default JobList;
import React, { useState, useEffect } from 'react';


export const useIsRegistered = (dapp) =>  {
    const [isRegistered, setRegistered] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const registered = await dapp.contract.isRegistered(dapp.address);
            setRegistered(registered);
            setLoading(false);
        })();}, [dapp]);
    return [isRegistered, loading];
}


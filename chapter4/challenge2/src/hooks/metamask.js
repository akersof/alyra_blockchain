import { useState, useEffect } from 'react';
import {ethers} from 'ethers';

export const useMetaMask = (dependencies) => {
    const [address, setAddress] = useState("");
    const [provider, setProvider] = useState("");
    const [network, setNetwork] = useState("");
    const [balance, setBalance] = useState("");

    useEffect(() => {
        const connect = async () => {
            //can use then for gathering address and provider at the same time
            const addresses = await window.ethereum.enable();
            const _address = addresses[0];
            setAddress(_address);
            let _provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(_provider);
            setNetwork((await _provider.getNetwork()).name);
            setBalance(ethers.utils.formatEther(await _provider.getBalance(_address)));
        };
        connect();

    }, [dependencies]);
    return [address, provider, network, balance];
};
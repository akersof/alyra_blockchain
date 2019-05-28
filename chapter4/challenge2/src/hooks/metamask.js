import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, CONTRACT_ABI} from '../contractData.js';

export const useMetaMask = () => {
    const [dapp, setDapp] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const connect = async () => {
            //can use then for gathering address and provider at the same time
            const addresses = await window.ethereum.enable();
            const _address = addresses[0];
            const _provider = new ethers.providers.Web3Provider(window.ethereum);
            const _network = (await _provider.getNetwork()).name;
            const _balance = ethers.utils.formatEther(await _provider.getBalance(_address));
            const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _provider);
            const _signer = _contract.connect(_provider.getSigner(_address));
            setDapp({
                address: _address,
                network: _network,
                provider: _provider,
                balance: _balance,
                contract: _contract,
                signer: _signer
            });
            setLoading(false);
        };
        connect();

    }, []);
    return [dapp, loading];
};
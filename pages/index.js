import { useEffect, useState } from 'react';
import Web3 from 'web3';
import TokenDisplay from '../components/TokenDisplay';

import abi from '../constants/abi';
import { swap } from '../services/oneinch';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const web3 = new Web3();

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [swapData, setSwapData] = useState(null);

  useEffect(() => {
    web3.setProvider(window.ethereum);
  }, []);

  async function connect() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        const accounts = await web3.eth.getAccounts();
        if (!accounts.length) {
          throw new Error('No accounts connected');
        }

        const account = accounts[0];

        setSigner(account);
        setIsConnected(true);
      } catch (error) {
        console.log(error);
        setIsConnected(false);
      }
    }
  }

  async function requestSwap() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const swapResponse = await swap({
          amount: 1,
          fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          toTokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
          fromAddress: signer,
        });

        setSwapData(swapResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function executeSwap() {
    if (typeof window.ethereum !== 'undefined' && swapData) {
      const { from, data, gas, gasPrice, to, value } = swapData.tx;

      const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS, {
        from,
        data,
        gas,
        gasPrice,
        to,
        value
      });

      await contract.methods.store(42).send();
    }
  }

  return (
    <div>
      {isConnected ? (
        <>
          Connected <br />
          <button onClick={() => requestSwap()}>Request Swap</button>
        </>
      ) : (
        <>
          Not connected <br />
          <button onClick={() => connect()}>Connect</button>
        </>
      )}

      <br />

      {swapData && (
        <>
          <TokenDisplay 
            name={swapData.fromToken.name} 
            symbol={swapData.fromToken.symbol} 
            logo={swapData.fromToken.logoURI} 
            amount={swapData.fromTokenAmount}
          />
          <br />

          to

          <br />
          <TokenDisplay 
            name={swapData.toToken.name} 
            symbol={swapData.toToken.symbol} 
            logo={swapData.toToken.logoURI} 
            amount={swapData.toTokenAmount}
          />
        
          <br />
          <button onClick={() => executeSwap()}>Execute Swap</button>
        </>
      )}
    </div>
  )
}

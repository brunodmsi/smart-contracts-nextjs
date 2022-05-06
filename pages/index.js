import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import TokenDisplay from '../components/TokenDisplay';

import abi from '../constants/abi';
import { swap } from '../services/oneinch';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 31337]
});

export default function Home() {
  const { activate, active, library: provider, deactivate } = useWeb3React();

  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [swapData, setSwapData] = useState(null);

  useEffect(() => {
    if (provider) {
      provider.eth.getAccounts().then((accounts) => {
        setSigner(accounts[0]);
      });
    } 
  }, [provider])

  async function connect() {
    try {
      await activate(injected);
    } catch (error) {
      setError('Error connecting to account')
      console.log(error);
    }
  }

  async function requestSwap() {
    try {
      const convertedAmount = Number(amount);
      if (!amount || isNaN(convertedAmount)) {
        setError('Amount is not a valid value')
        return;
      }

      const swapResponse = await swap({
        amount: convertedAmount,
        fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        toTokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
        fromAddress: signer,
      });

      setSwapData(swapResponse.data);
    } catch (error) {
      setError('Error requesting for swap')
      console.log(error);
    }
  }

  async function executeSwap() {
    const { from, data, gas, gasPrice, to, value } = swapData.tx;

    try {
      const contract = new provider.eth.Contract(abi, CONTRACT_ADDRESS, {
        from,
        data,
        gas,
        gasPrice,
        to,
        value
      });

      await contract.methods.store(42).send();
    } catch (e) {
      setError('Error executing the swap')
      console.log(e);
    }
  }

  async function disconnect() {
    await deactivate();
  }

  return (
    <div>
      {error && 
        <p 
          style={{
            color: 'red'
          }}
        >
          {error}
        </p>
      }

      {active ? (
        <>
          Connected 
          <button onClick={() => disconnect()}>Disconnect</button>
          <br />
          <input onClick={(e) => setAmount(e.target.value)} type="text" />
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

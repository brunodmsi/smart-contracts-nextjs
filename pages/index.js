import { useEffect, useState } from 'react';
import Web3 from 'web3';

import abi from '../constants/abi';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const web3 = new Web3();

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    web3.setProvider(window.ethereum);
  }, []);

  async function connect() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        ethereum.request({ 
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

  async function execute() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS, {
        from: signer
      });

      try {
        await contract.methods.store(42).send();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      {isConnected ? (
        <>
          Connected <br />
          <button onClick={() => execute()}>Execute transaction</button>
        </>
      ) : (
        <>
          Not connected <br />
          <button onClick={() => connect()}>Connect</button>
        </>
      )}
    </div>
  )
}

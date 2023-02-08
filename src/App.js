import Web3Modal from 'web3modal';
import './App.css';
import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
const MarketABI = require('./MarketABI.json');

const contractAdress = '0x3D9904Fab3d7f96Cd30315b968d4874dcf95A77b';

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions: {
    injected: {
      display: {
        name: 'OYK 2023',
        description: 'Description here!',
      },
      package: null,
    },
  },
});
const sendTransaction = async (tx) => {
  try {
    const result = await tx?.wait();
    return result;
  } catch (error) {
    throw Error(error);
  }
};

function App() {
  const [user, setUser] = useState();
  const [signer, setSigner] = useState();
  const [categories, setCategories] = useState();

  const handleConnect = useCallback(async () => {
    const provider = await web3Modal.connect();
    const lib = new ethers.providers.Web3Provider(provider);
    const signer = lib.getSigner();
    const users = await lib.listAccounts();
    setSigner(signer);
    setUser(users[0]);
  }, [web3Modal]);

  const handleDisconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setSigner(null);
    setUser(null);
  }, [web3Modal]);

  const getCategories = async () => {
    const instance = new ethers.Contract(contractAdress, MarketABI, signer);
    const result = await instance.getCategories();
    setCategories(result);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        {user ? (
          <button
            onClick={handleDisconnect}
            className='btn'
          >
            Disconnect
          </button>
        ) : (
          <button
            className='btn'
            onClick={handleConnect}
          >
            Connect
          </button>
        )}
        <button
          className='btn'
          onClick={getCategories}
        >
          Get Categories
        </button>
      </header>
      <div className='container'>
        {categories?.map((category, index) => (
          <div
            className='container__item'
            key={index}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

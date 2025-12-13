import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        console.log("Connected:", accounts[0]);
      } catch (err) {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else if (err.code === -32002) {
          console.log("Please unlock MetaMask and try again.");
        } else {
          console.error(err.message);
        }
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    console.log("Wallet disconnected");
  };

  const switchAccount = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }]
        });
      } catch (err) {
        console.error("Error switching account:", err.message);
      }
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          console.log("Current account:", accounts[0]);
        } else {
          setIsConnected(false);
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");

    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          console.log("Account switched to:", accounts[0]);
        } else {
          setWalletAddress("");
          setIsConnected(false);
          console.log("Account disconnected");
        }
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      {!isConnected ? (
        <button className="connect-btn" onClick={connectWallet}>
          <span className="btn-txt">Connect Wallet</span>
        </button>
      ) : (
        <>
          <div style={{ color: '#fff', fontSize: '0.9rem' }}>
            Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
          </div>
          <button className="connect-btn" onClick={switchAccount} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
            <span className="btn-txt">Switch Account</span>
          </button>
          <button className="connect-btn" onClick={disconnectWallet} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#ff4444' }}>
            <span className="btn-txt">Disconnect</span>
          </button>
        </>
      )}
    </div>
  );
}

export default App;

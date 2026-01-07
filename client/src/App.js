import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
// ethers import removed (not used in this component)
import Firstpage from "./components/Firstpage";
import Secondpage from "./components/Secondpage";
import AccessListPage from "./components/AccessList";
import "./App.css";
import Working from "./components/Working";
// Removed unused Upload import to fix build lint errors

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (isConnectingRef.current) return; // Prevent duplicate requests
      try {
        if (!window.ethereum) {
          console.warn("MetaMask not installed");
          return;
        }

        isConnectingRef.current = true;
        
        // Check if already connected first
        const accounts = await window.ethereum.request({
          method: "eth_accounts"
        });
        
        let currentAccount;
        if (accounts && accounts.length > 0) {
          currentAccount = accounts[0];
        } else {
          // Only request permissions if not already connected
          const requestedAccounts = await window.ethereum.request({
            method: "eth_requestAccounts"
          });
          currentAccount = requestedAccounts[0];
        }
        
        if (currentAccount) {
          setAccount(currentAccount);
          console.log("Connected account:", currentAccount);
          
          // Initialize contract (mock for now since AccessList methods don't exist)
          // provider and signer are not used in this component; omitted to satisfy lint rules

          // Create a mock contract with the methods AccessList expects
          const mockContract = {
            shareAccess: async () => {
              // Return mock access list from localStorage
              const stored = localStorage.getItem(`accessList_${currentAccount}`);
              return stored ? JSON.parse(stored) : [];
            },
            allow: async (address) => {
              // Mock allow function - just return a fake transaction
              return { wait: async () => {} };
            },
            disallow: async (address) => {
              // Mock disallow function - just return a fake transaction
              return { wait: async () => {} };
            }
          };
          
          setContract(mockContract);
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      } finally {
        isConnectingRef.current = false;
      }
    };

    connectWallet();

    // Listen for account changes in MetaMask
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log("Account changed to:", accounts[0]);
        setAccount(accounts[0] || null);
        if (accounts[0]) {
          // Update contract for new account
          const mockContract = {
            shareAccess: async () => {
              const stored = localStorage.getItem(`accessList_${accounts[0]}`);
              return stored ? JSON.parse(stored) : [];
            },
            allow: async (address) => ({ wait: async () => {} }),
            disallow: async (address) => ({ wait: async () => {} })
          };
          setContract(mockContract);
        }
      };
      
      const handleChainChanged = () => {
        console.log("Network changed, refreshing...");
        window.location.reload();
      };
      
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/Secondpage" element={<Secondpage account={account} />} />
        <Route path="/accessList" element={<AccessListPage contract={contract} account={account} />} />
        <Route path="/Working" element={<Working />} />
      </Routes>
    </>
  );
};

export default App;

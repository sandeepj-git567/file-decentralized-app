import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Firstpage from "./components/Firstpage";
import Secondpage from "./components/Secondpage";
import "./App.css";
import Working from "./components/Working";

const App = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (!window.ethereum) {
          console.warn("MetaMask not installed");
          return;
        }

        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("Connected account:", accounts[0]);
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    };

    connectWallet();

    // Listen for account changes in MetaMask
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Account changed to:", accounts[0]);
        setAccount(accounts[0]);
      });

      window.ethereum.on("chainChanged", () => {
        console.log("Network changed, refreshing...");
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/Secondpage" element={<Secondpage account={account} />} />
        <Route path="/Working" element={<Working />} />
      </Routes>
    </>
  );
};

export default App;

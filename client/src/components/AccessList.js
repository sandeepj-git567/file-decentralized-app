import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import "./AccessList.css";
import Discordsvg from "./Discordsvg";
import Twittersvg from "./Twittersvg";
import Instagramsvg from "./Instagramsvg";

const AccessListPage = ({ contract, account }) => {
  const [accessList, setAccessList] = useState([]);

  useEffect(() => {
    const fetchAccessList = async () => {
      try {
        const list = await contract.shareAccess();
        setAccessList(list);
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    };
    contract && fetchAccessList();
  }, [contract]);

  const handleAllow = async (address) => {
    try {
      // Validate and checksum address
      if (!ethers.utils.isAddress(address)) {
        alert("Invalid Ethereum address format!");
        return;
      }
      const checksummedAddress = ethers.utils.getAddress(address);
      
      const tx = await contract.allow(checksummedAddress);
      await tx.wait();
      
      const addressObj = { user: checksummedAddress, access: true };
      if (accessList.some(item => item.user.toLowerCase() === checksummedAddress.toLowerCase())) {
        setAccessList(
          accessList.map((item) => {
            if (item.user.toLowerCase() === checksummedAddress.toLowerCase()) {
              return { ...item, access: true };
            }
            return item;
          })
        );
      } else {
        setAccessList([...accessList, addressObj]);
      }
      alert("✅ Address allowed successfully!");
    } catch (error) {
      console.error("Error allowing address:", error);
      alert("❌ Error allowing address. Make sure you have enough funds.");
    }
  };

  const handleDisallow = async (address) => {
    try {
      const tx = await contract.disallow(address);
      await tx.wait();
      setAccessList(
        accessList.map((item) => {
          if (item.user.toLowerCase() === address.toLowerCase()) {
            return { ...item, access: false };
          }
          return item;
        })
      );
      alert("✅ Address disallowed successfully!");
    } catch (error) {
      console.error("Error disallowing address:", error);
      alert("❌ Error disallowing address.");
    }
  };


  return (
    <div>
      {/* Navbar section */}
      <div className="navbar-section">
        <Navbar />
      </div>
      <div className="accesslist-section">
        <h1 className="accesslist-h1">Access List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const address = e.target.address.value;
            handleAllow(address);
            e.target.reset();
          }}
          className="accesslist-form"
        >
          <input
            className="accesslist-input"
            type="text"
            name="address"
            placeholder="Enter Address"
          />
          <button type="submit" className="accesslist-button">
            Allow
          </button>
        </form>

        {accessList.length > 0 ? (
          <ul>
            {accessList.map((item) => (
              <li key={item.user} className="accesslist-container">
                <div className="address">{item.user}</div>
                <div className="status">
                  {item.access ? "Allowed" : "Disallowed"}
                </div>
                {item.access ? (
                  <button
                    className="accesslist-button"
                    onClick={() => handleDisallow(item.user)}
                  >
                    Disallow
                  </button>
                ) : (
                  <button
                    className="accesslist-button"
                    onClick={() => handleAllow(item.user)}
                  >
                    Allow
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="error-text">No addresses with access.</p>
        )}
      </div>

      <div className="footer-section">
        <div className="column1">
          <h2 className="column1-heading">Contact Us</h2>
          <p className="column1-para">SmartDrop@gmail.com</p>
        </div>

        <div className="column2">
          <h2 className="column2-text">Get involved</h2>
          <div className="social-icons">
            <Discordsvg />
            <Twittersvg />
            <Instagramsvg />
          </div>
        </div>

        <div className="column3">
          <p className="Column3-text">
            © 2025 SmartDrop. All rights reserved
          </p>
        </div>
      </div>

    </div>
  );
};

AccessListPage.propTypes = {
  contract: PropTypes.shape({
    shareAccess: PropTypes.any,
    allow: PropTypes.any,
    disallow: PropTypes.any,
  }),
  account: PropTypes.string,
};

export default AccessListPage;


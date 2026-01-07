import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import FormData from "form-data";
import { ethers } from "ethers";
import "./FileUpload.css"; // optional, if you want to style cleanly

const FileUpload = ({ account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentButton, setCurrentButton] = useState("upload");
  const [cid, setCid] = useState("");
  const [gatewayLink, setGatewayLink] = useState("");
  const [availableGateway, setAvailableGateway] = useState("");
  const [alternativeGateways, setAlternativeGateways] = useState([]);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [receivedFiles, setReceivedFiles] = useState([]);

  const pinataKeys = {
    key: "d19a9f90368b8ae5814e",
    secret: "2be16f62e039e4a87b4e4550a44f0bbb4b0c1f7e6fe3de549163a869eede439a",
  };

  // ✅ Check if Local IPFS Node is running
  const checkLocalIPFS = async () => {
    try {
      await axios.get("http://127.0.0.1:5002/api/v0/version");
      return true;
    } catch {
      return false;
    }
  };

  // ✅ File Upload Handler (IPFS Only - NO BLOCKCHAIN)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");

    try {
      const formData = new FormData();
      formData.append("file", file);
      setUploadProgress(10);

      const isLocalIPFS = await checkLocalIPFS();
      let uploadURL = "";
      let headers = {};

      if (isLocalIPFS) {
        console.log("🟢 Using Local IPFS Node");
        uploadURL = "http://127.0.0.1:5002/api/v0/add";
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        console.log("🌐 Using Pinata Cloud IPFS");
        uploadURL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        headers = {
          pinata_api_key: pinataKeys.key,
          pinata_secret_api_key: pinataKeys.secret,
          "Content-Type": "multipart/form-data",
        };
      }

      // Upload file to IPFS
      const resFile = await axios.post(uploadURL, formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          const progressPercentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progressPercentage);
        },
      });

      // ✅ Get CID (IPFS Hash)
      const newCid = isLocalIPFS ? resFile.data.Hash : resFile.data.IpfsHash;
      setCid(newCid);

      // Try multiple public gateways and pick the first that responds quickly
      const gateways = [
        `https://ipfs.io/ipfs/`,
        `https://cloudflare-ipfs.com/ipfs/`,
        `https://gateway.pinata.cloud/ipfs/`,
        `https://dweb.link/ipfs/`
      ];

      const tryGateways = async (cid) => {
        const working = [];
        for (const g of gateways) {
          const url = `${g}${cid}`;
          try {
            // Use HEAD where possible to avoid downloading the file body
            await axios.head(url, { timeout: 3000 });
            working.push(g);
          } catch (e) {
            // gateway failed or didn't support HEAD; try GET as fallback with small timeout
            try {
              await axios.get(url, { timeout: 3000 });
              working.push(g);
            } catch (e2) {
              // not available
            }
          }
        }
        return working;
      };

      const workingGateways = await tryGateways(newCid);
      const primary = workingGateways.length > 0 ? `${workingGateways[0]}${newCid}` : `https://ipfs.io/ipfs/${newCid}`;
      setAvailableGateway(primary);
      setAlternativeGateways(workingGateways.map((g) => `${g}${newCid}`));
      setGatewayLink(primary);

      console.log("✅ File uploaded to IPFS:", gatewayURL);
      console.log("📤 Ready to share! Copy and share this link with others.");
      
      alert("✅ File uploaded to IPFS successfully!\n\n📤 Share this link:\n" + gatewayURL);

      setFile(null);
      setFileName("No file selected");
      setUploadProgress(0);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("❌ Unable to upload file. Check your IPFS or API connection.");
      setUploadProgress(0);
    }
  };

  // ✅ File Selection Handler
  const retrieveFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // ✅ Share File Handler
  const handleShare = (e) => {
    e.preventDefault();
    
    if (!receiverAddress.trim()) {
      alert("⚠️ Please enter receiver's MetaMask address");
      return;
    }
    
    if (!gatewayLink) {
      alert("⚠️ Please upload a file first!");
      return;
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(receiverAddress)) {
      alert("❌ Invalid Ethereum address. Must start with 0x and be 42 characters.");
      return;
    }

    // ✅ Add receiver to shared list
    const newSharedUser = {
      address: receiverAddress,
      timestamp: new Date().toLocaleString(),
      fileLink: gatewayLink,
    };
    
    setSharedUsers([...sharedUsers, newSharedUser]);
    
    // ✅ ALSO SAVE TO RECEIVER'S RECEIVED FILES (localStorage)
    const receivedRecord = {
      from: account || "Unknown",
      link: gatewayLink,
      time: new Date().toLocaleString(),
      cid: cid,
    };
    
    // Save to multiple key variants to improve cross-client compatibility
    const keysToTry = new Set();
    keysToTry.add(`files_received_by_${receiverAddress}`);
    keysToTry.add(`files_received_by_${receiverAddress.toLowerCase()}`);
    try {
      const checksummed = ethers.utils.getAddress(receiverAddress);
      keysToTry.add(`files_received_by_${checksummed}`);
    } catch (e) {
      // invalid address for checksum — ignore
    }

    keysToTry.forEach((storageKey) => {
      try {
        const existingFiles = JSON.parse(localStorage.getItem(storageKey) || "[]");
        existingFiles.push(receivedRecord);
        localStorage.setItem(storageKey, JSON.stringify(existingFiles));
      } catch (e) {
        console.warn("Failed to write received file to localStorage key", storageKey, e);
      }
    });
    
    alert(
      `✅ File link shared with ${receiverAddress}!\n\n` +
      `Link: ${gatewayLink}\n\n` +
      `They can now download the file directly from IPFS.`
    );
    
    setReceiverAddress(""); // Clear input
  };

  // ✅ Load received files when account changes
  React.useEffect(() => {
    // Clear if no account
    if (!account) {
      setReceivedFiles([]);
      return;
    }

    // localStorage keys may be stored with different address casing (sender-entered value).
    // Find keys that match the current account case-insensitively and load files from them.
    const lowerAcct = account.toLowerCase();
    let files = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("files_received_by_")) {
        const addr = key.replace("files_received_by_", "");
        if (addr && addr.toLowerCase() === lowerAcct) {
          try {
            const parsed = JSON.parse(localStorage.getItem(key) || "[]");
            files = files.concat(parsed);
          } catch (e) {
            console.warn("Failed to parse received files for key", key, e);
          }
        }
      }
    }

    setReceivedFiles(files);

    // Listen for storage events to update received files in other tabs/windows
    const onStorage = (ev) => {
      if (!ev.key) return;
      if (ev.key.startsWith("files_received_by_")) {
        const addr = ev.key.replace("files_received_by_", "");
        if (addr && addr.toLowerCase() === lowerAcct) {
          try {
            const parsed = JSON.parse(ev.newValue || "[]");
            setReceivedFiles(parsed);
          } catch (e) {
            console.warn("Failed to parse storage event data", e);
          }
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [account]);

  return (
    <div className="upload-share-container">
      {/* 🔘 Toggle Upload / Share / Received */}
      <div className="toggleWrapper" style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setCurrentButton("upload")}
          style={{
            padding: "10px 20px",
            backgroundColor: currentButton === "upload" ? "#2196F3" : "#ddd",
            color: currentButton === "upload" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          📤 Upload
        </button>
        <button
          onClick={() => setCurrentButton("share")}
          style={{
            padding: "10px 20px",
            backgroundColor: currentButton === "share" ? "#2196F3" : "#ddd",
            color: currentButton === "share" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          🔗 Share
        </button>
        <button
          onClick={() => setCurrentButton("received")}
          style={{
            padding: "10px 20px",
            backgroundColor: currentButton === "received" ? "#2196F3" : "#ddd",
            color: currentButton === "received" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          📥 Received
        </button>
      </div>

      {/* 🟢 Upload Section */}
      {currentButton === "upload" && (
        <div className="wrapper upload-box">
          <h3>Upload Your Files</h3>
          <p className="first-desc">
            Supported types: PNG, MP3, MP4, WEBP, PDF
          </p>

          <div className="form">
            <label htmlFor="my-file" className="custom-file-upload">
              <i className="fa-solid fa-cloud-arrow-up fa-bounce"></i>
              <p>Select a file to upload</p>
            </label>

            <input
              type="file"
              id="my-file"
              name="myfile"
              onChange={retrieveFile}
              style={{ display: "none" }}
            />

            <p className="upload-para">{fileName}</p>
            {uploadProgress > 0 && (
              <progress value={uploadProgress} max={100}></progress>
            )}
          </div>

          <button
            type="submit"
            className="upload"
            disabled={!file}
            onClick={handleSubmit}
          >
            Upload
          </button>

          {/* ✅ CID & Gateway link neatly inside box */}
          {cid && (
            <div className="upload-result">
              <p>
                <strong>CID:</strong> <span className="cid">{cid}</span>
              </p>
              <p>
                <strong>Gateway Link:</strong>{" "}
                {gatewayLink ? (
                  <>
                    <a href={gatewayLink} target="_blank" rel="noopener noreferrer" className="gateway-link">
                      Open (primary)
                    </a>
                    <button
                      onClick={async () => {
                        // Re-check gateways and update primary
                        try {
                          const cidToCheck = cid;
                          const gateways = [
                            `https://ipfs.io/ipfs/`,
                            `https://cloudflare-ipfs.com/ipfs/`,
                            `https://gateway.pinata.cloud/ipfs/`,
                            `https://dweb.link/ipfs/`
                          ];
                          let first = null;
                          for (const g of gateways) {
                            try {
                              await axios.head(`${g}${cidToCheck}`, { timeout: 3000 });
                              first = `${g}${cidToCheck}`;
                              break;
                            } catch (e) {
                              try {
                                await axios.get(`${g}${cidToCheck}`, { timeout: 3000 });
                                first = `${g}${cidToCheck}`;
                                break;
                              } catch (e2) {}
                            }
                          }
                          if (first) {
                            setAvailableGateway(first);
                            setGatewayLink(first);
                            setAlternativeGateways(gateways.filter((g) => `${g}${cidToCheck}` !== first).map((g) => `${g}${cidToCheck}`));
                            alert("✅ Found available gateway and updated link.");
                          } else {
                            alert("⚠️ No gateway responded quickly. Try again or run a local IPFS node.");
                          }
                        } catch (err) {
                          console.warn(err);
                          alert("⚠️ Error while checking gateways.");
                        }
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      Retry Gateways
                    </button>

                    {alternativeGateways && alternativeGateways.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <small>Other gateways:</small>
                        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                          {alternativeGateways.map((g, idx) => (
                            <a key={idx} href={g} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                              {g.replace(/https?:\/\//, "").slice(0, 40)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <span>—</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 🟣 Share Section */}
      {currentButton === "share" && (
        <div className="share-wrapper">
          <h3>📤 Share Your Files</h3>
          <p className="share-info">
            Share IPFS links with others. No blockchain needed!
          </p>

          {/* If no file uploaded, show message */}
          {!gatewayLink ? (
            <div style={{ padding: "20px", backgroundColor: "#fff3cd", borderRadius: "5px", marginBottom: "20px" }}>
              <p style={{ margin: 0, color: "#856404" }}>
                📌 Please upload a file first to get an IPFS link
              </p>
            </div>
          ) : (
            <>
              {/* Current File Info */}
              <div style={{ padding: "15px", backgroundColor: "#e7f3ff", borderRadius: "5px", marginBottom: "20px" }}>
                <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                  📄 File Ready to Share:
                </p>
                <p style={{ margin: "5px 0", wordBreak: "break-all", fontSize: "13px" }}>
                  {gatewayLink}
                </p>
              </div>

              {/* Share Form */}
              <form onSubmit={handleShare} style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                  👤 Receiver's MetaMask Address:
                </label>
                <input
                  type="text"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f76D95"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ddd",
                    borderRadius: "5px",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    marginBottom: "15px",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  className="upload"
                  style={{ width: "100%", marginTop: "0" }}
                >
                  🔗 Share with This Address
                </button>
              </form>

              {/* Shared Users List */}
              {sharedUsers.length > 0 && (
                <div style={{ padding: "15px", backgroundColor: "#f0f9ff", borderRadius: "5px" }}>
                  <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
                    ✅ Shared With ({sharedUsers.length}):
                  </p>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {sharedUsers.map((user, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "10px",
                          backgroundColor: "white",
                          borderLeft: "3px solid #4CAF50",
                          marginBottom: "8px",
                          borderRadius: "3px",
                          fontSize: "12px",
                        }}
                      >
                        <p style={{ margin: "2px 0", wordBreak: "break-all" }}>
                          <strong>Address:</strong> {user.address}
                        </p>
                        <p style={{ margin: "2px 0", color: "#666" }}>
                          <strong>Time:</strong> {user.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <p className="share-tip" style={{ marginTop: "20px" }}>
            💡 <strong>How it works:</strong>
            <br />
            1. Upload file above (get IPFS link)
            <br />
            2. Enter receiver's MetaMask address
            <br />
            3. Click "Share with This Address"
            <br />
            4. Share confirmation logged (no gas cost!)
            <br />
            5. They can download from IPFS link anytime
          </p>
        </div>
      )}

      {/* 🟢 Received Files Section */}
      {currentButton === "received" && (
        <div className="received-wrapper">
          <h3>📥 Received Files</h3>
          <p className="received-info">
            Files shared with your address: <strong>{account || "Connect wallet"}</strong>
          </p>

          {!account ? (
            <div style={{ padding: "20px", backgroundColor: "#fff3cd", borderRadius: "5px", marginBottom: "20px" }}>
              <p style={{ margin: 0, color: "#856404" }}>
                🔗 Please connect your MetaMask wallet to see files shared with you
              </p>
            </div>
          ) : receivedFiles.length === 0 ? (
            <div style={{ padding: "20px", backgroundColor: "#f0f9ff", borderRadius: "5px", marginBottom: "20px" }}>
              <p style={{ margin: 0, color: "#0066cc" }}>
                📭 No files received yet. Ask others to share files with your address!
              </p>
            </div>
          ) : (
            <div style={{ padding: "15px", backgroundColor: "#f0f9ff", borderRadius: "5px" }}>
              <p style={{ margin: "0 0 15px 0", fontWeight: "bold" }}>
                ✅ You Received ({receivedFiles.length}) Files:
              </p>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {receivedFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      backgroundColor: "white",
                      borderLeft: "4px solid #2196F3",
                      marginBottom: "12px",
                      borderRadius: "5px",
                      fontSize: "13px",
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <p style={{ margin: "2px 0", color: "#0066cc", fontWeight: "bold" }}>
                        📤 From: {file.from}
                      </p>
                      <p style={{ margin: "2px 0", color: "#666" }}>
                        ⏰ Time: {file.time}
                      </p>
                    </div>
                    <div style={{ marginBottom: "10px", padding: "8px", backgroundColor: "#f5f5f5", borderRadius: "3px" }}>
                      <p style={{ margin: "2px 0", wordBreak: "break-all", fontSize: "12px", fontFamily: "monospace" }}>
                        <strong>CID:</strong> {file.cid}
                      </p>
                      <p style={{ margin: "5px 0 2px 0", wordBreak: "break-all", fontSize: "12px" }}>
                          <strong>Link:</strong>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {/* show multiple gateway options for received files based on CID */}
                            {(() => {
                              const cidVal = file.cid || (file.link && file.link.split('/').pop());
                              const gw = [
                                `https://ipfs.io/ipfs/${cidVal}`,
                                `https://cloudflare-ipfs.com/ipfs/${cidVal}`,
                                `https://gateway.pinata.cloud/ipfs/${cidVal}`,
                                `https://dweb.link/ipfs/${cidVal}`,
                              ];
                              return gw.map((g, i) => (
                                <a key={i} href={g} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                                  {g.replace(/https?:\/\//, "").slice(0, 40)}
                                </a>
                              ));
                            })()}
                          </div>
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <a
                        href={file.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "8px 15px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        🔗 Open in IPFS
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(file.link);
                          alert("✅ Link copied to clipboard!");
                        }}
                        style={{
                          padding: "8px 15px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        📋 Copy Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="received-tip" style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
            💡 <strong>How it works:</strong>
            <br />
            • Others upload files and share with your MetaMask address
            <br />
            • Files appear automatically here when shared with you
            <br />
            • Click "Open in IPFS" to download the file
            <br />
            • Copy the link to save it elsewhere
            <br />
            • All stored on decentralized IPFS network
          </p>
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  account: PropTypes.string,
};

export default FileUpload;

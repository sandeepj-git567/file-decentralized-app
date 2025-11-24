import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Modal from "./Modal";
import FormData from "form-data";
import "./FileUpload.css"; // optional, if you want to style cleanly

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentButton, setCurrentButton] = useState("upload");
  const [cid, setCid] = useState("");
  const [gatewayLink, setGatewayLink] = useState("");

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

  // ✅ File Upload Handler
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

      // Upload file
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
      const gatewayURL = `https://ipfs.io/ipfs/${newCid}`;
      setCid(newCid);
      setGatewayLink(gatewayURL);

      console.log("✅ File uploaded successfully:", gatewayURL);
      alert("✅ File uploaded successfully!");

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

  return (
    <div className="upload-share-container">
      {/* 🔘 Toggle Upload / Share */}
      <div className="toggleWrapper">
        <input type="checkbox" className="dn" id="dn" />
        <label
          htmlFor="dn"
          className="toggle"
          onClick={() =>
            setCurrentButton(currentButton === "share" ? "upload" : "share")
          }
        >
          <span className="toggle__handler"></span>
        </label>
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
                <a
                  href={gatewayLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gateway-link"
                >
                  View File on Gateway
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* 🟣 Share Section */}
      {currentButton === "share" && (
        <div className="share-wrapper">
          <h3>Share Your Files</h3>
          <Modal contract={contract} />
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  contract: PropTypes.shape({
    connect: PropTypes.func,
  }),
  account: PropTypes.string,
  provider: PropTypes.shape({
    getSigner: PropTypes.func,
  }),
};

export default FileUpload;

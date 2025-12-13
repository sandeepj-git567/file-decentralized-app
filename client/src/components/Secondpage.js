import React from "react";
import Navbar from "./Navbar";
import "./Secondfile.css";
import "./FileUpload.css";
import FileUpload from "./FileUpload";
import Discordsvg from "./Discordsvg";
import Twittersvg from "./Twittersvg";
import Instagramsvg from "./Instagramsvg";
import SecureUpload from "./images/Secure Upload.png";
import ShareShield from "./images/Share Shield.png";
import AccessLock from "./images/Acesslock.png";

const Secondpage = ({ account }) => {
  return (
    <>
      {/* Navbar section */}
      <div className="navbar-section">
        <Navbar />
      </div>

      <div className="file-container">
        <h1>Store and Share Your Files with Ease</h1>
        <FileUpload account={account} />
      </div>

      <div className="brief-detail">
        <h1 className="brief-head">What Services We Provide</h1>
        <div className="container">
          <div className="card">
            <img src={SecureUpload} alt="logo" />
            <h3>Secure Upload</h3>
            <p>
              Upload files directly to IPFS with zero blockchain overhead.
              Your files are immediately available for sharing.
            </p>
            <button className="btn" onClick={() => {}}>
              More info
            </button>
          </div>
          <div className="card">
            <div className="icon standard">
              <img src={ShareShield} alt="logo" />
            </div>
            <h3>Share Shield</h3>
            <p>
              Share IPFS links directly with others. No gas fees, no blockchain
              overhead. Just copy and share your file link instantly.
            </p>
            <button className="btn standard" onClick={() => {}}>
              More info
            </button>
          </div>
          <div className="card">
            <div className="icon premium">
              <img src={AccessLock} alt="logo" />
            </div>
            <h3>Access Lock</h3>
            <p>
              Complete control over your files. IPFS storage means you decide
              who gets the link. No expensive blockchain transactions needed.
            </p>
            <button className="btn premium" onClick={() => {}}>
              More info
            </button>
          </div>
        </div>
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
          <p className="Column3-text">© 2025 SmartDrop. All rights reserved</p>
        </div>
      </div>
    </>
  );
};

export default Secondpage;

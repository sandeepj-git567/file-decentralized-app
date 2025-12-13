import React, { useState } from "react";
import "./Secondfile.css";

const Display = () => {
  return (
    <div style={{
      backgroundColor: "#f0f8ff",
      border: "2px solid #007bff",
      borderRadius: "8px",
      padding: "20px",
      margin: "20px 0",
      textAlign: "center"
    }}>
      <h3 style={{ color: "#007bff", marginTop: 0 }}>📤 How to Share Files</h3>
      <p style={{ margin: "10px 0", color: "#333", fontSize: "16px" }}>
        <strong>Step 1:</strong> Upload your file above
      </p>
      <p style={{ margin: "10px 0", color: "#333", fontSize: "16px" }}>
        <strong>Step 2:</strong> Copy the IPFS link from the success message
      </p>
      <p style={{ margin: "10px 0", color: "#333", fontSize: "16px" }}>
        <strong>Step 3:</strong> Share the link with anyone - they can download instantly!
      </p>
      <p style={{ margin: "15px 0", color: "#666", fontSize: "14px" }}>
        ✅ Zero gas fees • ✅ Instant sharing • ✅ Decentralized storage
      </p>
    </div>
  );
};

export default Display;


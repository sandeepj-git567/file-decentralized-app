// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Upload - IPFS-Only File Sharing (NO BLOCKCHAIN STORAGE)
 * @dev Files stored ONLY on IPFS - blockchain is optional
 * Users share files via direct IPFS links - ZERO gas costs!
 */
contract Upload {
  
  // Simple contract - files stored only on IPFS
  // This contract exists only for future extensibility
  
  event FileShared(address indexed user, string ipfsHash);
  
  /**
   * @dev Emit event when file is shared (optional tracking)
   * @param ipfsHash The IPFS hash of the shared file
   */
  function shareFile(string memory ipfsHash) external {
      emit FileShared(msg.sender, ipfsHash);
  }
}
# SmartDrop - Testing Guide

## Test Scenario: File Sharing

### Prerequisites
- Hardhat node running locally
- Contract deployed
- MetaMask connected with 2+ test accounts
- Application running on localhost:3000

### Test Steps

#### 1. Upload Files (Account A)
1. Connect MetaMask with Account A
2. Go to "My Uploads" section
3. Click "Upload" tab
4. Select a file and upload
5. Verify file appears in IPFS gateway link
6. Verify file hash stored on blockchain

#### 2. Grant Access (Account A)
1. Click "Share" tab
2. Enter Account B address in the input field
3. Click "Allow" button
4. Verify Account B appears in access list with "Allowed" status

#### 3. View Shared Files (Account B)
1. Switch MetaMask to Account B
2. Refresh the page
3. Go to "My Uploads" section
4. In search bar, enter Account A address
5. Click search button
6. Verify Account A's files are displayed

#### 4. Revoke Access (Account A)
1. Switch back to Account A
2. Go to "Share" tab
3. Find Account B in the list
4. Click "Disallow" button
5. Verify status changes to "Disallowed"

#### 5. Verify Access Revoked (Account B)
1. Switch to Account B
2. Try to view Account A's files again
3. Should see error: "You don't have access"

### Expected Results
✅ Files upload successfully to IPFS
✅ Files are stored on blockchain
✅ Access can be granted to other addresses
✅ Shared files are visible to granted addresses
✅ Access can be revoked
✅ Revoked addresses cannot view files

### Troubleshooting

**Contract not connecting:**
```
Error: Contract not connected
Solution: 
- Check contract address in .env.local
- Verify Hardhat node is running
- Restart application
```

**MetaMask network mismatch:**
```
Error: Network mismatch
Solution:
- Ensure MetaMask is on Hardhat network (Chain ID: 31337)
- Verify RPC URL: http://localhost:8545
```

**Files not uploading:**
```
Error: Upload failed
Solution:
- Check IPFS connection (local or Pinata)
- Verify Pinata API keys in FileUpload.js
- Check browser console for detailed errors
```

**Access denied when viewing shared files:**
```
Error: You don't have access
Solution:
- Verify access was granted in Share tab
- Check correct address was entered
- Ensure both accounts are on same network
```

## Manual Testing Checklist

- [ ] Account A can upload files
- [ ] Files appear in IPFS gateway
- [ ] Account A can grant access to Account B
- [ ] Account B can view Account A's files
- [ ] Account A can revoke access from Account B
- [ ] Account B cannot view files after revocation
- [ ] Delete file functionality works
- [ ] Multiple files can be shared
- [ ] Multiple accounts can have access
- [ ] Access list displays correctly

# SmartDrop - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet
- Hardhat (for local blockchain testing)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the contract address:

```
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_NETWORK=localhost
```

### 3. Deploy Smart Contract (Local Development)

In the root directory:

```bash
npm install
npx hardhat node
```

This starts a local Hardhat network on `http://localhost:8545`

In another terminal, deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address and update `.env.local`

### 4. Configure MetaMask

- Add custom RPC network:
  - Network Name: Hardhat
  - RPC URL: http://localhost:8545
  - Chain ID: 31337
  - Currency: ETH

- Import test accounts from Hardhat output

### 5. Start the Application

```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

## Troubleshooting

**Contract not connecting:**
- Verify contract address in `.env.local`
- Ensure Hardhat node is running
- Check MetaMask is connected to correct network

**MetaMask errors:**
- Clear browser cache
- Disconnect and reconnect wallet
- Verify network configuration

**Dependencies issues:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Deployment to Testnet

To deploy to Sepolia testnet:

1. Update `hardhat.config.js` with testnet RPC URL
2. Set private key in environment
3. Run: `npx hardhat run scripts/deploy.js --network sepolia`
4. Update contract address in `.env.local`

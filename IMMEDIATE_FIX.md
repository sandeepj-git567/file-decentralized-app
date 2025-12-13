# 🔴 IMMEDIATE FIX for RPC Error

## The Error You're Seeing:
```
RPC endpoint returned too many errors, retrying in 0.5 minutes
```

## ✅ INSTANT FIX (Do This Now)

### Step 1: Close Everything
- Close browser with your app
- Close MetaMask
- Stop React dev server (Ctrl+C)

### Step 2: Kill Hardhat Node
```powershell
Stop-Process -Name node -Force
```

### Step 3: Start Fresh - One Click!
Double-click this file in client folder:
```
setup-dev-environment.bat
```

OR manually:

**Terminal 1:**
```
cd client
npx hardhat node
```

**Terminal 2 (wait 10 sec, then run):**
```
cd client
npx hardhat run scripts/deploy.js --network localhost
```
Note the contract address!

**Terminal 3:**
```
cd client
npm start
```

### Step 4: Update Config
Edit: `client/.env.local`
```
REACT_APP_CONTRACT_ADDRESS=<paste_address_from_terminal_2>
REACT_APP_NETWORK=localhost
```

### Step 5: Refresh Browser
- Go to http://localhost:3000
- Connect MetaMask
- Try uploading a file

---

## 🧪 Verify It Works

You should NOT see RPC error and should see:
- ✅ File upload succeeds
- ✅ Can search for files
- ✅ Can view shared files
- ✅ No blockchain errors

---

## ⚠️ If Still Getting Errors:

**Check 1:** Terminal 1 still running?
```
You should see: "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"
```

**Check 2:** Correct contract address in .env.local?
```
Should match the address printed in Terminal 2
```

**Check 3:** MetaMask on Localhost 8545?
```
MetaMask → Network → Show test networks → Localhost 8545
```

If all checked and still broken:
1. Close ALL terminals
2. Close browser
3. Run `setup-dev-environment.bat` again
4. Refresh browser

---

## 💡 Why This Happens

- Hardhat node crashes or stops
- MetaMask loses connection to blockchain
- React tries to send transaction
- Gets RPC error

**Solution:** Restart the blockchain (Terminal 1)

---

## ✅ DO THIS NOW:

1. Double-click: `client/setup-dev-environment.bat`
2. Update: `client/.env.local` with contract address
3. Open: http://localhost:3000
4. Connect: MetaMask

Done! Your RPC error is fixed. 🎉

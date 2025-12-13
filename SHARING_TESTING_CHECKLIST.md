# ✅ SHARING FEATURE - Testing Checklist

## Pre-Testing Setup

- [ ] App is running (`npm start`)
- [ ] Hardhat node is running (or Pinata API configured)
- [ ] MetaMask is connected
- [ ] You have at least 2 test wallet addresses
- [ ] Browser console is open (F12)

---

## Test 1: Upload File

### Test Case: Successfully Upload File

**Steps:**
1. [ ] Click "Upload" tab
2. [ ] Click "Select a file to upload"
3. [ ] Choose a test file (PDF, image, etc.)
4. [ ] Verify filename displays
5. [ ] Click "Upload" button
6. [ ] Wait for upload to complete
7. [ ] Verify progress bar shows 100%

**Expected Results:**
- [ ] File selected shows in UI
- [ ] Progress bar appears during upload
- [ ] Upload completes successfully
- [ ] CID displays (e.g., "QmAbCd...")
- [ ] Gateway Link displays (https://ipfs.io/ipfs/...)
- [ ] Alert shows "✅ File uploaded to IPFS successfully!"
- [ ] Link is clickable and works

**Console Check:**
- [ ] Look for: "✅ File uploaded to IPFS: https://..."
- [ ] Look for: "📤 Ready to share! Copy and share this link with others."

---

## Test 2: Switch to Share Tab

### Test Case: Toggle to Share Interface

**Steps:**
1. [ ] File is uploaded
2. [ ] Click the toggle switch to "Share"
3. [ ] Observe UI change

**Expected Results:**
- [ ] Tab switches to Share interface
- [ ] Uploaded file link is displayed
- [ ] Input field appears for receiver address
- [ ] Input has placeholder: "0x742d35Cc..."
- [ ] "Share with This Address" button is visible
- [ ] "Shared With" section is empty (if first time)
- [ ] Instructions are visible

**Appearance Check:**
- [ ] Share section title: "📤 Share Your Files"
- [ ] File link section shows your IPFS link
- [ ] Input field is ready for typing
- [ ] Button is enabled and clickable

---

## Test 3: Enter Valid Address

### Test Case: Type Valid Ethereum Address

**Steps:**
1. [ ] On Share tab with file uploaded
2. [ ] Click on address input field
3. [ ] Type a valid Ethereum address: `0x742d35Cc6634C0532925a3b844Bc9e7595f76D95`
4. [ ] Observe input field

**Expected Results:**
- [ ] Text appears in input field as you type
- [ ] Address is fully visible
- [ ] No error messages shown
- [ ] Button remains enabled
- [ ] Input field accepts the text

**Format Validation:**
- [ ] Starts with "0x"
- [ ] Followed by 40 hexadecimal characters
- [ ] Total length is 42 characters

---

## Test 4: Share with Valid Address

### Test Case: Click Share Button with Valid Address

**Steps:**
1. [ ] Have file uploaded
2. [ ] Have valid address entered
3. [ ] Click "🔗 Share with This Address" button
4. [ ] Wait for response

**Expected Results:**
- [ ] Alert appears with success message
- [ ] Alert text includes: "✅ File link shared with 0x742d35Cc..."
- [ ] Alert text shows the IPFS link
- [ ] Alert text shows: "They can now download the file directly from IPFS."
- [ ] After clicking OK, alert closes
- [ ] Input field is cleared (empty)
- [ ] "Shared With" section now shows 1 entry

**Shared With List:**
- [ ] Shows: "✅ Shared With (1):"
- [ ] Shows address: "0x742d35Cc..."
- [ ] Shows timestamp with date and time
- [ ] Address is readable

---

## Test 5: Share Multiple Times

### Test Case: Share Same File with Multiple Addresses

**Steps:**
1. [ ] Previous file still loaded
2. [ ] Enter second address: `0xAbCdEf0123456789AbCdEf0123456789AbCdEf01`
3. [ ] Click "Share with This Address"
4. [ ] See confirmation alert, click OK
5. [ ] Enter third address: `0x1234567890aBcDeF1234567890aBcDeF12345678`
6. [ ] Click "Share with This Address"
7. [ ] See confirmation alert, click OK

**Expected Results:**
- [ ] Each share shows confirmation alert
- [ ] Input clears after each share
- [ ] "Shared With" count increases each time
- [ ] All addresses appear in the list
- [ ] Each has its own timestamp
- [ ] List shows: "✅ Shared With (3):"
- [ ] All three addresses visible
- [ ] Timestamps are different (or close)

**List Verification:**
- [ ] Address 1 with timestamp 1
- [ ] Address 2 with timestamp 2
- [ ] Address 3 with timestamp 3
- [ ] Count updates to (3)
- [ ] List is scrollable if many items

---

## Test 6: Invalid Address - Missing Address

### Test Case: Try to Share Without Entering Address

**Steps:**
1. [ ] Clear the input field (if it has text)
2. [ ] Click "Share with This Address" without typing
3. [ ] Observe error response

**Expected Results:**
- [ ] Alert appears with warning
- [ ] Alert text: "⚠️ Please enter receiver's MetaMask address"
- [ ] Sharing does NOT occur
- [ ] List is not updated
- [ ] Can try again by entering address

---

## Test 7: Invalid Address - Wrong Format

### Test Case: Try Invalid Address Formats

**Steps:**

#### Test 7a: Missing "0x"
1. [ ] Enter: `742d35Cc6634C0532925a3b844Bc9e7595f76D95` (no 0x)
2. [ ] Click Share
3. [ ] Observe error

**Expected:**
- [ ] Alert: "❌ Invalid Ethereum address. Must start with 0x and be 42 characters."
- [ ] Sharing blocked
- [ ] Address NOT added to list

#### Test 7b: Too Short
1. [ ] Enter: `0x742d35Cc`
2. [ ] Click Share
3. [ ] Observe error

**Expected:**
- [ ] Alert: "❌ Invalid Ethereum address. Must start with 0x and be 42 characters."
- [ ] Sharing blocked

#### Test 7c: Invalid Characters
1. [ ] Enter: `0x742d35Cc6634C0532925a3b844Bc9e7595f76D9G` (has G)
2. [ ] Click Share
3. [ ] Observe error

**Expected:**
- [ ] Alert: "❌ Invalid Ethereum address. Must start with 0x and be 42 characters."
- [ ] Sharing blocked

#### Test 7d: Completely Wrong
1. [ ] Enter: `not-an-address`
2. [ ] Click Share
3. [ ] Observe error

**Expected:**
- [ ] Alert: "❌ Invalid Ethereum address. Must start with 0x and be 42 characters."
- [ ] Sharing blocked

---

## Test 8: Share Without Uploading File First

### Test Case: Try to Share When No File Uploaded

**Steps:**
1. [ ] Do NOT upload a file
2. [ ] Click Share tab
3. [ ] See message about uploading file first
4. [ ] (Optional) Enter an address and try to click Share

**Expected Results:**
- [ ] Input field is disabled OR
- [ ] Alert appears: "⚠️ Please upload a file first!"
- [ ] Sharing does NOT occur
- [ ] List is not updated

---

## Test 9: Address Validation Pattern

### Test Case: Verify Address Format Validation

**Valid Addresses to Test:**
- [ ] `0x742d35Cc6634C0532925a3b844Bc9e7595f76D95` ✅
- [ ] `0xabcdef0123456789abcdef0123456789abcdef01` ✅
- [ ] `0xABCDEF0123456789ABCDEF0123456789ABCDEF01` ✅
- [ ] `0x1111111111111111111111111111111111111111` ✅

**Invalid Addresses to Test:**
- [ ] `742d35Cc6634C0532925a3b844Bc9e7595f76D95` ❌ (no 0x)
- [ ] `0x742d35Cc` ❌ (too short)
- [ ] `0x742d35Cc6634C0532925a3b844Bc9e7595f76D9XYZ` ❌ (too long)
- [ ] `0x742d35Zc6634C0532925a3b844Bc9e7595f76D95` ❌ (Z not hex)
- [ ] `` ❌ (empty)
- [ ] `   ` ❌ (spaces only)

---

## Test 10: Sharing History Display

### Test Case: Verify Shared Users List Display

**Steps:**
1. [ ] Share with 3-5 addresses
2. [ ] Observe the "Shared With" section

**Expected Results:**
- [ ] Section shows: "✅ Shared With (5):"
- [ ] Count is accurate
- [ ] Each entry shows:
  - [ ] Address
  - [ ] Timestamp with date and time
- [ ] Entries are in a box/card format
- [ ] Background color indicates success
- [ ] List scrolls if too many items

**Timestamp Verification:**
- [ ] First share timestamp is earliest
- [ ] Last share timestamp is latest
- [ ] Format is readable (12/9/2025, 10:30:45)
- [ ] Times are in chronological order

---

## Test 11: UI Responsiveness

### Test Case: Check UI Updates in Real-Time

**Steps:**
1. [ ] Share with an address
2. [ ] Watch for UI updates
3. [ ] Check input field clearing
4. [ ] Check list updating

**Expected Results:**
- [ ] Alert appears immediately
- [ ] Alert closes when OK is clicked
- [ ] Input field clears without delay
- [ ] "Shared With" list updates immediately
- [ ] Count increments properly
- [ ] No lag or delays
- [ ] All text is readable

---

## Test 12: Cross-Browser Tests (Optional)

### Test Case: Test in Different Browsers

**Steps:**
1. [ ] Test in Chrome
2. [ ] Test in Firefox
3. [ ] Test in Edge
4. [ ] Test in Safari (if available)

**Expected Results:**
- [ ] All features work the same
- [ ] Styling looks consistent
- [ ] No browser-specific errors
- [ ] Alerts display correctly
- [ ] Input fields work properly

---

## Test 13: Mobile Responsiveness (Optional)

### Test Case: Test on Mobile Device

**Steps:**
1. [ ] Open app on phone or tablet
2. [ ] Try uploading a file
3. [ ] Switch to Share tab
4. [ ] Enter address
5. [ ] Click Share

**Expected Results:**
- [ ] UI is readable on small screen
- [ ] Buttons are clickable
- [ ] Input fields work on mobile keyboard
- [ ] All features function the same
- [ ] Alerts appear correctly

---

## Test 14: Console Output

### Test Case: Verify Console Logs

**Steps:**
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Console tab
3. [ ] Upload a file
4. [ ] Watch console output

**Expected Results:**
- [ ] When uploading:
  - [ ] See: "✅ File uploaded to IPFS: https://..."
  - [ ] See: "📤 Ready to share! Copy and share this link with others."
- [ ] No error messages in red
- [ ] No warnings in yellow (CSS style warnings are OK)

---

## Test 15: Storage Verification

### Test Case: Check What Gets Stored

**Steps:**
1. [ ] Upload file
2. [ ] Share with address
3. [ ] Open browser DevTools
4. [ ] Go to Application tab
5. [ ] Check Storage

**Expected Results:**
- [ ] localStorage: No sharing records (not persisted)
- [ ] sessionStorage: No sharing records
- [ ] IPFS: File is stored permanently
- [ ] Blockchain: No transaction occurred
- [ ] Server: No request was made

**Verification:**
- [ ] Sharing history is NOT in localStorage
- [ ] Sharing history is NOT in sessionStorage
- [ ] File IS permanently on IPFS
- [ ] MetaMask shows NO new transactions

---

## Test 16: Link Verification

### Test Case: Verify IPFS Links are Real

**Steps:**
1. [ ] Upload a file
2. [ ] Copy the IPFS link from the gateway display
3. [ ] Open the link in a new tab
4. [ ] Verify the file appears

**Expected Results:**
- [ ] Link opens successfully
- [ ] File content displays or downloads
- [ ] No 404 errors
- [ ] File is the same one you uploaded
- [ ] Works in IPFS gateway

---

## Test 17: Performance

### Test Case: Measure Performance

**Steps:**
1. [ ] Upload file - note time taken
2. [ ] Share with address - note time taken
3. [ ] Share with 10 addresses - note total time

**Expected Results:**
- [ ] Upload: 5-30 seconds (file size dependent)
- [ ] Share: <1 second each (instant)
- [ ] 10 shares: <10 seconds total
- [ ] No lag or slowness
- [ ] Responsive UI throughout

---

## Test 18: Error Recovery

### Test Case: Recover from Errors

**Steps:**
1. [ ] Try invalid address (error shown)
2. [ ] Clear field and enter valid address
3. [ ] Click Share again
4. [ ] Should work properly

**Expected Results:**
- [ ] Error doesn't break the app
- [ ] Can retry after error
- [ ] Sharing works on second attempt
- [ ] No error state persists
- [ ] App remains stable

---

## Test 19: Refresh Behavior

### Test Case: Check What Persists on Refresh

**Steps:**
1. [ ] Upload file
2. [ ] Share with 3 addresses
3. [ ] Refresh the page (F5)
4. [ ] Check what remains

**Expected Results:**
- [ ] File upload is lost (requires re-upload)
- [ ] Sharing history is lost (in-memory only)
- [ ] IPFS link is lost from state
- [ ] BUT: IPFS file is still on the network
- [ ] NOTE: This is current behavior (can add persistence later)

---

## Final Verification Checklist

### Functionality
- [ ] Upload works
- [ ] Share tab accessible
- [ ] Address input works
- [ ] Share button works
- [ ] Validation works
- [ ] Error handling works
- [ ] History displays correctly
- [ ] Multiple shares work
- [ ] IPFS links are real

### User Experience
- [ ] Interface is intuitive
- [ ] Feedback is clear (alerts)
- [ ] No unexpected behavior
- [ ] Performance is good
- [ ] Mobile friendly (if applicable)

### Security
- [ ] Address validation is strict
- [ ] Invalid formats are rejected
- [ ] No blockchain interaction
- [ ] No security vulnerabilities visible
- [ ] IPFS links are properly formatted

### Data
- [ ] Files stored on IPFS correctly
- [ ] Sharing history maintained in memory
- [ ] Timestamps are accurate
- [ ] All data is correct

---

## Issue Tracking

If you find issues, fill out this form:

### Issue Template
```
Title: [Describe issue briefly]
Severity: [Critical/High/Medium/Low]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]
Expected Result: [What should happen]
Actual Result: [What actually happened]
Screenshot: [If applicable]
Browser: [Chrome/Firefox/Edge/Safari]
Console Errors: [Any errors in DevTools]
```

---

## Testing Summary

**Total Tests:** 19  
**Critical Tests:** 10  
**Optional Tests:** 9  

**Pass Criteria:**
- [ ] All critical tests pass
- [ ] No blocking errors
- [ ] Feature is usable
- [ ] Performance is acceptable

**Status After Testing:**
- [ ] ✅ Ready for Production
- [ ] ⚠️ Minor Issues (need fixes)
- [ ] ❌ Critical Issues (block usage)

---

## Sign Off

```
Tested By: ________________
Date: _____________________
Status: ✅ Pass / ⚠️ Needs Work / ❌ Failed
Comments: _____________________________
______________________________________________
```

---

**Thank you for testing the SmartDrop sharing feature!** 🎉

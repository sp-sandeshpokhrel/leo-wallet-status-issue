Clone the repo and then run following to replicate the issue:
```
yarn
yarn dev
```

I've hardcoded the transaction in the repo to ensure it fails. The transaction component checks the status every 5 seconds, and you can manually check by clicking the "Check Status" button. Both methods update the UI's transaction ID text state.

# Issues
1. **Status not updating when the transaction is accepted and finalized**
Even though we poll for the transaction status using the wallet SDK, the status remains "Completed" even after the transaction is finalized. The status only updates to "Finalized" when I open the Leo Wallet extension.

2. **Status not updating when the transaction is rejected**
When the transaction is rejected, there's no status update, even after opening the Leo Wallet extension. It stays stuck in "Completed" indefinitely.



** **
## Transaction Flow

We request a transaction and check its status using the following flow:

1. **Requesting a Transaction**
   - We use `requestTransaction` to initiate the transaction, which returns a `txId`. Note that this is not the on-chain transaction ID.
   - Once the transaction is initiated, we set the transaction status to `"Started"`.

   ```javascript
   const txId = await requestTransaction(aleoTransaction);
   setTxStatus("Started");
   setTxId(txId);
   ```

## 2. Checking the Transaction Status
- Once the transaction is initiated, we use the `txId` to check the status.
- If `transactionStatus` is available, we poll for the transaction status using the `txId` every 5 seconds using setInterval in useEffect.
- The status is logged and updated in the UI based on the result.

```javascript
if (transactionStatus) {
    console.log("Checking status");
    const status = await transactionStatus(txId);
    setTxStatus(status);
}
```



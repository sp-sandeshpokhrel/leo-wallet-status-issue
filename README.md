Clone the repo and then run following to replicate the issue:
```
yarn
yarn dev
```

I've hardcoded the transaction in the repo to ensure it fails. The transaction component checks the status every 5 seconds, and you can manually check by clicking the "Check Status" button. Both methods update the UI's transaction ID text state.

# Issues
## Status not updating when the transaction is accepted and finalized
Even though we poll for the transaction status using the wallet SDK, the status remains "Completed" even after the transaction is finalized. The status only updates to "Finalized" when I open the Leo Wallet extension.

## Status not updating when the transaction is rejected
When the transaction is rejected, there's no status update, even after opening the Leo Wallet extension. It stays stuck in "Completed" indefinitely.

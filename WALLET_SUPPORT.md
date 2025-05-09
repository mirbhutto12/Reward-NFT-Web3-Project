# Wallet Support in NFT Rewards App

## Current Wallet Support

This application supports standard Solana wallets that are detected in the browser environment. The primary supported wallet is Phantom, which is automatically detected when installed.

## Standard Wallet Detection

The application uses the standard wallet detection mechanism provided by the Solana Wallet Adapter framework. This means:

1. No explicit wallet adapters need to be imported
2. Any standard-compliant wallet that is installed in the browser will be automatically detected
3. Users can choose from any of their installed wallets when connecting

## Recommended Wallet

We recommend using Phantom wallet for the best experience with this application. Phantom offers:

- Excellent security features
- User-friendly interface
- Wide adoption in the Solana ecosystem
- Regular updates and improvements

You can download Phantom at [https://phantom.app/download](https://phantom.app/download).

## Troubleshooting Wallet Connections

If you experience issues connecting your wallet:

1. Make sure your wallet extension is installed and up to date
2. Check that your wallet is unlocked
3. Try refreshing the page
4. Clear your browser cache if problems persist
5. Ensure you're on a supported network (Devnet for testing, Mainnet for production)

## For Developers

If you need to add support for specific wallets that aren't automatically detected, you can modify the `components/solana-wallet-provider.tsx` file to include explicit wallet adapters.
\`\`\`

Let's also update the `lib/wallet-connection-utils.ts` file to reflect the standard wallet detection approach:

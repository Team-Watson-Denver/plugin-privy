# Privy Plugin for ElizaOS

This plugin enables integration with Privy's policy-based wallet management system within the ElizaOS framework.

## Features

- Policy Management
  - Create new policies for transaction control
  - Retrieve policy details to check allowed tokens
  - Update policies to add or remove allowed tokens

- Wallet Management
  - Create new wallets with policy enforcement
  - Update existing wallets with new policies
  - Retrieve a list of all available wallets
  - Support for multiple blockchain networks: Ethereum, Solana, and Monad

- Transaction Operations
  - Send transactions with policy enforcement
  - Sign transactions according to wallet policies

## Configuration

To use this plugin, you need to configure the following environment variables:

```
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

For Monad blockchain support, you can optionally configure:

```
PRIVY_MONAD_RPC_URL=your_monad_rpc_url   # Example: https://rpc.monad.xyz
PRIVY_MONAD_CHAIN_ID=your_monad_chain_id # Example: 1911 for Monad Testnet
```

You can obtain these credentials from the Privy developer portal.

## Usage

### Policy Management

```typescript
// Create a policy
const response = await runtime.executeAction("PRIVY_CREATE_POLICY", {
  name: "MyCompliancePolicy"
});

// Get a policy
const policyResponse = await runtime.executeAction("PRIVY_GET_POLICY", {
  policyId: "your_policy_id"
});

// Update a policy
const updateResponse = await runtime.executeAction("PRIVY_UPDATE_POLICY", {
  policyId: "your_policy_id",
  tokenName: "USDC",
  tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  remove: false // Set to true to remove the token
});
```

### Wallet Management

```typescript
// Create a wallet on Ethereum (default)
const walletResponse = await runtime.executeAction("PRIVY_CREATE_WALLET", {
  chainType: "ethereum",
  policyId: "your_policy_id" // Optional
});

// Create a wallet on Monad
const monadWalletResponse = await runtime.executeAction("PRIVY_CREATE_WALLET", {
  chainType: "monad",
  policyId: "your_policy_id" // Optional
});

// Get all wallets
const walletsResponse = await runtime.executeAction("PRIVY_GET_WALLETS");

// Update a wallet
const updateWalletResponse = await runtime.executeAction("PRIVY_UPDATE_WALLET", {
  walletId: "your_wallet_id",
  policyIds: ["policy_id_1", "policy_id_2"]
});
```

### Transactions

```typescript
// Send a transaction on Ethereum
const txResponse = await runtime.executeAction("PRIVY_SEND_TRANSACTION", {
  walletId: "your_wallet_id",
  to: "0xRecipientAddress",
  value: "1000000000000000", // Value in wei
  data: "0x" // Optional
});

// Send a transaction on Monad
const monadTxResponse = await runtime.executeAction("PRIVY_SEND_TRANSACTION", {
  walletId: "your_monad_wallet_id",
  to: "0xRecipientAddress",
  value: "1000000000000000", // Value in wei
  data: "0x", // Optional
  chainType: "monad"
});

// Sign a transaction
const signResponse = await runtime.executeAction("PRIVY_SIGN_TRANSACTION", {
  walletId: "your_wallet_id",
  message: "Hello, world!"
});
```

## Error Handling

The plugin provides detailed error messages for policy violations and other failures. For transactions that fail due to policy restrictions, you'll receive information about why the policy blocked the transaction.

## Plugin Architecture

This plugin follows the ElizaOS plugin architecture and consists of:

- Type definitions for Privy API entities
- Services for interacting with Privy APIs
- Actions for integration with the ElizaOS agent framework
- Environment configuration validation

## License

This plugin is released under the same license as the ElizaOS project. 
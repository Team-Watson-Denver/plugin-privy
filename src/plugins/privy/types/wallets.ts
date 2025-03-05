/**
 * Type definitions for Privy Wallet API
 * 
 * These types represent the structure of Privy's Wallet API requests and responses.
 * Wallets are used to manage cryptocurrency transactions with policy-based controls.
 */

/**
 * Response when creating a wallet
 */
export interface PrivyCreateWalletResponse {
    id: string;
    address: string;
    chain_type: 'ethereum' | 'solana' | 'monad';
    policy_ids: string[];
}

/**
 * Request to create a wallet with specific policies
 */
export interface PrivyCreateWalletRequest {
    chain_type: 'ethereum' | 'solana' | 'monad';
    policy_ids?: string[];
}

/**
 * Request to update a wallet's policies
 */
export interface PrivyUpdateWalletRequest {
    policy_ids?: string[];
}

/**
 * Transaction request details
 */
export interface PrivyTransactionRequest {
    wallet_id: string;
    to: string;
    value: string; // Wei amount in string
    data?: string;
}

/**
 * Transaction response
 */
export interface PrivyTransactionResponse {
    hash: string;
    caip2: string; // Chain identifier
}

/**
 * Transaction signature response
 */
export interface PrivySignatureResponse {
    signature: string;
} 
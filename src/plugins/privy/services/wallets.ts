import {
    PrivyCreateWalletRequest,
    PrivyCreateWalletResponse,
    PrivyUpdateWalletRequest,
    PrivyTransactionRequest,
    PrivyTransactionResponse,
    PrivySignatureResponse
} from "../types/wallets.js";

const BASE_URL = "https://api.privy.io/v1/wallets";

/**
 * Creates a wallet service instance for interacting with Privy wallets
 * 
 * @param privyAppID - Privy App ID
 * @param privyAppSecret - Privy App Secret
 * @param authRequestKey - Optional authorization request key
 * @returns Wallet service methods
 */
export const walletService = (privyAppID: string, privyAppSecret: string, authRequestKey?: string) => {
    /**
     * Creates a new wallet
     * 
     * @param request - Wallet creation request
     * @returns The created wallet
     */
    const createWallet = async (request: PrivyCreateWalletRequest): Promise<PrivyCreateWalletResponse> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        // Only add authorization signature if it exists
        if (authRequestKey) {
            headers['privy-authorization-signature'] = authRequestKey;
        }

        try {
            const url = BASE_URL;
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    /**
     * Updates an existing wallet
     * 
     * @param walletId - ID of the wallet to update
     * @param request - Wallet update request
     * @returns The updated wallet
     */
    const updateWallet = async (walletId: string, request: PrivyUpdateWalletRequest): Promise<PrivyCreateWalletResponse> => {
        if (!walletId) {
            throw new Error("Wallet ID is required");
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        try {
            const url = `${BASE_URL}/${walletId}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    /**
     * Gets all wallets
     * 
     * @returns List of wallets
     */
    const getWallets = async (): Promise<PrivyCreateWalletResponse[]> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        try {
            const url = BASE_URL;
            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    /**
     * Sends a transaction
     * 
     * @param request - Transaction request
     * @returns Transaction response
     */
    const sendTransaction = async (request: PrivyTransactionRequest): Promise<PrivyTransactionResponse> => {
        if (!request.wallet_id) {
            throw new Error("Wallet ID is required");
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        try {
            const url = `${BASE_URL}/${request.wallet_id}/transactions`;
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    to: request.to,
                    value: request.value,
                    data: request.data
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    /**
     * Signs a transaction
     * 
     * @param walletId - ID of the wallet to sign with
     * @param message - Message to sign
     * @returns Signature response
     */
    const signTransaction = async (walletId: string, message: string): Promise<PrivySignatureResponse> => {
        if (!walletId) {
            throw new Error("Wallet ID is required");
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        try {
            const url = `${BASE_URL}/${walletId}/sign`;
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    return { createWallet, updateWallet, getWallets, sendTransaction, signTransaction };
}; 
import {
    Action,
    Content,
    IAgentRuntime,
    Memory,
    Plugin,
    State,
} from "@ai16z/eliza";
import { validatePrivyConfig } from "./environment.js";
import { policyService } from "./services/policies.js";
import { walletService } from "./services/wallets.js";
import {
    getPolicyExamples,
    createPolicyExamples,
    updatePolicyExamples,
    createWalletExamples,
    updateWalletExamples,
    getWalletsExamples,
    sendTransactionExamples,
    signTransactionExamples
} from "./examples.js";
import { PrivyCreateWalletRequest, PrivyUpdateWalletRequest, PrivyTransactionRequest } from "./types/wallets.js";

/**
 * Privy Plugin Configuration
 */
export interface PrivyPluginConfig {
    defaultPolicyName?: string;
    defaultPolicyId?: string;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: PrivyPluginConfig = {
    defaultPolicyName: "DefaultPolicy",
    defaultPolicyId: ""
};

/**
 * Privy Plugin implementation
 */
export class PrivyPlugin implements Plugin {
    readonly name: string = "privy";
    readonly description: string = "Interact with Privy for policy-based wallet management";
    private config: PrivyPluginConfig;

    constructor(config: Partial<PrivyPluginConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Actions provided by the Privy plugin
     */
    actions: Action[] = [
        // Get Policy Action
        {
            name: "PRIVY_GET_POLICY",
            description: "Retrieve a Privy policy by its ID to check allowed tokens",
            similes: ["GET POLICY", "RETRIEVE POLICY", "FETCH POLICY", "CHECK POLICY"],
            examples: getPolicyExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    // Use default policy ID or get from options
                    const policyId = (options?.policyId as string) || this.config.defaultPolicyId;
                    const name = (options?.name as string) || this.config.defaultPolicyName || "DefaultPolicy";
                    
                    if (!policyId) {
                        return {
                            success: false,
                            response: "Policy ID is required. Please specify a policy ID or set a default policy ID in the configuration."
                        };
                    }

                    const ps = policyService(name, privyAppID, privyAppSecret);
                    const policyData = await ps.getPolicy(policyId);
                    
                    // Extract rule names from the policy
                    const ruleNames = policyData.method_rules.flatMap(methodRule =>
                        methodRule.rules.map(rule => rule.name.replace("Allowlist ", ""))
                    );
                    
                    const responseText = `These are tokens that are allowed for transactions: ${ruleNames.join(", ")}. If the token you want to use is not on this list, you will need to request it to be added.`;
                    
                    return {
                        success: true,
                        response: responseText,
                        data: { policy: policyData }
                    };
                } catch (error: any) {
                    console.error("Error in get policy action:", error);
                    return {
                        success: false,
                        response: `Error retrieving policy: ${error.message}`
                    };
                }
            }
        },
        
        // Create Policy Action
        {
            name: "PRIVY_CREATE_POLICY",
            description: "Create a new Privy policy for controlling wallet transactions",
            similes: ["CREATE POLICY", "NEW POLICY", "MAKE POLICY"],
            examples: createPolicyExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    const name = (options?.name as string) || this.config.defaultPolicyName || "DefaultPolicy";
                    
                    const ps = policyService(name, privyAppID, privyAppSecret);
                    const policyData = await ps.createPolicy();
                    
                    return {
                        success: true,
                        response: `Successfully created a new compliance policy with ID: ${policyData.id}. You can now add approved tokens to this policy.`,
                        data: { policy: policyData }
                    };
                } catch (error: any) {
                    console.error("Error in create policy action:", error);
                    return {
                        success: false,
                        response: `Error creating policy: ${error.message}`
                    };
                }
            }
        },
        
        // Update Policy Action
        {
            name: "PRIVY_UPDATE_POLICY",
            description: "Update a Privy policy to add or remove allowed tokens",
            similes: ["UPDATE POLICY", "MODIFY POLICY", "CHANGE POLICY"],
            examples: updatePolicyExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    // Get policy ID, token details, and action from options or message content
                    const policyId = (options?.policyId as string) || this.config.defaultPolicyId;
                    const name = (options?.name as string) || this.config.defaultPolicyName || "DefaultPolicy";
                    const tokenName = options?.tokenName as string;
                    const tokenAddress = options?.tokenAddress as string;
                    const remove = options?.remove === true;
                    
                    if (!policyId) {
                        return {
                            success: false,
                            response: "Policy ID is required. Please specify a policy ID or set a default policy ID in the configuration."
                        };
                    }
                    
                    if (!tokenName || !tokenAddress) {
                        return {
                            success: false,
                            response: "Token name and address are required for policy updates."
                        };
                    }

                    const ps = policyService(name, privyAppID, privyAppSecret);
                    const policyData = await ps.updatePolicy(policyId, tokenName, tokenAddress, remove);
                    
                    const action = remove ? "removed from" : "added to";
                    return {
                        success: true,
                        response: `Successfully ${action} the policy: token ${tokenName} (${tokenAddress}) has been ${action} the allowlist.`,
                        data: { policy: policyData }
                    };
                } catch (error: any) {
                    console.error("Error in update policy action:", error);
                    return {
                        success: false,
                        response: `Error updating policy: ${error.message}`
                    };
                }
            }
        },
        
        // Create Wallet Action
        {
            name: "PRIVY_CREATE_WALLET",
            description: "Create a new Privy wallet with compliance policies",
            similes: ["CREATE WALLET", "NEW WALLET", "MAKE WALLET"],
            examples: createWalletExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    // Get chain type and policy ID from options or message content
                    let chainType = (options?.chainType as string)?.toLowerCase() || "ethereum";
                    
                    // Validate chain type
                    if (!["ethereum", "solana", "monad"].includes(chainType)) {
                        return {
                            success: false,
                            response: "Invalid chain type. Supported chain types are: ethereum, solana, monad."
                        };
                    }
                    
                    // For Monad, use ethereum as the base chain type since it's EVM-compatible
                    // This ensures backward compatibility with the Privy API
                    const apiChainType = chainType === "monad" ? "ethereum" : chainType;
                    
                    const policyId = (options?.policyId as string) || this.config.defaultPolicyId;
                    const walletRequest: PrivyCreateWalletRequest = {
                        chain_type: apiChainType as "ethereum" | "solana",
                        policy_ids: policyId ? [policyId] : undefined
                    };

                    const ws = walletService(privyAppID, privyAppSecret);
                    const walletData = await ws.createWallet(walletRequest);
                    
                    // If it's a Monad wallet, include additional info in the response
                    let responseText = `Successfully created a new wallet with address: ${walletData.address}`;
                    if (chainType === "monad") {
                        responseText = `Successfully created a new Monad wallet with address: ${walletData.address}. This wallet is compatible with the Monad blockchain.`;
                    }
                    
                    return {
                        success: true,
                        response: responseText,
                        data: { wallet: walletData }
                    };
                } catch (error: any) {
                    console.error("Error in create wallet action:", error);
                    return {
                        success: false,
                        response: `Error creating wallet: ${error.message}`
                    };
                }
            }
        },
        
        // Update Wallet Action
        {
            name: "PRIVY_UPDATE_WALLET",
            description: "Update a Privy wallet's policies",
            similes: ["UPDATE WALLET", "MODIFY WALLET", "CHANGE WALLET"],
            examples: updateWalletExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    const walletId = options?.walletId as string;
                    const policyIds = options?.policyIds as string[];
                    
                    if (!walletId) {
                        return {
                            success: false,
                            response: "Wallet ID is required to update a wallet."
                        };
                    }
                    
                    if (!policyIds || !policyIds.length) {
                        return {
                            success: false,
                            response: "At least one policy ID is required for wallet updates."
                        };
                    }
                    
                    const request: PrivyUpdateWalletRequest = {
                        policy_ids: policyIds
                    };
                    
                    const ws = walletService(privyAppID, privyAppSecret);
                    const walletData = await ws.updateWallet(walletId, request);
                    
                    return {
                        success: true,
                        response: `Successfully updated wallet policies. The wallet now follows the specified compliance policies.`,
                        data: { wallet: walletData }
                    };
                } catch (error: any) {
                    console.error("Error in update wallet action:", error);
                    return {
                        success: false,
                        response: `Error updating wallet: ${error.message}`
                    };
                }
            }
        },
        
        // Get Wallets Action
        {
            name: "PRIVY_GET_WALLETS",
            description: "Get all Privy wallets",
            similes: ["GET WALLETS", "LIST WALLETS", "FETCH WALLETS"],
            examples: getWalletsExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    const ws = walletService(privyAppID, privyAppSecret);
                    const walletsData = await ws.getWallets();
                    
                    if (!walletsData.length) {
                        return {
                            success: true,
                            response: "No wallets found. You can create a new wallet with the PRIVY_CREATE_WALLET action."
                        };
                    }
                    
                    const walletList = walletsData.map(wallet => 
                        `Wallet ${wallet.id}: ${wallet.address} (${wallet.chain_type})`
                    ).join("\n");
                    
                    return {
                        success: true,
                        response: `Here are your available wallets:\n${walletList}`,
                        data: { wallets: walletsData }
                    };
                } catch (error: any) {
                    console.error("Error in get wallets action:", error);
                    return {
                        success: false,
                        response: `Error retrieving wallets: ${error.message}`
                    };
                }
            }
        },
        
        // Send Transaction Action
        {
            name: "PRIVY_SEND_TRANSACTION",
            description: "Send a transaction using a Privy wallet",
            similes: ["SEND TRANSACTION", "TRANSFER", "SEND CRYPTO"],
            examples: sendTransactionExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    const walletId = options?.walletId as string;
                    const to = options?.to as string;
                    const value = options?.value as string;
                    const data = options?.data as string;
                    
                    if (!walletId || !to || !value) {
                        return {
                            success: false,
                            response: "Wallet ID, recipient address, and value are required for transactions."
                        };
                    }
                    
                    const request: PrivyTransactionRequest = {
                        wallet_id: walletId,
                        to,
                        value,
                        data
                    };
                    
                    const ws = walletService(privyAppID, privyAppSecret);
                    const txData = await ws.sendTransaction(request);
                    
                    return {
                        success: true,
                        response: `Transaction sent successfully! Transaction hash: ${txData.hash}`,
                        data: { transaction: txData }
                    };
                } catch (error: any) {
                    console.error("Error in send transaction action:", error);
                    // Check for policy violation errors
                    if (error.message.includes("policy") || error.message.includes("denied")) {
                        return {
                            success: false,
                            response: `Transaction failed due to policy restrictions: ${error.message}. This transaction may involve tokens or addresses that aren't allowed by your wallet's compliance policies.`
                        };
                    }
                    return {
                        success: false,
                        response: `Error sending transaction: ${error.message}`
                    };
                }
            }
        },
        
        // Sign Transaction Action
        {
            name: "PRIVY_SIGN_TRANSACTION",
            description: "Sign a transaction using a Privy wallet",
            similes: ["SIGN TRANSACTION", "SIGN TX", "SIGN MESSAGE"],
            examples: signTransactionExamples,
            validate: async (runtime: IAgentRuntime) => {
                try {
                    await validatePrivyConfig(runtime);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            handler: async (
                runtime: IAgentRuntime,
                message: Memory,
                state?: State,
                options?: { [key: string]: unknown }
            ) => {
                try {
                    const config = await validatePrivyConfig(runtime);
                    const privyAppID = config.PRIVY_APP_ID;
                    const privyAppSecret = config.PRIVY_APP_SECRET;
                    
                    const walletId = options?.walletId as string;
                    const msg = options?.message as string;
                    
                    if (!walletId || !msg) {
                        return {
                            success: false,
                            response: "Wallet ID and message are required for signing."
                        };
                    }
                    
                    const ws = walletService(privyAppID, privyAppSecret);
                    const signData = await ws.signTransaction(walletId, msg);
                    
                    return {
                        success: true,
                        response: `Transaction signed successfully! Signature: ${signData.signature}`,
                        data: { signature: signData }
                    };
                } catch (error: any) {
                    console.error("Error in sign transaction action:", error);
                    // Check for policy violation errors
                    if (error.message.includes("policy") || error.message.includes("denied")) {
                        return {
                            success: false,
                            response: `Signing failed due to policy restrictions: ${error.message}. This operation may not be allowed by your wallet's compliance policies.`
                        };
                    }
                    return {
                        success: false,
                        response: `Error signing transaction: ${error.message}`
                    };
                }
            }
        }
    ];
}

// Export default instance with default config
export default new PrivyPlugin(); 
import { IAgentRuntime } from "@ai16z/eliza";

/**
 * Privy configuration interface
 */
export interface PrivyConfig {
    PRIVY_APP_ID: string;
    PRIVY_APP_SECRET: string;
    PRIVY_MONAD_RPC_URL?: string;
    PRIVY_MONAD_CHAIN_ID?: string;
}

/**
 * Validates the Privy configuration from the runtime environment
 * 
 * @param runtime - The agent runtime to extract settings from
 * @returns A validated Privy configuration object
 * @throws Error if required configuration is missing
 */
export async function validatePrivyConfig(
    runtime: IAgentRuntime
): Promise<PrivyConfig> {
    try {
        const PRIVY_APP_ID = runtime.getSetting("PRIVY_APP_ID");
        const PRIVY_APP_SECRET = runtime.getSetting("PRIVY_APP_SECRET");
        
        if (!PRIVY_APP_ID) {
            throw new Error("Privy App ID is required");
        }
        
        if (!PRIVY_APP_SECRET) {
            throw new Error("Privy App Secret is required");
        }
        
        // Retrieve optional Monad-specific configurations
        const PRIVY_MONAD_RPC_URL = runtime.getSetting("PRIVY_MONAD_RPC_URL") || undefined;
        const PRIVY_MONAD_CHAIN_ID = runtime.getSetting("PRIVY_MONAD_CHAIN_ID") || undefined;
        
        return {
            PRIVY_APP_ID,
            PRIVY_APP_SECRET,
            PRIVY_MONAD_RPC_URL,
            PRIVY_MONAD_CHAIN_ID
        };
    } catch (error) {
        console.error("Privy configuration error:", error);
        throw error;
    }
} 
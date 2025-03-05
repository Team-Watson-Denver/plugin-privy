import { ActionExample } from "@ai16z/eliza";

/**
 * Examples for the get policy action
 */
export const getPolicyExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "Is this token on the allowed list?" },
        },
        {
            user: "agent",
            content: {
                text: "This is a list of all compliant tokens.",
                action: "PRIVY_GET_POLICY",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "Can you verify if this transaction follows our compliance principles?" },
        },
        {
            user: "agent",
            content: {
                text: "Please check if the token is in the list of compliant tokens.",
                action: "PRIVY_GET_POLICY",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "Which tokens are allowed for transactions?" },
        },
        {
            user: "agent",
            content: {
                text: "Here are the tokens that are approved for transactions.",
                action: "PRIVY_GET_POLICY",
            },
        }
    ]
];

/**
 * Examples for the create policy action
 */
export const createPolicyExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "We need to set up rules for compliant trading." },
        },
        {
            user: "agent",
            content: {
                text: "I'll create a new policy with compliance rules that block certain transactions and only allow verified tokens.",
                action: "PRIVY_CREATE_POLICY",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "Create a policy to ensure our DeFi protocol follows our principles." },
        },
        {
            user: "agent",
            content: {
                text: "I'll set up a comprehensive policy that enforces compliance rules including avoiding certain transaction types.",
                action: "PRIVY_CREATE_POLICY",
            },
        }
    ]
];

/**
 * Examples for the update policy action
 */
export const updatePolicyExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "We need to add a new certified token to our allowlist." },
        },
        {
            user: "agent",
            content: {
                text: "I'll update the compliance policy to include the new verified token.",
                action: "PRIVY_UPDATE_POLICY",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "This token has lost its certification. Please update the policy." },
        },
        {
            user: "agent",
            content: {
                text: "I'll update the policy to remove this token from the approved tokens list.",
                action: "PRIVY_UPDATE_POLICY",
            },
        }
    ]
];

/**
 * Examples for the create wallet action
 */
export const createWalletExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "I need to create a new wallet that complies with our policies." },
        },
        {
            user: "agent",
            content: {
                text: "I'll create a new wallet with the compliance policies implemented.",
                action: "PRIVY_CREATE_WALLET",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "I want a policy-compliant wallet." },
        },
        {
            user: "agent",
            content: {
                text: "I'll create a compliant wallet for you.",
                action: "PRIVY_CREATE_WALLET",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "Create a new Monad wallet with our compliance policies." },
        },
        {
            user: "agent",
            content: {
                text: "I'll create a new Monad wallet with our compliance policies applied.",
                action: "PRIVY_CREATE_WALLET",
                options: {
                    chainType: "monad"
                }
            },
        }
    ]
];

/**
 * Examples for the update wallet action
 */
export const updateWalletExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "Can I add a new policy to my wallet?" },
        },
        {
            user: "agent",
            content: {
                text: "Sure! I'll update your wallet with the new policy.",
                action: "PRIVY_UPDATE_WALLET",
            },
        }
    ]
];

/**
 * Examples for the get wallets action
 */
export const getWalletsExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "Can you show me all my wallets on Ethereum?" },
        },
        {
            user: "agent",
            content: {
                text: "I'll fetch all your wallets on Ethereum.",
                action: "PRIVY_GET_WALLETS",
            },
        }
    ]
];

/**
 * Examples for the send transaction action
 */
export const sendTransactionExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "Please send 100000 wei to 0xE3070d3e4309afA3bC9a6b057685743CF42da77C." },
        },
        {
            user: "agent",
            content: {
                text: "I'll send the specified amount to the given address.",
                action: "PRIVY_SEND_TRANSACTION",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "Please send 1.5 ETH to 0xE3070d3e4309afA3bC9a6b057685743CF42da77C." },
        },
        {
            user: "agent",
            content: {
                text: "I'll send 1.5 ETH to the specified address.",
                action: "PRIVY_SEND_TRANSACTION",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "Send 0.5 MON from my Monad wallet to 0xE3070d3e4309afA3bC9a6b057685743CF42da77C." },
        },
        {
            user: "agent",
            content: {
                text: "I'll send 0.5 MON from your Monad wallet to the specified address.",
                action: "PRIVY_SEND_TRANSACTION",
                options: {
                    chainType: "monad"
                }
            },
        }
    ]
];

/**
 * Examples for the sign transaction action
 */
export const signTransactionExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: { text: "Can you sign a transaction to send 100000 wei to 0xE3070d3e4309afA3bC9a6b057685743CF42da77C?" },
        },
        {
            user: "agent",
            content: {
                text: "I'll sign the transaction with the provided details.",
                action: "PRIVY_SIGN_TRANSACTION",
            },
        }
    ],
    [
        {
            user: "user",
            content: { text: "Sign a transaction on Monad to send 0.25 MON to 0xE3070d3e4309afA3bC9a6b057685743CF42da77C." },
        },
        {
            user: "agent",
            content: {
                text: "I'll sign the Monad transaction with the provided details.",
                action: "PRIVY_SIGN_TRANSACTION",
                options: {
                    chainType: "monad"
                }
            },
        }
    ]
]; 
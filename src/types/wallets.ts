import { State } from "@ai16z/eliza";

// Extend the State type to include action options
declare module "@ai16z/eliza" {
    interface State {
        action?: {
            options?: Record<string, any>;
        };
    }
} 
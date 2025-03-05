# Plugin Development Guide for Eliza Search Plugins

This guide provides step-by-step instructions for implementing search plugins for the Eliza AI agent framework, with specific focus on Tavily and Exa search implementations.

## Prerequisites

1. Node.js 23 or higher
2. pnpm package manager
3. TypeScript knowledge
4. API keys for the search service you want to implement:
   - Tavily API key from [Tavily](https://tavily.com)
   - Exa API key from [Exa](https://exa.ai)

## Project Setup

1. Clone the starter repository:

   ```bash
   git clone https://github.com/tmc/eliza-plugin-starter
   cd eliza-plugin-starter
   pnpm install
   ```

2. Set up your environment:

   ```bash
   # Create a .env file
   touch .env

   # Add your API keys
   echo "TAVILY_API_KEY=your_key_here" >> .env
   echo "EXA_API_KEY=your_key_here" >> .env
   ```

## Plugin Structure

Each search plugin follows this structure:

```typescript
// PLACEHOLDER: imports

export interface SearchPluginConfig {
  apiKey: string;
  maxResults?: number;
  searchType?: string;
  filters?: Record<string, unknown>;
}

export class SearchPlugin implements Plugin {
  name: string;
  description: string;
  config: SearchPluginConfig;
  actions: SearchAction[];
}
```

Please refer to the [official documentation](https://ai16z.github.io/eliza/docs/packages/plugins/) for further details about how to implement a plugin for your specific use case.

## Implementing Tavily Search Plugin

1. **Create Plugin Configuration**

   ```typescript
   interface TavilyPluginConfig extends SearchPluginConfig {
     searchType?: "search" | "news" | "academic";
   }

   const DEFAULT_CONFIG: Partial<TavilyPluginConfig> = {
     maxResults: 5,
     searchType: "search",
   };
   ```

2. **Implement Search Action**

   ```typescript
   const TAVILY_SEARCH: SearchAction = {
     name: "TAVILY_SEARCH",
     description: "Search the web using Tavily API",
     // Refer to the documentation for proper examples of example array format, these should show the agent how the plugin is used, not be a single message that indicates what might trigger it.
     examples: [
       [
         {
           user: "user",
           content: { text: "Search for recent AI developments" },
         },
       ],
     ],
     // the similes array is just in case the model decides the action it's trying to perform is called something different today, which occasionally happens with small models. Mostly superfluous these days, but we still keep it around just in case.
     similes: ["tavilysearch", "tavily"],
     validate: async (runtime, message, state) => {
       try {
         validateSearchQuery(message.content);
         return true;
       } catch {
         return false;
       }
     },
     handler: async (runtime, message, state) => {
       // Implementation details below
     },
   };
   ```

3. **Implement API Integration**

   ```typescript
   async handler(runtime, message, state) {
     try {
       const query = validateSearchQuery(message.content);
       const response = await fetch('https://api.tavily.com/search', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.config.apiKey}`,
         },
         body: JSON.stringify({
           query,
           search_type: this.config.searchType,
           max_results: this.config.maxResults,
         }),
       });

       // Process results
       const data = await response.json();
       return {
         success: true,
         response: formatSearchResults(data.results),
       };
     } catch (error) {
       return handleApiError(error);
     }
   }
   ```

## Implementing Exa Search Plugin

1. **Create Plugin Configuration**

   ```typescript
   // It will be helpful here to examine the SearchPlugin that already exists in the @ai16z/eliza main repository to see what fields are required when defining a plugin interface, as well as how we extend them here.
   interface ExaPluginConfig extends SearchPluginConfig {
     searchType?: "semantic" | "code" | "document";
     filters?: {
       language?: string;
       fileType?: string;
     };
   }

   const DEFAULT_CONFIG: Partial<ExaPluginConfig> = {
     maxResults: 5,
     searchType: "semantic",
   };
   ```

2. **Implement Search Action**

   ```typescript
   const EXA_SEARCH: SearchAction = {
     name: "EXA_SEARCH",
     description:
       "Search using Exa API for semantic, code, and document search",
     // this is also a bad example of an examples array. I'll update this in the future to be more useful, but for now, refer to the official documenation for how the examples array ought to be formatted.
     examples: [
       [
         {
           user: "user",
           content: { text: "Find code examples for implementing OAuth" },
         },
       ],
     ],
     similes: ["exa", "exasearch"],
     validate: async (runtime, message, state) => {
       try {
         validateSearchQuery(message.content);
         return true;
       } catch {
         return false;
       }
     },
     handler: async (runtime, message, state) => {
       // Implementation details below
     },
   };
   ```

3. **Implement API Integration**

   ```typescript
   async handler(runtime, message, state) {
     try {
       const query = validateSearchQuery(message.content);
       const response = await fetch('https://api.exa.ai/search', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.config.apiKey}`,
         },
         body: JSON.stringify({
           query,
           search_type: this.config.searchType,
           max_results: this.config.maxResults,
           filters: this.config.filters,
         }),
       });

       // Process results
       const data = await response.json();
       return {
         success: true,
         response: formatSearchResults(data.results),
       };
     } catch (error) {
       return handleApiError(error);
     }
   }
   ```

## Testing Your Implementation

1. **Unit Tests**

   ```typescript
   describe("SearchPlugin", () => {
     it("should validate search queries", async () => {
       const plugin = new SearchPlugin(config);
       const result = await plugin.actions[0].validate(runtime, {
         content: { text: "test query" },
       });
       expect(result).toBe(true);
     });
   });
   ```

2. **Integration Testing**

   ```typescript
   describe("API Integration", () => {
     it("should return search results", async () => {
       const plugin = new SearchPlugin(config);
       const results = await plugin.actions[0].handler(runtime, {
         content: { text: "test query" },
       });
       expect(results.success).toBe(true);
       expect(Array.isArray(results.response)).toBe(true);
     });
   });
   ```

## Error Handling and Best Practices

1. **Rate Limiting**

   ```typescript
   const rateLimiter = createRateLimiter(60, 60000); // 60 requests per minute

   if (!rateLimiter.checkLimit()) {
     return {
       success: false,
       response: "Rate limit exceeded. Please try again later.",
     };
   }
   ```

2. **Error Handling**

   ```typescript
   try {
     // API calls
   } catch (error) {
     return handleApiError(error);
   }
   ```

3. **Input Validation**

   ```typescript
   function validateSearchQuery(content: Content): string {
     if (!content?.text) {
       throw new Error("Search query is required");
     }
     return content.text.trim();
   }
   ```

## Further Notes

The core abstractions in the Eliza frawework are Action, Provider, and Evaluator. Both of these plugins only implement the Action abstraction -- they may function a lot more smoothly if returning the results as a Provider, and adding Evaluators that determine when or if these specific search services ought to be called. Further development on this repo will illustrate adding plugins which add additional Providers and Evaluators, as well as the preferred way to add external services not directly implemented within the plugin code. Hopefully, this is enough to get you started on the right track -- I STRONGLY encourage you to review the documentation as well as the first few episodes of Agent Dev School on youtube to guide you along your journey with Eliza. She'll be right there with you. :)

## Resources

- [Eliza Documentation](https://ai16z.github.io/eliza/)
- [Tavily API Documentation](https://tavily.com/docs)
- [Exa API Documentation](https://exa.ai/docs)
- [Example Implementations](https://github.com/ai16z/eliza/tree/main/packages)
- [AI Agent Dev School](https://www.youtube.com/watch?v=ArptLpQiKfI&list=PLx5pnFXdPTRzWla0RaOxALTSTnVq53fKL&ab_channel=ShawMakesMagic)

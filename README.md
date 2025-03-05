# Eliza Plugin Starter Template

This repository provides a starter template for creating plugins for the [Eliza](https://github.com/ai16z/eliza) AI agent framework. It includes example implementations for search functionality using Tavily and Exa APIs.

## Prerequisites

- Node.js 23+
- pnpm
- TypeScript knowledge

## Getting Started

1. Clone this repository:
```bash
git clone https://github.com/yourusername/eliza-plugin-starter.git
cd eliza-plugin-starter
```

2. Install dependencies:
```bash
pnpm install
```

3. Compile the TypeScript code:
```bash
pnpm tsc
```

4. Run the project using the 'direct' client:
```bash
pnpm exec node --loader ts-node/esm ./src/scripts/load-with-plugin.ts --characters=./characters/eternalai.character.json
```

**Note:** Only the 'direct' client will work within this repo since it uses mocked capabilities of the real client. Plugins developed here can be directly transposed into the main Eliza repository.

## Project Overview

This starter template is designed to work with the 'direct' client within this repository due to the mocked capabilities of the real client. Plugins developed here are fully compatible with the main Eliza repository and can be directly transposed.

## Project Structure

```
src/
  ├── plugins/
  │   ├── tavily/     # Tavily search plugin implementation
  │   └── exa/        # Exa search plugin implementation
  ├── common/         # Shared utilities and types
  └── index.ts        # Main entry point
```

## Creating a Plugin

See the [Plugin Development Guide](docs/PLUGIN_GUIDE.md) for detailed instructions on creating your own plugin.

## Running the Project

You can run the project using the following command:

```bash
pnpm exec node --loader ts-node/esm ./src/scripts/load-with-plugin.ts --characters=./characters/eternalai.character.json
```

**Alternatively,** to simplify this process, use the predefined script:

```bash
pnpm mock-eliza --characters=./characters/eternalai.character.json
```

This script will prompt for a comma-separated list of character files to load.

**Note:** The 'mock-eliza' script uses the 'direct' client because the project contains mocked capabilities of the real client.

## Example Plugins

This template includes two example plugin implementations:

1. Tavily Search Plugin: Demonstrates web search capabilities using the Tavily API
2. Exa Search Plugin: Shows how to integrate with the Exa search API

Check the individual plugin directories for specific documentation and usage instructions.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT

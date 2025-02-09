This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Based Helper
![Group 4](https://github.com/user-attachments/assets/b75ce4bd-71ea-4fe5-a3ba-66e43bdee2b1)

Based Helper is an AI-powered DeFi trading assistant that harnesses real-time market data to automate token trades and deliver personalized experiences on Base. Accessible via Twitter, Lens, Discord, or our web app, it adapts its interface in real time to your commands.

![Uploading Skärmavbild 2025-02-09 kl. 15.03.50.png…]()

## Description

Leveraging continuous, real-time analysis of live swap data and market movements from Uniswap via The Graph subgraphs, Based Helper fuses AI-powered market insights with automated DeFi trading—keeping you in full control while handling the heavy lifting. When you send a command via Twitter, Lens, Discord, or our web app, our AI agent immediately springs into action, ensuring every trade decision is based on the freshest data available.

With this approach, the agent is able to dynamically adapt and generate custom interfaces for the user depending on the request and the type of action that the agent cooked up. Here are a few example use cases:

* "Give me 5 tokens" presents a UI that lets you set the range for token deposition by percentage.
* "List some rare bored ape close to floor" opens a dedicated view where you can browse and select your preferred NFT.
* "Deposit ETH into a one sided vault" displays a specialized vault management panel, complete with your vault history.

Once the agent has prepared your custom trade order, you have full control over the next step. If you're happy with the agent's output, simply send ETH directly to the generated Coinbase smart account. Alternatively, you can modify the order using our dynamic interface—adjusting parameters as needed—and execute the trade in one seamless transaction. Leveraging paymasters and bundlers to sponsor gas fees, our system efficiently converts your ETH into ERC‑20 tokens while ensuring you remain in control of every decision.

## How It's Made

Based Helper is built on a robust, multi-layer architecture that interconnects client interfaces, an AI agent, data modules, smart account management, and a dynamic execution layer:

* **Client Interaction**: Users send commands via API, Twitter, Lens, or Discord, which are routed to our AI agent.
* **AI Agent & Action Module**: Our agent, built on a customized fork of the Eliza framework hosted on Autonome, listens to user inputs and figures out what kind of action the user wants to execute. It extracts as many variables as possible from the input and passes this structured information to the Action Module for order preparation.
* **Data Integration**: We continuously analyze real-time swap data and market movements from The Graph, Uniswap, and other trusted sources. This dynamic analysis feeds into our system, ensuring every trade order reflects the latest market conditions.
* **Valuation Engine**: Our sophisticated token valuation system employs a comprehensive scoring mechanism that combines traditional metrics like TVL, volume, and net buys with advanced analytics—including smart money momentum and liquidity health.
* **Smart Account Management**: When you initiate an order, the system generates a private key and automatically creates a Coinbase smart account. Your order, along with the account's public address, is stored and awaits further action.
* **Frontend & On-Chain Integration**: Our dynamic user interface is built using Next.js, delivering a responsive and intuitive experience. For on-chain interactions, we integrate with viem and wagmi, ensuring secure and seamless communication with Base mainnet.
* **Trade Execution on Base**: All actions and smart account operations are executed on Base, ensuring that your transactions benefit from a secure, scalable, and efficient environment.
* **Dynamic UI Components**: The agent's output informs our adaptive web interface, which renders the most relevant UI components based on your command.

### Agent Code
[Code diff for Eliza framework](https://github.com/elizaOS/eliza/compare/main...jonathangus:eliza:agentic-hackathon?expand=1)

[Agent repo](https://github.com/elizaOS/eliza/tree/agentic-hackathon)
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

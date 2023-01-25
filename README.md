# Pascal Protocol Client
Trade directly on the outcome of events on chain. A community derivative tied to real-world financial and economic events.

<img width="800" alt="Home" src="https://user-images.githubusercontent.com/34775928/213886123-589b7df0-b5e5-41f5-99d2-1b37f012b6c1.png">
<img width="800" alt="Creating market" src="https://user-images.githubusercontent.com/34775928/214466087-259fb3fd-2404-4b0e-b76b-bd2992bb7f1f.png">


## Getting Started
[![My Tech Stack](https://github-readme-tech-stack.vercel.app/api/cards?title=Tech%20stack&borderRadius=8&showBorder=false&lineCount=2&theme=github_dark&hideBg=true&line1=Next.js,Next.js,FFF;Chakra%20UI,Chakra%20UI,319795;MongoDB,MongoDB,47A248;Vercel,Vercel,000;&line2=TypeScript,TypeScript,3178C6;Web3.js,Web3.js,F16822;GitHub%20Actions,GitHub%20Actions,2088FF;)](https://github-readme-tech-stack.vercel.app/api/cards?title=Tech%20stack&borderRadius=8&showBorder=false&lineCount=2&theme=github_dark&hideBg=true&line1=Next.js,Next.js,FFF;Chakra%20UI,Chakra%20UI,319795;MongoDB,MongoDB,47A248;Vercel,Vercel,000;&line2=TypeScript,TypeScript,3178C6;Web3.js,Web3.js,F16822;GitHub%20Actions,GitHub%20Actions,2088FF;)

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To provision liquidity for new markets, you can run:
```
npm run makeMarket [marketPk]
```
To maintain a non-informative distribution while still ensuring that the market is initialized/starts around 50% probability for each outcome, I use a combination of both random and uniform distributions to generate random prices using a uniform distribution, and then apply a bias to the prices so that the mean of the prices is 1.5 (50% outcome probability).

Note: market outcome probabilities might not exactly settle at 50% after all the above market making operation, so one should increase number of orders so the bias will have a cumulative effect over a larger number of orders.

MVP Demo is live on devnet at [pascal.fi](https://www.pascal.fi/)

## To-Dos
- [] Integration with Human Protocol for resolving arbitrary markets
- [] Comprehensive Portfolio page

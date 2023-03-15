import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  getMarketPrices,
  getMintInfo,
  ClientResponse,
  createOrderUiStake,
  ProtocolAddresses,
} from "@monaco-protocol/client";
import {
  mapPricesToOutcomesAndForAgainst,
  mapOrdersToOutcomesAndForAgainst,
} from "./mappers";
import { parseMarketPricesAndPendingOrders } from "./parsers";
import { AnchorProvider, Program, setProvider } from "@project-serum/anchor";

export async function marketMake(program, marketPk: PublicKey) {
  const numOrders = 3;
  const minPrice = 50; // Initializing market buy price at 50
  const maxPrice = 70;
  const minSize = 1;
  const maxSize = 2;

  const buyOrders: Array<{ price: number; size: number }> = [];
  const sellOrders: Array<{ price: number; size: number }> = [];

  let totalPrice = 0;
  for (let i = 0; i < numOrders; i++) {
    // Generate a random price with uniform distribution
    let price = Math.round(minPrice + Math.random() * (maxPrice - minPrice));
    totalPrice += price;
    // Generate a random size between the min and max size
    const size = minSize + Math.floor(Math.random() * (maxSize - minSize + 1));
    // 50% chance of placing a buy order or a sell order
    if (Math.random() < 0.5) {
      buyOrders.push({ price, size });
    } else {
      sellOrders.push({ price, size });
    }
  }
  const meanPrice = totalPrice / numOrders;
  const bias = Math.round(50 - meanPrice);
  buyOrders.forEach((order) => (order.price += bias));
  sellOrders.forEach((order) => (order.price += bias));
  console.log("buyOrders", buyOrders);
  console.log("sellOrders", sellOrders);

  // Place the orders for sell and buy side for first outcome
  try {
    for (const order of sellOrders) {
      const response = await createOrderUiStake(
        program,
        marketPk,
        0, // outcome index
        false, // sell side
        order.price,
        order.size // stake
      );
      logResponse(response);
    }
    // for (const order of buyOrders) {
    //   const response = await createOrderUiStake(
    //     program,
    //     marketPk,
    //     0, // outcome index
    //     true, // buy side
    //     order.price,
    //     order.size // stake
    //   );
    //   logResponse(response);
    // }

    // Place the orders for sell and buy side for second outcome
    for (const order of sellOrders) {
      const response = await createOrderUiStake(
        program,
        marketPk,
        0, // outcome index
        false, // sell side
        order.price,
        order.size // stake
      );
      logResponse(response);
    }
    // for (const order of buyOrders) {
    //   const response = await createOrderUiStake(
    //     program,
    //     marketPk,
    //     0, // outcome index
    //     true, // buy side
    //     order.price,
    //     order.size // stake
    //   );
    //   logResponse(response);
    // }
    console.log("Market made successfully");
  } catch (e) {
    console.error("marketMake error", e);
    return;
  }
}

export async function getPriceData(program, marketPk: PublicKey) {
  function matchedTotalFromParsedOutcomeAccounts(marketOutcomeAccounts) {
    let marketMatchedTotal = 0;
    marketOutcomeAccounts.map((marketOutcome) => {
      marketMatchedTotal += marketOutcome.matchedTotal;
    });
    return marketMatchedTotal;
  }

  function liquidityTotalFromParsedMarketPrices(marketPrices) {
    let marketLiquidity = 0;
    marketPrices.map((marketPrice) => {
      marketLiquidity += marketPrice.matchingPool.liquidityAmount;
    });
    return marketLiquidity;
  }

  const response = await getMarketPrices(program, marketPk);
  const mintDetails = await getMintInfo(
    program,
    response.data.market.mintAccount
  );
  const parsedMarketPrices = parseMarketPricesAndPendingOrders(
    response.data,
    mintDetails.data.decimals,
    true,
    true
  );
  const marketOutcomeAccounts = parsedMarketPrices.marketOutcomeAccounts.map(
    (marketOutcomeAccount) => {
      return marketOutcomeAccount.account;
    }
  );
  const matchedTotal = matchedTotalFromParsedOutcomeAccounts(
    marketOutcomeAccounts
  );
  const liquidityTotal = liquidityTotalFromParsedMarketPrices(
    parsedMarketPrices.marketPrices
  );
  const marketOutcomesSummary = parsedMarketPrices.marketOutcomeAccounts.map(
    (outcome) => {
      return {
        index: outcome.account.index,
        outcome: outcome.account.title,
        latestMatchedPrice: outcome.account.latestMatchedPrice,
        matchedTotal: outcome.account.matchedTotal,
      };
    }
  );

  const outcomeTitles = marketOutcomeAccounts.map((outcome) => {
    return outcome.title;
  });
  const pendingOrders = parsedMarketPrices.pendingOrders.map((order: any) => {
    return order.account;
  });
  const marketPriceSummary = mapPricesToOutcomesAndForAgainst(
    outcomeTitles,
    parsedMarketPrices.marketPrices
  );

  // logJson({
  //   pendingOrderSummary: pendingOrderSummary,
  //   marketPriceSummary: marketPriceSummary,
  //   marketOutcomesSummary: marketOutcomesSummary,
  //   liquidityTotal: liquidityTotal,
  //   matchedTotal: matchedTotal,
  //   totalUnmatchedOrders: parsedMarketPrices.pendingOrders.length,
  // });

  const data = {
    marketTitle: parsedMarketPrices.market.title,
    pendingOrders,
    marketPriceSummary,
    marketOutcomesSummary,
    liquidityTotal,
    matchedTotal,
    totalUnmatchedOrders: parsedMarketPrices.pendingOrders.length,
  };

  return data;
}

export function logResponse(response: ClientResponse<{}>) {
  function logJson(json: object) {
    console.log(JSON.stringify(json, null, 2));
  }
  if (!response.success) {
    console.log(response.errors);
  } else {
    logJson(response);
  }
}

function logJson(json: object) {
  console.log(JSON.stringify(json, null, 2));
}

export async function getProgram() {
  const secret = JSON.parse(process.env.USER_PRIVATE_KEY as string) as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = Keypair.fromSecretKey(secretKey);
  const wallet = {
    publicKey: keypairFromSecretKey.publicKey,
    signTransaction: () => Promise.reject(),
    signAllTransactions: () => Promise.reject(),
  };
  const connection = new Connection(clusterApiUrl("devnet"));
  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);
  const protocolAddress = new PublicKey(ProtocolAddresses.DEVNET_STABLE);

  const program = await Program.at(protocolAddress, provider);

  console.log(`Protocol type: stable`);
  console.log(`RPC node: ${program.provider.connection.rpcEndpoint}`);
  console.log(`Wallet PublicKey: ${program.provider.publicKey}`);

  return program;
}

export function getProcessArgs(
  expectedArgs: string[],
  exampleInvocation: string
): any {
  const defaultArgLength = 2;
  if (process.argv.length != defaultArgLength + expectedArgs.length) {
    console.log(
      `Expected number of args: ${expectedArgs.length}\n` +
        `Example invocation: ${exampleInvocation} ${expectedArgs
          .toString()
          .replace(/,/g, " ")}`
    );
    process.exit(1);
  }
  const namedArgs = process.argv.slice(-expectedArgs.length);
  let values = {};
  expectedArgs.map(function (arg, i) {
    return (values[expectedArgs[i]] = namedArgs[i]);
  });
  console.log("Supplied arguments:");
  logJson(values);
  return values;
}

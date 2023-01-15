import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  getMarketPrices,
  getMintInfo,
  MarketOutcomeAccount,
  MarketPrice,
  ClientResponse,
} from "@monaco-protocol/client";
import {
  mapPricesToOutcomesAndForAgainst,
  mapOrdersToOutcomesAndForAgainst,
} from "./mappers";
import { parseMarketPricesAndPendingOrders } from "./parsers";

export async function getPriceSummary(marketPk: PublicKey, program) {
  console.log("getting price summary...");
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
  const marketOutcomesSummary = {};
  parsedMarketPrices.marketOutcomeAccounts.map((outcome) => {
    marketOutcomesSummary[outcome.account.title] = {
      latestMatchedPrice: outcome.account.latestMatchedPrice,
      matchedTotal: outcome.account.matchedTotal,
    };
  });

  const outcomeTitles = marketOutcomeAccounts.map((outcome) => {
    return outcome.title;
  });
  const pendingOrders = parsedMarketPrices.pendingOrders.map((order) => {
    return order.account;
  });

  const pendingOrderSummary = mapOrdersToOutcomesAndForAgainst(
    outcomeTitles,
    pendingOrders
  );
  const marketPriceSummary = mapPricesToOutcomesAndForAgainst(
    outcomeTitles,
    parsedMarketPrices.marketPrices
  );

  // logJson({
  //   pendingOrderSummary: pendingOrderSummary,
  //   marketPriceSummary: marketPriceSummary,
  //   marketOutcomesSummary: marketOutcomesSummary,
  //   marketTitle: parsedMarketPrices.market.title,
  //   marketLock: new Date(Number(parsedMarketPrices.market.marketLockTimestamp)),
  //   liquidityTotal: liquidityTotal,
  //   matchedTotal: matchedTotal,
  //   totalUnmatchedOrders: parsedMarketPrices.pendingOrders.length,
  // });

  const data = {
    pendingOrderSummary, // { for: [], against: [] }
    marketPriceSummary,
    marketOutcomesSummary,
  };

  return data;
}

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

export function logResponse(response: ClientResponse<{}>, toast?) {
  function logJson(json: object) {
    console.log(JSON.stringify(json, null, 2));
  }

  if (!response.success) {
    console.log(response.errors);
    toast({
      title: "Transaction failed",
      description: JSON.stringify(response.errors).replace(/^"(.*)"$/, "$1"),
      status: "error",
      duration: 8000,
      position: "bottom-right",
      isClosable: true,
      containerStyle: { marginBottom: "50px" },
    });
  } else {
    logJson(response);
  }
}

function logJson(json: object) {
  console.log(JSON.stringify(json, null, 2));
}

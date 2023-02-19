import { BN } from "@project-serum/anchor";
import {
  MarketPricesAndPendingOrders,
  MarketAccount,
  MarketOutcomeAccount,
  MarketPrice,
  Order,
} from "@monaco-protocol/client";

export function parseMarketPricesAndPendingOrders(
  marketPricesAndPendingOrders: MarketPricesAndPendingOrders,
  mintDecimals: number,
  reduceLadder: boolean = true,
  onlyShowOrdersInQueue: boolean = true
) {
  marketPricesAndPendingOrders.market = parseMarketAccount(
    marketPricesAndPendingOrders.market
  );
  marketPricesAndPendingOrders.marketOutcomeAccounts.map(
    (marketOutcomeAccount) => {
      marketOutcomeAccount.account = parseMarketOutcomeAccount(
        marketOutcomeAccount.account,
        mintDecimals,
        reduceLadder
      );
    }
  );
  marketPricesAndPendingOrders.marketPrices.map((marketPrices) => {
    marketPrices = parseMarketPrice(
      marketPrices,
      mintDecimals,
      onlyShowOrdersInQueue
    );
  });
  marketPricesAndPendingOrders.pendingOrders.map((order: any) => {
    order.account = parseOrderAccount(order.account, mintDecimals);
  });
  return marketPricesAndPendingOrders;
}

export function parseMarketAccount(market) {
  if (market.marketSettleTimestamp) {
    const settleTimestamp = market.marketSettleTimestamp as BN;
    market.marketSettleTimestamp = settleTimestamp.toNumber();
  }
  return market;
}

function parseMarketOutcomeAccount(
  marketOutcomeAccount,
  mintDecimals: number,
  reduceLadder: boolean = true
) {
  const parsedMarketOutcomeAccount = marketOutcomeAccount;
  parsedMarketOutcomeAccount.matchedTotal = parseTokenAmountBN(
    parsedMarketOutcomeAccount.matchedTotal,
    mintDecimals
  );
  if (reduceLadder) {
    const ladderStart = [
      ...parsedMarketOutcomeAccount.priceLadder.splice(0, 3),
    ];
    const ladderEnd = [
      ...parsedMarketOutcomeAccount.priceLadder.splice(
        parsedMarketOutcomeAccount.priceLadder.length - 3,
        3
      ),
    ];
    parsedMarketOutcomeAccount.priceLadder = [...ladderStart, ...ladderEnd];
  }
  return parsedMarketOutcomeAccount;
}

function parseMarketPrice(
  marketPrice,
  mintDecimals: number,
  onlyShowOrdersInQueue: boolean = true
) {
  const parsedMarketPrices = marketPrice;
  parsedMarketPrices.matchingPool.liquidityAmount = parseTokenAmountBN(
    parsedMarketPrices.matchingPool.liquidityAmount,
    mintDecimals
  );
  parsedMarketPrices.matchingPool.matchedAmount = parseTokenAmountBN(
    parsedMarketPrices.matchingPool.matchedAmount,
    mintDecimals
  );
  if (onlyShowOrdersInQueue)
    parsedMarketPrices.matchingPool.orders.items =
      parsedMarketPrices.matchingPool.orders.items.filter(
        (order) => order.toString() != "11111111111111111111111111111111"
      );
  return parsedMarketPrices;
}

function parseOrderAccount(order, mintDecimals: number) {
  order.creationTimestamp = order.creationTimestamp.toNumber();
  order.payout = parseTokenAmountBN(order.payout, mintDecimals);
  order.stake = parseTokenAmountBN(order.stake, mintDecimals);
  order.stakeUnmatched = parseTokenAmountBN(order.stakeUnmatched, mintDecimals);
  order.voidedStake = parseTokenAmountBN(order.voidedStake, mintDecimals);
  return order;
}

function parseTokenAmountBN(tokenAmount: BN, mintDecimals: number) {
  return tokenAmount.toNumber() / 10 ** mintDecimals;
}

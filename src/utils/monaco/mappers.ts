import { MarketPrice, Order } from "@monaco-protocol/client";

export function mapPricesToOutcomesAndForAgainst(
  outcomeTitles: string[],
  marketPrices: MarketPrice[]
) {
  const mapping = outcomeTitles.map((outcomeTitle) => {
    const forOutcome = marketPrices
      .filter(
        (marketPrice) =>
          marketPrice.forOutcome && marketPrice.marketOutcome === outcomeTitle
      )
      // Sort the prices array in descending order of price
      .sort((a, b) => b.price - a.price);
    const againstOutcome = marketPrices
      .filter(
        (marketPrice) =>
          !marketPrice.forOutcome && marketPrice.marketOutcome === outcomeTitle
      )
      .sort((a, b) => b.price - a.price);
    return {
      for: forOutcome.map((price) => {
        return {
          outcome: outcomeTitle,
          price: price.price,
          liquidity: price.matchingPool.liquidityAmount,
        };
      }),
      against: againstOutcome.map((price) => {
        return {
          outcome: outcomeTitle,
          price: price.price,
          liquidity: price.matchingPool.liquidityAmount,
        };
      }),
    };
  });
  return mapping;
}

export function mapOrdersToOutcomesAndForAgainst(
  outcomeTitles: string[],
  orders: Order[]
) {
  const mapping = outcomeTitles.map((outcomeTitle) => {
    const forOutcome = orders.filter(
      (order) =>
        order.forOutcome &&
        order.marketOutcomeIndex === outcomeTitles.indexOf(outcomeTitle)
    );
    const againstOutcome = orders.filter(
      (order) =>
        !order.forOutcome &&
        order.marketOutcomeIndex === outcomeTitles.indexOf(outcomeTitle)
    );
    return {
      for: forOutcome.map((order) => {
        return {
          outcome: outcomeTitle,
          expectedPrice: order.expectedPrice,
          stake: order.stake,
        };
      }),
      against: againstOutcome.map((order) => {
        return {
          outcome: outcomeTitle,
          expectedPrice: order.expectedPrice,
          stake: order.stake,
        };
      }),
    };
  });
  return mapping;
}

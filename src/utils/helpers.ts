import BN from "bn.js";

/**
 * Returns the number rounded to the nearest interval.
 * Example:
 *
 *   roundToNearest(1000.5, 1); // 1000
 *   roundToNearest(1000.5, 0.5);  // 1000.5
 *
 * @param {number} value    The number to round
 * @param {number} interval The numeric interval to round to
 * @return {number}
 */
export const roundToNearest = (value: number, interval: number) => {
  return Math.floor(value / interval) * interval;
};

/**
 * Groups price levels by their price
 * Example:
 *
 *  groupByPrice([ [1000, 100], [1000, 200], [993, 20] ]) // [ [ 1000, 300 ], [ 993, 20 ] ]
 *
 * @param levels
 */
export const groupByPrice = (levels: number[][]): number[][] => {
  return levels
    ?.map((level, idx) => {
      const nextLevel = levels[idx + 1];
      const prevLevel = levels[idx - 1];

      if (nextLevel && level[0] === nextLevel[0]) {
        return [level[0], level[1] + nextLevel[1]];
      } else if (prevLevel && level[0] === prevLevel[0]) {
        return [];
      } else {
        return level;
      }
    })
    .filter((level) => level.length > 0);
};

/**
 * Group price levels by given ticket size. Uses groupByPrice() and roundToNearest()
 * Example:
 *
 * groupByTicketSize([ [1000.5, 100], [1000, 200], [993, 20] ], 1) // [[1000, 300], [993, 20]]
 *
 * @param levels
 * @param ticketSize
 */
export const groupByTicketSize = (
  levels: number[][],
  ticketSize: number
): number[][] => {
  return groupByPrice(
    levels?.map((level) => [roundToNearest(level[0], ticketSize), level[1]])
  );
};

export function formatNumber(arg: number): string {
  return new Intl.NumberFormat("en-US").format(arg);
}

export function getCountdown(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;

  if (diff <= 0) {
    return "00d 00h 00m 00s";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((diff / 1000) % 60)
    .toString()
    .padStart(2, "0");

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function calculateProbability(
  bidPriceA: number,
  bidPriceB: number
): number {
  return bidPriceA / (bidPriceA + bidPriceB);
}

export function calculateAverageEntryPrices(tradeAccounts) {
  const avgEntryPrices: {
    outcomeIndex: number;
    entryPrice: number;
    totalCostBasis: number;
  }[] = [];
  [0, 1].forEach((outcomeIndex) => {
    const buys = tradeAccounts.filter(
      (a) =>
        a.account.marketOutcomeIndex === outcomeIndex && a.account.forOutcome
    );
    const sells = tradeAccounts.filter(
      (a) =>
        a.account.marketOutcomeIndex === outcomeIndex && !a.account.forOutcome
    );
    const netShares =
      buys.reduce((a, b) => a + parseInt(b.account.stake, 16), 0) -
      sells.reduce((a, b) => a + parseInt(b.account.stake, 16), 0);
    if (netShares !== 0) {
      const totalCost =
        buys.reduce(
          (a, b) => a + parseInt(b.account.stake, 16) * b.account.price,
          0
        ) -
        sells.reduce(
          (a, b) => a + parseInt(b.account.stake, 16) * b.account.price,
          0
        );
      const avgEntryPrice = +(totalCost / netShares).toFixed(2);
      const costBasis = +(avgEntryPrice * netShares).toFixed(2);
      avgEntryPrices.push({
        outcomeIndex: outcomeIndex,
        entryPrice: avgEntryPrice,
        totalCostBasis: costBasis,
      });
    } else {
      avgEntryPrices.push({
        outcomeIndex: outcomeIndex,
        entryPrice: 0,
        totalCostBasis: 0,
      });
    }
  });
  return avgEntryPrices;
}

export function getSellOrderMatches(
  avgEntryPrice: number,
  totalStake: number,
  buyOrders: { outcome: string; price: number; liquidity: BN }[]
) {
  console.log("buyOrders", buyOrders);
  let sellOrders: { [price: number]: number } = {};
  let unmatchedStake: { [price: number]: { price: number; stake: number } } =
    {};
  let remainingStake = totalStake;
  let totalSaleValue = 0;
  let profitLoss = 0;

  for (let buyOrder of buyOrders) {
    let matchedStake = Math.min(remainingStake, Number(buyOrder.liquidity));
    let saleValue = matchedStake * buyOrder.price;
    // totalSaleValue is tracked and increased by the sale value of each matching order
    totalSaleValue += saleValue;

    sellOrders[buyOrder.price] = matchedStake;
    remainingStake -= matchedStake;
  }

  if (remainingStake > 0) {
    unmatchedStake[avgEntryPrice] = {
      price: avgEntryPrice,
      stake: remainingStake,
    };
  }

  let costBasis = (totalStake - remainingStake) * avgEntryPrice;
  // pnl is the difference between the total sale value and the cost basis
  profitLoss = buyOrders.length ? totalSaleValue - costBasis : 0;

  return {
    sellOrders: Object.entries(sellOrders).map(([price, stake]) => ({
      price: parseFloat(price),
      stake,
    })),
    totalMatchingStake: totalStake - remainingStake,
    unmatchedStake,
    profitLoss: Number(profitLoss.toFixed(2)),
  };
}

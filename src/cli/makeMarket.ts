import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse } from "@/utils/monaco";

/* To maintain a non-informative distribution while
 * still ensuring that the market price settles at 0.5,
 * we use a combination of both random and uniform distributions.
 * We generate random prices using a uniform distribution, with a range of 0 to 1,
 * and then apply a bias to the prices so that the mean of the prices is 0.5.
 *
 * Note: market price might not exactly settle at 0.5 prob after all market operations
 * so should increase number of orders so the bias will have a cumulative effect over
 * a larger number of orders.
 */
export async function makeMarket(marketPk: PublicKey) {
  const program = await getProgram();
  const numOrders = 20;
  const minPrice = 1.2; // Initializing market buy price at 50
  const maxPrice = 1.8;
  const minSize = 1;
  const maxSize = 2;

  const buyOrders: Array<{ price: number; size: number }> = [];
  const sellOrders: Array<{ price: number; size: number }> = [];

  let totalPrice = 0;
  for (let i = 0; i < numOrders; i++) {
    // Generate a random price with uniform distribution
    let price = minPrice + Math.random() * (maxPrice - minPrice);
    totalPrice += price;
    // Generate a random size between the min and max size
    const size = Math.floor(minSize + Math.random() * (maxSize - minSize + 1));
    // 50% chance of placing a buy order or a sell order
    if (Math.random() < 0.5) {
      buyOrders.push({ price, size });
    } else {
      sellOrders.push({ price, size });
    }
  }
  const meanPrice = totalPrice / numOrders;
  const bias = 1.5 - meanPrice;
  buyOrders.forEach((order) => {
    order.price += bias;
    order.price = parseFloat(order.price.toFixed(2));
  });
  sellOrders.forEach((order) => {
    order.price += bias;
    order.price = parseFloat(order.price.toFixed(2));
  });
  console.log("buyOrders", buyOrders);
  console.log("sellOrders", sellOrders);

  for (let index = 0; index < 2; index++) {
    for (const order of sellOrders) {
      const response = await createOrderUiStake(
        program,
        marketPk,
        index, // outcome index
        false, // sell side
        order.price,
        order.size // stake
      );
      logResponse(response);
    }

    for (const order of buyOrders) {
      const response = await createOrderUiStake(
        program,
        marketPk,
        index, // outcome index
        true, // order side
        order.price,
        order.size // stake
      );
      logResponse(response);
    }
  }
}

const args = getProcessArgs(["marketPk"], "npm run placeForOrder");
makeMarket(new PublicKey(args.marketPk));

async function placeBuyOrder(marketPk: PublicKey) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const forOutcome = false;
  const price = 2;
  const stake = 1;
  const response = await createOrderUiStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price,
    stake
  );
  logResponse(response);
}

async function placeSellOrder(marketPk: PublicKey) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const forOutcome = false;
  const price = 2;
  const stake = 1;
  const response = await createOrderUiStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price,
    stake
  );
  logResponse(response);
}

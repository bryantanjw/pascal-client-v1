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
async function marketMakeUniform(marketPk: PublicKey) {
  const program = await getProgram();
  const numOrders = 10;
  const minPrice = 1.3;
  const maxPrice = 1.8;
  const minSize = 4;
  const maxSize = 10;

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

export async function marketMake(marketPk: PublicKey) {
  const program = await getProgram();
  const numOrders = 4;
  const minBidPrice = 1.35;
  const maxBidPrice = 1.45;
  const minAskPrice = 1.55;
  const maxAskPrice = 1.65;
  const minSize = 4;
  const maxSize = 7;

  const buyOrders: Array<{ bidPrice: number; size: number }> = [];
  const sellOrders: Array<{ askPrice: number; size: number }> = [];

  for (let i = 0; i < numOrders; i++) {
    // Generate random prices
    let bidPrice = parseFloat(
      (Math.random() * (maxBidPrice - minBidPrice) + minBidPrice).toFixed(2)
    );
    let askPrice = parseFloat(
      (Math.random() * (maxAskPrice - minAskPrice) + minAskPrice).toFixed(2)
    );
    // Generate a random size between the min and max size
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

    buyOrders.push({ bidPrice, size });
    sellOrders.push({ askPrice, size });
  }
  // buyOrders.forEach((order) => order.price);
  console.log("buyOrders", buyOrders);
  console.log("sellOrders", sellOrders);

  // Place the orders for sell and buy side for first outcome
  try {
    for (let i = 0; i < 2; i++) {
      for (const order of sellOrders) {
        const response = await createOrderUiStake(
          program,
          marketPk,
          i, // outcome index
          false, // sell side
          order.askPrice,
          order.size // stake
        );
        logResponse(response);
      }
      for (const order of buyOrders) {
        const response = await createOrderUiStake(
          program,
          marketPk,
          i,
          true,
          order.bidPrice,
          order.size
        );
        logResponse(response);
      }
      console.log("Done!");
    }
  } catch (e) {
    console.error("marketMake error", e);
    return;
  }
}

const args = getProcessArgs(["marketPk"], "npm run marketMake");
marketMake(new PublicKey(args.marketPk));

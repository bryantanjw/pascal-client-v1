import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse } from "@/utils/monaco";

export async function makeMarket(marketPk: PublicKey) {
  const program = await getProgram();
  const numOrders = 5;
  const minPrice = 50;
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

  // Place the orders for buy and sell side for one outcome (first)
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

  for (const order of sellOrders) {
    const response = await createOrderUiStake(
      program,
      marketPk,
      1, // outcome index
      false, // sell side
      order.price,
      order.size // stake
    );
    logResponse(response);
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

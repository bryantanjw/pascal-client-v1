import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake, Orders } from "@monaco-protocol/client";
import {
  getProgram,
  getProcessArgs,
  logResponse,
  getPriceData,
} from "@/utils/monaco";

export async function placeOrder(marketPk: PublicKey) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const forOutcome = true;
  const price = 39;
  const stake = 1;
  const orderResponse = await createOrderUiStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price,
    stake
  );
  logResponse(orderResponse);
}

const args = getProcessArgs(["marketPk"], "npm run placeForOrder");
placeOrder(new PublicKey(args.marketPk));

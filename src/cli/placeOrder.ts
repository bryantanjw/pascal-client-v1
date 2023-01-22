import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse } from "@/utils/monaco";

export async function placeOrder(marketPk: PublicKey) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const forOutcome = false;
  const price = 56;
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

const args = getProcessArgs(["marketPk"], "npm run placeOrder");
placeOrder(new PublicKey(args.marketPk));

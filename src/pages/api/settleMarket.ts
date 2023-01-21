import { settleMarket } from "@monaco-protocol/admin-client";
import { getMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";

// Run job once per day at the end of the day (11:59 PM)
cron.schedule("59 23 * * *", async () => {
  try {
    const client = await clientPromise;
    const collection = client.db("pascal").collection("markets");
    // Extract the value of the publicKey field from each of the documents
    const markets = await collection
      .find(
        {},
        {
          projection: {
            publicKey: 1,
            marketSettleTimestamp: 1,
            resolutionSource: 1,
            resolutionTicker: 1,
            targetPrice: 1,
          },
        }
      )
      .toArray();

    const dt = new Date();
    const program = getProgram();
    for (const market of markets) {
      const currentTime = new Date();
      const marketSettleTimestamp = new Date(market.marketSettleTimestamp);
      if (currentTime >= marketSettleTimestamp) {
        const resolutionTicker = market.resolutionTicker;
        const price = await getPriceFromPythNetwork(resolutionTicker);
        if (price >= targetPrice) {
          const publicKey = new PublicKey(market.publicKey);
          const winningOutcomeIndex = 0;
          const settleResponse = await settleMarket(
            program,
            publicKey,
            winningOutcomeIndex
          );
          logResponse(settleResponse);

          // Get updated market account
          const marketResponse = await getMarket(program, publicKey!);
          const { marketSettleTimestamp, marketWinningOutcomeIndex } =
            marketResponse.data.account;
        }
      }
    }
  } catch (e) {
    console.error("Cron job settleMarket error", e);
  }
});

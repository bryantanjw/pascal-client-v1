import clientPromise from "@/lib/mongodb";
import { getPriceData, getProgram, logResponse } from "@/utils/monaco";
import { settleMarket } from "@monaco-protocol/admin-client";
import { getMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
const cron = require("node-cron");

// Run job every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    const client = await clientPromise;
    const markets = client.db("pascal").collection("markets");
    // Extract the value of the publicKey field from each of the documents
    const documents = await markets.find({}).toArray();
    const pubKeys = documents.map((doc) => doc.publicKey);
    console.log(pubKeys);

    const program = getProgram();
    for (const pubKey of pubKeys) {
      const priceData = await getPriceData(program, pubKey);
      const {
        marketPriceSummary,
        marketOutcomesSummary,
        liquidityTotal,
        matchedTotal,
        totalUnmatchedOrders,
      } = priceData;

      await markets.updateOne(
        { publicKey: pubKey },
        {
          $set: {
            marketPriceSummary: marketPriceSummary,
            liquidityTotal: liquidityTotal,
            matchedTotal: matchedTotal,
            totalUnmatchedOrders: totalUnmatchedOrders,
            prices: marketPriceSummary,
            outcomes: marketOutcomesSummary,
          },
        }
      );
    }
  } catch (e) {
    console.error("Cron job price data update error", e);
  }
});

// Run job once per day at the end of the day (11:59 PM)
// cron.schedule("59 23 * * *", async () => {
//   try {
//     const client = await clientPromise;
//     const collection = client.db("pascal").collection("markets");
//     // Extract the value of the publicKey field from each of the documents
//     const markets = await collection
//       .find(
//         {},
//         {
//           projection: {
//             publicKey: 1,
//             marketSettleTimestamp: 1,
//             resolutionSource: 1,
//             resolutionTicker: 1,
//             targetPrice: 1,
//           },
//         }
//       )
//       .toArray();

//     const dt = new Date();
//     const program = getProgram();
//     for (const market of markets) {
//       const currentTime = new Date();
//       const marketSettleTimestamp = new Date(market.marketSettleTimestamp);
//       if (currentTime >= marketSettleTimestamp) {
//         const resolutionTicker = market.resolutionTicker;
//         const price = await getPriceFromPythNetwork(resolutionTicker);
//         if (price >= targetPrice) {
//           const publicKey = new PublicKey(market.publicKey);
//           const winningOutcomeIndex = 0;
//           const settleResponse = await settleMarket(
//             program,
//             publicKey,
//             winningOutcomeIndex
//           );
//           logResponse(settleResponse);

//           // Get updated market account
//           const marketResponse = await getMarket(program, publicKey!);
//           const { marketSettleTimestamp, marketWinningOutcomeIndex } =
//             marketResponse.data.account;
//         }
//       }
//     }
//   } catch (e) {
//     console.error("Cron job settleMarket error", e);
//   }
// });

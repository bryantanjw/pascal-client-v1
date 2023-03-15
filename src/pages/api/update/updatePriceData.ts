import clientPromise from "@/lib/mongodb";
import { getPriceData, getProgram } from "@/utils/monaco";
import { PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import pLimit from "p-limit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const markets = client.db("pascal").collection("markets");
      // Extract the value of the publicKey field from each of the documents
      const documents = await markets
        .find({ "marketStatus.open": { $exists: true } })
        .toArray();
      const pubKeys = documents.map((doc) => doc.publicKey);
      console.log("Markets", pubKeys);

      const program = await getProgram();
      const limit = pLimit(2); // Limit concurrency n promises

      // Run tasks in parallel using Promise.all
      await Promise.all(
        pubKeys.map((pubKey) =>
          limit(async () => {
            const {
              marketPriceSummary,
              marketOutcomesSummary,
              liquidityTotal,
              matchedTotal,
              totalUnmatchedOrders,
            } = await getPriceData(program, new PublicKey(pubKey));

            await markets.updateOne(
              { publicKey: pubKey },
              {
                $set: {
                  liquidityTotal: liquidityTotal,
                  matchedTotal: matchedTotal,
                  totalUnmatchedOrders: totalUnmatchedOrders,
                  prices: marketPriceSummary,
                  outcomes: marketOutcomesSummary,
                },
              }
            );

            console.log("Updated market", pubKey);
          })
        )
      );
      console.log("Done!");

      res
        .status(200)
        .json({ statusCode: 200, message: "updatePriceData succeeded" });
    } catch (err) {
      console.error("Cron job price data update error");
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}

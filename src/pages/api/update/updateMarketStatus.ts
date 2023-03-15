import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { getProgram } from "@/utils/monaco";
import { PublicKey } from "@solana/web3.js";
import { getMarket } from "@monaco-protocol/client";

// Run job every 5 minutes on GitHub Actions
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const markets = client.db("pascal").collection("markets");

      // Use a projection to retrieve only the necessary fields
      const projection = {
        _id: 0,
        publicKey: 1,
        marketStatus: 1,
        marketLockTimestamp: 1,
      };

      // Get markets that are either open or locked
      const documents = await markets
        .find(
          {
            $or: [
              { "marketStatus.open": { $exists: true } },
              { "marketStatus.locked": { $exists: true } },
              { "marketStatus.initializing": { $exists: true } },
            ],
          },
          { projection }
        )
        .toArray();

      console.log(
        "Updating status for markets",
        documents.map((doc) => doc.publicKey)
      );

      const bulkUpdate = markets.initializeUnorderedBulkOp();

      for (const doc of documents) {
        const { publicKey, marketStatus, marketLockTimestamp } = doc;

        // Check if the market is open and the lock timestamp has passed
        if (marketStatus.open && marketLockTimestamp) {
          // Convert the hex timestamp to a decimal timestamp
          const decimalTimestamp = parseInt(marketLockTimestamp, 16);
          // Convert the decimal timestamp to a Date object
          const lockDate = new Date(decimalTimestamp * 1000);

          // Check if the lock timestamp has passed
          if (new Date() >= lockDate) {
            // Update the market status to locked
            bulkUpdate
              .find({ publicKey })
              .updateOne({ $set: { marketStatus: { locked: {} } } });
            console.log("Updated market", publicKey, "to locked");
          }
        } else if (marketStatus.locked || marketStatus.initializing) {
          // Update the market status (in case it's been settled)
          const program = await getProgram();
          const getMarketResponse = await getMarket(
            program,
            new PublicKey(publicKey)
          );
          const {
            suspended,
            marketWinningOutcomeIndex,
            marketStatus,
            marketSettleTimestamp,
          } = getMarketResponse.data.account;

          bulkUpdate.find({ publicKey }).updateOne({
            $set: {
              suspended,
              marketWinningOutcomeIndex,
              marketStatus,
              marketSettleTimestamp,
            },
          });
          console.log("Updated market", publicKey);
        }
      }

      // Execute the bulk write operation
      await bulkUpdate.execute();
      console.log("Done!");

      res
        .status(200)
        .json({ statusCode: 200, message: "updateMarketStatus succeeded" });
    } catch (err) {
      console.error("updateMarketStatus error:", err);
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}

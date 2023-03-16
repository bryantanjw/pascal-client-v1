import { NextApiRequest, NextApiResponse } from "next";
import { PythHttpClient, PriceStatus } from "@pythnetwork/client";
import {
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client/lib/cluster";
import { Connection, PublicKey } from "@solana/web3.js";
import { settleMarket } from "@monaco-protocol/admin-client";
import clientPromise from "@/lib/mongodb";
import { getProgram, logResponse } from "@/utils/monaco";
import { getMarket } from "@monaco-protocol/client";

/* This is run once everyday at 8pm UTC (1 hour before US market close).
 * This is only used to autonomously settle markets Financial and Crypto markets
 * that are to be resolved by Pyth.
 * */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const program = await getProgram();
      const client = await clientPromise;
      const documents = client.db("pascal").collection("markets");
      const markets = await documents
        .find({
          $or: [
            { "marketStatus.open": { $exists: true } },
            { "marketStatus.locked": { $exists: true } },
          ],
        })
        .toArray();

      const dt = new Date();

      for (const market of markets) {
        const marketPk = new PublicKey(market.publicKey);
        const marketResolutionDate = new Date(
          parseInt(market.marketLockTimestamp, 16) * 1000
        );
        console.log("Currently resolving market", market.title);
        console.log(
          "Resolution is later than today?",
          dt >= marketResolutionDate
        );

        if (dt >= marketResolutionDate) {
          if (market.resolutionSource === "Pyth") {
            const connection = new Connection(getPythClusterApiUrl("pythnet"));
            const pythPublicKey = getPythProgramKeyForCluster("pythnet");
            const pythClient = new PythHttpClient(connection, pythPublicKey);

            const data = await pythClient.getData();
            const price = data.productPrice.get(market.oracleSymbol)!;

            if (price.price && price.confidence) {
              console.log(
                `${market.oracleSymbol}: $${price.price} \xB1$${price.confidence}`
              );

              const winningOutcomeIndex =
                price.price > parseInt(market.resolutionValue) ? 0 : 1;
              console.log("Winning outcome index is", winningOutcomeIndex);
              const response = await settleMarket(program, marketPk, 0);
              logResponse(response);

              const marketResponse = await getMarket(program, marketPk);
              const account = marketResponse?.data.account;

              if (response.success) {
                console.log(`Market ${market.title} settled successfully`);
                documents.updateOne(
                  { publicKey: market.publicKey },
                  {
                    $set: {
                      marketStatus: account.marketStatus,
                      marketSettleTimestamp: account.marketSettleTimestamp,
                      marketWinningOutcomeIndex:
                        account.marketWinningOutcomeIndex,
                    },
                  }
                );
                console.log(`Market ${market.publicKey} updated to settled`);
              } else {
                console.log("Response error", response.errors);
                throw Error;
              }
            } else {
              console.error(
                `${
                  market.oracleSymbol
                }: price currently unavailable. status is ${
                  PriceStatus[price.status]
                }`
              );
              throw new Error(
                `${market.oracleSymbol}: price currently unavailable`
              );
            }
          }
        }
      }
      res.status(200).json({
        statusCode: 200,
        message: "settleMarket endpoint ran successfully",
      });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}

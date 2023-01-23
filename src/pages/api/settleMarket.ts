import { NextApiRequest, NextApiResponse } from "next";
import { PythHttpClient, PriceStatus } from "@pythnetwork/client";
import {
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client/lib/cluster";
import { Connection, PublicKey } from "@solana/web3.js";
import { settleMarket } from "@monaco-protocol/admin-client";
import clientPromise from "@/lib/mongodb";
import { getPriceData, getProgram, logResponse } from "@/utils/monaco";

// Run job every 10 minutes
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const documents = client.db("pascal").collection("markets");
      const markets = await documents
        .find({ "marketStatus.open": { $exists: true } })
        .toArray();

      const program = await getProgram();
      const dt = new Date();

      for (const market of markets) {
        const marketResolutionDate = new Date(
          parseInt(market.marketLockTimestamp, 16) * 1000
        );
        console.log(
          "resolution is later than today?",
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
                price.price > market.resolutionValue ? 0 : 1;
              const response = await settleMarket(
                program,
                market.publicKey,
                winningOutcomeIndex
              );
              logResponse(response);

              if (response.success) {
                console.log(`Market ${market.title} settled successfully`);
              } else {
                console.log("settleMarket", response.errors);
              }
            } else {
              console.log(
                `${
                  market.oracleSymbol
                }: price currently unavailable. status is ${
                  PriceStatus[price.status]
                }`
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
      console.error("Cron job settleMarket error");
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}

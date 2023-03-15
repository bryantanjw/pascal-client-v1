import clientPromise from "@/lib/mongodb";
import apiKeyAuthMiddleware from "./middleware";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("body is", req.body);
      const {
        category,
        description,
        marketCreateTimestamp,
        tag,
        ticker,
        resolutionSource,
        resolutionValue,
        oracleSymbol,
        marketAccount,
        priceData,
      } = req.body;
      const { publicKey, account } = marketAccount;
      const {
        marketPriceSummary,
        marketOutcomesSummary,
        liquidityTotal,
        matchedTotal,
        totalUnmatchedOrders,
      } = priceData;

      // Add market to db
      const client = await clientPromise;
      const markets = client.db("pascal").collection("markets");
      const market = await markets.insertOne({
        publicKey,
        ...account,
        category,
        description,
        marketCreateTimestamp,
        tag,
        ticker,
        resolutionSource,
        resolutionValue,
        oracleSymbol,
        liquidityTotal,
        matchedTotal,
        totalUnmatchedOrders,
      });
      console.log(
        `A document is inserted into markets with the _id: ${market.insertedId}`
      );

      // Update market data in db
      await markets.updateOne(
        { _id: market.insertedId },
        {
          $set: {
            prices: marketPriceSummary,
            outcomes: marketOutcomesSummary,
          },
        }
      );

      res.status(200).send({ status: "success" });
    } catch (e) {
      throw e;
    }
  } else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}

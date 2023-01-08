import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("body is", req.body);
      const {
        category,
        description,
        tag,
        marketAccount,
        outcomeAccounts,
        tradeAccount,
      } = req.body;

      // Add market to db
      const client = await clientPromise;
      const markets = client.db("pascal").collection("markets");
      const market = await markets.insertOne({
        marketAccount,
        outcomeAccounts,
      });
      console.log(
        `A document is inserted into markets with the _id: ${market.insertedId}`
      );

      // Update market data in db
      await markets.updateOne(
        { _id: market.insertedId },
        {
          $set: {
            category: category,
            description: description,
            tag: tag,
          },
        }
      );

      // Add market's (empty) trade accounts to db
      const trades = client.db("pascal").collection("trades");
      const trade = await trades.insertOne({
        marketId: market.insertedId,
        tradeAccount,
      });
      console.log(
        `A document is inserted into trades with the _id: ${trade.insertedId}`
      );

      res.status(200).send({ status: "success" });
    } catch (e) {
      throw e;
    }
  } else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}

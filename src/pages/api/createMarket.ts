import clientPromise from "@/lib/mongodb"

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            console.log("body is", req.body)
            const { marketAccount, category, description, outcomeAccounts } = req.body

            // Add market to db
            const client = await clientPromise
            const markets = client.db("pascal").collection("markets")
            const market = await markets.insertOne({
                marketAccount,
                outcomeAccounts,
            })
            console.log(`A document is inserted with the _id: ${market.insertedId}`)

            // Update market data in db
            await markets.updateOne(
                { _id: market.insertedId },
                { $set: { 
                    category: category,
                    description: description,
                } },
                { upsert: true }
            );

            res.status(200).send({ status: "success" })
        } catch (e) {
            throw e;
        }
    } else {
        res.status(405).send(`Method ${req.method} not allowed`)
    }
}
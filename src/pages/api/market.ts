import clientPromise from "@/lib/mongodb"

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("pascal");

       const market = await db
           .collection("markets")
           .find( { marketId: "SPY-22OCT30-412" } )
           .toArray();

       res.json(market);
   } catch (e) {
       console.error(e);
   }
};
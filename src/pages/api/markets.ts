import clientPromise from "@/lib/mongodb"

export default async (req, res) => {
   try {
       const client = await clientPromise
       const db = client.db("pascal")

       const markets = await db
           .collection("markets")
           .find({})
           .toArray()

       res.json(markets)
   } catch (e) {
       console.error(e)
   }
}
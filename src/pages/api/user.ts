import clientPromise from "@/lib/mongodb"

export default async (req, res) => {
   try {
    const { pubKey } = req.query
    
    const client = await clientPromise
    const db = client.db("pascal")

    const user = await db
        .collection("users")
        .find({ pubKey: pubKey })
        .toArray()

    res.json(user[0])
   } catch (e) {
       console.error(e)
   }
}
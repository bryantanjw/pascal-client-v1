import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("pascal");

    const market = await db.collection("markets").find({}).toArray();
    res.status(200).json(market);
  } catch (e) {
    console.error(e);
  }
}

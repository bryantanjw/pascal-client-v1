import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("pascal");

    const market = await db
      .collection("markets")
      .find({})
      .sort({
        "marketStatus.open": -1,
        "marketStatus.locked": -1,
        "marketStatus.settled": -1,
      })
      .toArray();
    res.status(200).json(market);
  } catch (e) {
    console.error(e);
    res.status(500).json({ statusCode: 500, message: e });
  }
}

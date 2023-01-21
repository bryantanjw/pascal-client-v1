import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const { publicKey } = req.query;

    const client = await clientPromise;
    const db = client.db("pascal");

    const user = await db
      .collection("users")
      .find({ userPk: publicKey })
      .toArray();

    res.json(user[0]);
  } catch (e) {
    console.error(e);
  }
}

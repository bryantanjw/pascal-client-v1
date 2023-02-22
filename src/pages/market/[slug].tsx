import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Market from "components/Market";
import clientPromise from "@/lib/mongodb";

// This gets called at build time
export const getStaticPaths = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("pascal");

    const markets = await db.collection("markets").find({}).toArray();

    return {
      paths: markets.map((market: any) => `/market/${market.publicKey}`),
      fallback: false,
    };
  } catch (e) {
    console.error("Error getStaticPaths", e);
  }
};

export const getStaticProps = async ({ params: { slug } }) => {
  try {
    const client = await clientPromise;
    const db = client.db("pascal");

    const market = await db
      .collection("markets")
      .find({ publicKey: slug })
      .toArray();
    return {
      props: { market: JSON.parse(JSON.stringify(market[0])) },
    };
  } catch (e) {
    console.error("Error getStaticProps", e);
    throw Error("Failed to connect to MongoDB");
  }
};

export default function Slug({
  market,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <Provider store={store}>
      <Market market={market} />
    </Provider>
  );
}

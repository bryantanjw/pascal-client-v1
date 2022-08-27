import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import MarketView from 'components/MarketView';
import { fetchMarketData } from 'lib/api';
import markets from "../api/markets.json";

function getMarkets() {
  const allProducts = markets.map((market) => {

    const { ...props } = market;
    return props
  });

  return allProducts;
}

// This gets called at build time
export async function getStaticPaths() {
  const allMarkets = getMarkets();
  return {
    // Get the paths to pre-render based on products at build time
    paths: allMarkets.map((market: any) => `/trade/${market.marketId}`),
    fallback: false,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the product questionId
  const market = await fetchMarketData(params.slug);
  if (!market) {
    throw new Error(`Market with ID '${params!.marketId}' not found`);
  }
  // Past product data to the page via props
  return { props: { market } }
}

export default function Slug({ market }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <MarketView market={market} />
  )
}
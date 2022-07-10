import type { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import ProductView from 'components/ProductView';
import { fetchProductData } from 'lib/api';
import products from "../api/products.json";

function getProducts() {
  const allProducts = products.map((product) => {

    const { ...props } = product;
    return props
  });

  return allProducts;
}

// This gets called at build time
export async function getStaticPaths() {
  const allProducts = getProducts();

  return {
    // Get the paths to pre-render based on products at build time
    paths: allProducts.map((product: any) => `/trade/${product.questionId}`),
    fallback: false,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the product questionId
  const product = await fetchProductData(params.slug);

  if (!product) {
    throw new Error(`Product with question ID '${params!.questionId}' not found`);
  }
  // Past product data to the page via props
  return { props: { product } }
}

export default function Slug({ product }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <ProductView p={product} />
  )
}
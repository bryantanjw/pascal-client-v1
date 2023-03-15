import { Suspense } from "react";
import type { NextPage } from "next";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Box, Center, Spinner } from "@chakra-ui/react";
import Layout from "components/Layout";
import WithSubnavigation from "components/TopBar";
import Portfolio from "components/Portfolio";

import styles from "@/styles/Home.module.css";

const PortfolioPage: NextPage = ({}: InferGetStaticPropsType<
  typeof getStaticProps
>) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pascal Portfolio</title>
        <meta
          name="description"
          content="Trade directly on the outcome of events"
        />
        <meta property="og:title" content="Pascal Protocol" />
        <meta
          property="og:description"
          content="Trade directly on the outcome of events"
        />
        <meta property="og:image" content="/Preview.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WithSubnavigation />

      <Layout>
        <Box
          maxW={{ base: "3xl", lg: "5xl" }}
          mx="auto"
          py={{ base: "10", md: "0" }}
          zIndex={1}
        >
          <Suspense
            fallback={
              <Center mt={"200px"}>
                <Spinner />
              </Center>
            }
          >
            <Portfolio />
          </Suspense>
        </Box>
      </Layout>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default PortfolioPage;

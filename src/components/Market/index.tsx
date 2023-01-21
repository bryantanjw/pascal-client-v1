import React, { useState, useEffect, createContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  Box,
  Divider,
  Stack,
  HStack,
  SimpleGrid,
  Heading,
  Flex,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  useColorModeValue as mode,
  Image,
  IconButton,
} from "@chakra-ui/react";
import ChakraNextLink from "../ChakraNextLink";
import { ArrowBackIcon } from "@chakra-ui/icons";
import MarketProgress from "./MarketProgress";
import { Stat } from "./Stat";
import NewsList from "./NewsList";
import { TradeForm } from "./TradeForm.tsx";
import WithSubnavigation from "../TopBar";
import MarketResolution from "./MarketResolution";
import Outcomes from "./Outcomes";
import Layout from "../Layout";
import { useProgram } from "@/context/ProgramProvider";

import styles from "@/styles/Home.module.css";
import { getPriceData } from "@/utils/monaco";
import { PublicKey } from "@solana/web3.js";

// Dynamically load ResearchGraph component on client side
const ResearchGraph = dynamic(import("./ResearchGraph"), {
  ssr: false,
});

export const PriceDataContext = createContext<any>({});

const Market = ({ market }) => {
  const program = useProgram();
  const { asPath } = useRouter();
  const marketPk = asPath.split("/")[2];
  const [priceData, setPriceData] = useState<any>(null);

  // START: Style config //
  const dividerColor = mode("gray.300", "#464A54");
  const iconColor = mode("invert(0%)", "invert(100%)");
  const tabListStyle = {
    fontWeight: " semibold",
    fontSize: "lg",
    px: 0,
    textColor: "gray.400",
    _selected: {
      textColor: mode("black", "gray.100"),
      borderColor: mode("black", "gray.100"),
    },
    _hover: {
      textColor: mode("gray.600", "gray.200"),
    },
    _active: {
      bg: "none",
    },
  };
  const sectionHeadingStyle = {
    fontSize: "lg",
    fontWeight: "bold",
  };
  const gradientBackgroundStyle = {
    filter: "blur(80px)",
    position: "absolute",
    zIndex: -1,
    opacity: "50%",
    width: "40%",
  };
  // END: Style config //

  const stats = [
    { label: "Total Volume", value: `$${market.liquidityTotal}` },
    // { label: "Liquidity", value: market.volume },
    {
      label: "Closing Date - UTC",
      value: new Date(
        parseInt(market.marketLockTimestamp, 16) * 1000
      ).toLocaleString(),
    },
  ];

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const res = await getPriceData(program, new PublicKey(marketPk));
        if (res) {
          setPriceData(res);
        } else console.log("loading...");
      } catch (error) {
        console.log("fetchPriceData error: ", error);
      }
    };
    fetchPriceData();
  }, [program]);

  return (
    <PriceDataContext.Provider value={priceData}>
      <div className={styles.container}>
        <Head>
          <title>{market.title}</title>
          <meta
            name="description"
            content="Trade directly on the outcome of events"
          />
          <meta property="og:title" content={market.title} />
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
            overflow={{ base: "hidden", lg: "visible" }}
            maxW={{ base: "3xl", lg: "5xl" }}
            mx="auto"
            px={{ base: "1", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "12" }}
          >
            <ChakraNextLink
              to={"/"}
              _hover={{ textDecoration: "none" }}
              display={"inline-block"}
            >
              <Stack
                mb={3}
                align={"center"}
                direction={"row"}
                width={{ base: "full", md: "full" }}
              >
                <HStack
                  _hover={{ bg: mode("gray.200", "gray.700") }}
                  rounded={"lg"}
                  py={1}
                  transition={"all 0.2s ease"}
                >
                  <IconButton
                    aria-label="back"
                    size={"lg"}
                    icon={<ArrowBackIcon />}
                    variant={"unstyled"}
                  />
                  <Heading
                    _before={{ bg: mode("black", "white") }}
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="extrabold"
                  >
                    {/* {market.title} */}
                  </Heading>
                </HStack>
              </Stack>
            </ChakraNextLink>

            <Stack
              direction={{ base: "column", lg: "row" }}
              align={{ lg: "flex-start" }}
              spacing={5}
            >
              <Stack spacing={4} minW={"sm"} flex="2">
                <Tabs colorScheme={"black"}>
                  <TabList>
                    <Tab mr={8} sx={tabListStyle}>
                      Outcomes
                    </Tab>
                    <Tab sx={tabListStyle}>Graph</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel key={0} px={0}>
                      <Outcomes market={market} />
                    </TabPanel>
                    <TabPanel key={1} px={0}>
                      Price graph coming soon!
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                <Tabs isLazy colorScheme={"black"}>
                  {" "}
                  {/* isLazy defers rendering until tab is selected */}
                  <TabList>
                    <Tab sx={tabListStyle} mr={8}>
                      About
                    </Tab>
                    <Tab sx={tabListStyle}>Research and News</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel key={0} px={0}>
                      <Flex flexDirection={"column"}>
                        <Stack>
                          <MarketProgress account={market} />

                          <Divider borderColor={dividerColor} />

                          {/* Statistics */}
                          <Stack py={3} direction={"column"}>
                            <HStack spacing={3}>
                              <Image
                                filter={iconColor}
                                alt="Statistics"
                                width={"18px"}
                                src={`/Statistics.png`}
                              />
                              <Heading sx={sectionHeadingStyle}>
                                Statistics
                              </Heading>
                            </HStack>
                            <SimpleGrid columns={{ base: 2, md: 3 }}>
                              {stats.map(({ label, value }) => (
                                <Stat key={label} label={label} value={value} />
                              ))}
                            </SimpleGrid>
                          </Stack>

                          <Divider borderColor={dividerColor} />

                          {/* Market Resolution */}
                          <Stack py={3} direction={"column"}>
                            <HStack spacing={3}>
                              <Image
                                filter={iconColor}
                                alt="Resolution"
                                width={"18px"}
                                src={`/Resolution.png`}
                              />
                              <Heading sx={sectionHeadingStyle}>
                                Market Resolution
                              </Heading>
                            </HStack>

                            <MarketResolution market={market} />
                          </Stack>

                          <Divider borderColor={dividerColor} />

                          {/* Discussion */}
                          {/* <Stack py={3} direction={'column'}>
                                                <HStack spacing={3}>
                                                    <Image filter={iconColor} alt='Discussion' width={'18px'} src={`/Discussion.png`} />
                                                    <Heading sx={sectionHeadingStyle}>Discussion</Heading>
                                                </HStack>

                                                <DiscussionForm />
                                                <DiscussionList />
                                            </Stack> */}
                        </Stack>
                      </Flex>
                    </TabPanel>

                    <TabPanel key={1} px={0}>
                      <Stack marginTop={2}>
                        {(market.category === "Financials" ||
                          market.category === "Crypto" ||
                          market.category === "Economics") && (
                          <ResearchGraph market={market} />
                        )}
                        <NewsList market={market} />
                      </Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>

              <Flex
                direction="column"
                align={"center"}
                position={{ sm: "relative", lg: "sticky" }}
                top={{ base: "none", lg: "20" }}
              >
                <TradeForm market={market} />
              </Flex>

              <Image
                sx={gradientBackgroundStyle}
                src={"/gradient-bg1.png"}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                alt={"background"}
                right={"100px"}
                transform={"rotate(280deg)"}
              />
            </Stack>
          </Box>
        </Layout>
      </div>
    </PriceDataContext.Provider>
  );
};

export default Market;

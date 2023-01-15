import React, { useState, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
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
import ChakraNextLink from "@/components/ChakraNextLink";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { PublicKey } from "@solana/web3.js";
import {
  getMarket,
  MarketAccount,
  getMarketOutcomesByMarket,
  MarketOutcomeAccount,
  GetAccount,
} from "@monaco-protocol/client";

import MarketProgress from "@/components/Market/MarketProgress";
import { Stat } from "@/components/Market/Stat";
import NewsList from "@/components/Market/NewsList";
import { TradeForm } from "@/components/Trade/TradeForm.tsx";
import WithSubnavigation from "@/components/TopBar";
import MarketResolution from "@/components/Market/MarketResolution";
import Outcomes from "@/components/Market/Outcomes";
import Layout from "@/components/Layout";
import { useProgram } from "@/context/ProgramProvider";

import styles from "@/styles/Home.module.css";
import { store } from "@/store/store";
import { setTitle } from "@/store/slices/outcomeSlice";

type FormData = {
  [marketOutcome: string]: {
    forOrAgainst: "For" | "Against";
    odds: number;
    stake: number;
  };
};

const defaultFormValues = {
  forOrAgainst: "For" as "For",
  odds: 1.5,
  stake: 0,
};

const MarketView = () => {
  const dispatch = useDispatch();
  const program = useProgram();
  const [market, setMarket] = useState<GetAccount<MarketAccount>>();
  const [marketOutcomes, setMarketOucomes] =
    useState<GetAccount<MarketOutcomeAccount>[]>();
  const [formData, setFormData] = useState<FormData>();

  // Style config
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
  };
  const sectionHeadingStyle = {
    fontSize: "lg",
    fontWeight: "bold",
  };
  const gradientBackgroundStyle = {
    filter: "blur(110px)",
    position: "absolute",
    zIndex: -1,
    opacity: "50%",
    width: "40%",
  };
  // Style config

  const stats = [
    { label: "Liquidity", value: "liquidity" },
    { label: "Total Volume", value: "volume" },
    {
      label: "Closing Date - UTC",
      value: new Date(
        market?.account.marketLockTimestamp.toNumber()! * 1000
      ).toUTCString(),
    },
  ];

  const marketAccount = new PublicKey(
    "FYs6qqBWY2tBy3213G37ZRM3ADwnJkRQePKLg4L2htgN"
  );

  const getMarketData = async () => {
    try {
      const marketResponse = await getMarket(program, marketAccount);
      setMarket(marketResponse.data);
      console.log("market", market);
      // const createMarketResponse = await createVerboseMarket(program)
      // console.log("createMarketResponse", createMarketResponse)

      const marketOutcomeAccountsResponse = await getMarketOutcomesByMarket(
        program,
        marketAccount
      );
      setMarketOucomes(
        marketOutcomeAccountsResponse.data.marketOutcomeAccounts
      );
      console.log("marketOutcomes", marketOutcomes);

      const defaultFormState =
        marketOutcomeAccountsResponse.data.marketOutcomeAccounts.reduce(
          (formState: FormData, { account: { title } }) => ({
            ...formState,
            [title]: defaultFormValues,
          }),
          {}
        );
      setFormData(defaultFormState);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getMarketData();
    dispatch(setTitle(market?.[0].account.title));
  }, [program]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{market?.account.title}</title>
        <meta
          name="description"
          content="Trade directly on the outcome of events"
        />
        <meta property="og:title" content={"title"} />
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
                pr={4}
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
                  {market?.account.title}
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
                  <Tab sx={tabListStyle} mr={7}>
                    Outcomes
                  </Tab>
                  <Tab sx={tabListStyle}>Orderbook</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel key={0} px={0}>
                    <Outcomes marketOutcomes={marketOutcomes} />
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Tabs isLazy colorScheme={"black"}>
                {" "}
                {/* isLazy defers rendering until tab is selected */}
                <TabList>
                  <Tab sx={tabListStyle} mr={7}>
                    About
                  </Tab>
                  <Tab sx={tabListStyle}>Research and News</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel key={0} px={0}>
                    <Flex flexDirection={"column"}>
                      <Stack>
                        {market && (
                          <MarketProgress marketAccount={market?.account} />
                        )}

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

                          {/* <MarketResolution market={market} /> */}
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
                      {/* {(market.category === "Financials" || market.category === "Crypto" || market.category === "Economics") 
                                            && <ResearchGraph market={market} 
                                        />}
                                        <NewsList market={market} /> */}
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
              <TradeForm market={market} marketOutcomes={marketOutcomes} />
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
  );
};

export default function Page() {
  return (
    <Provider store={store}>
      <MarketView />
    </Provider>
  );
}

// Dynamically load ResearchGraph component on client side
const ResearchGraph = dynamic(import("@/components/Market/ResearchGraph"), {
  ssr: false,
});

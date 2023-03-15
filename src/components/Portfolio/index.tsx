import { createContext, useEffect, useState } from "react";
import useSWR from "swr";
import {
  Heading,
  Text,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue as mode,
  Stack,
  Switch,
  FormControl,
  FormLabel,
  Image as ChakraImage,
  Portal,
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Trades } from "@monaco-protocol/client";
import { MarketPositions } from "@monaco-protocol/client/src/market_position_query";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Stats from "components/Portfolio/Stats";
import PositionsTable from "components/Portfolio/PositionsTable";
import ReturnsGraph from "components/Portfolio/ReturnsGraph";
import ActivityTable from "components/Portfolio/ActivityTable";
import { useProgram } from "@/context/ProgramProvider";
import { calculateProbability } from "@/utils/helpers";

import styles from "@/styles/Home.module.css";

export const PositionsContext = createContext<any>({});

const Portfolio = () => {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [positions, setPositions] = useState<any>(null);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/getMarkets", fetcher);

  const tabStyle = {
    transform: "translateZ(0)",
    overflow: "hidden",
    p: 4,
    rounded: "12px",
    transition: "all 0.3s ease",
    _before: {
      content: "''",
      position: "absolute",
      zIndex: -1,
      mt: "75px",
      width: "100%",
      height: "100%",
    },
    _hover: {
      color: mode("gray.700", "gray.400"),
      _before: {
        background:
          "radial-gradient(circle at center bottom, hsl(0.00, 0%, 100%) -300%, transparent 68%)",
      },
    },
    _selected: {
      color: mode("gray.900", "gray.50"),
      _before: {
        background:
          "radial-gradient(circle at center bottom, hsl(0.00, 0%, 100%) -80%, transparent 71%)",
      },
    },
    _after: {
      content: "''",
      position: "absolute",
      zIndex: -1,
      inset: 0,
      bgClip: "content-box",
    },
  };

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await MarketPositions.marketPositionQuery(program)
          .filterByPurchaser(publicKey!)
          .fetch();
        if (response.success) {
          const marketPositionAccounts = response.data.marketPositionAccounts;

          const mapping = marketPositionAccounts
            .filter((position) =>
              data.some(
                (market) =>
                  market.publicKey === position.account.market.toBase58()
              )
            )
            .map((position) => {
              const market = data.find(
                (market) =>
                  market.publicKey === position.account.market.toBase58()
              );

              const marketBidYes =
                market.prices[0].against[market.prices[0].against.length - 1]
                  ?.price;
              const marketBidNo =
                market.prices[1].against[market.prices[1].against.length - 1]
                  ?.price;
              const probYes = calculateProbability(
                marketBidYes,
                marketBidNo
              ).toFixed(2);
              const totalStake = (
                parseFloat(position.account.outcomeMaxExposure[0].toString()) /
                  10 ** 6 +
                parseFloat(position.account.outcomeMaxExposure[1].toString()) /
                  10 ** 6
              ).toFixed(2);

              return {
                ...position,
                marketPk: market.publicKey,
                marketTitle: market.title,
                lockTimestamp: parseInt(market.marketLockTimestamp, 16) * 1000,
                probYes: probYes,
                marketStatus: Object.keys(market.marketStatus)[0],
                totalStake: totalStake,
                prices: market.prices,
              };
            });

          // Map over the positions array to fetch trades for each position
          const positionsWithTrades = await Promise.all(
            mapping.map(async (position) => {
              const trades = await Trades.tradeQuery(program)
                .filterByMarket(position.account.market)
                .filterByPurchaser(publicKey!)
                .fetch();
              return {
                ...position,
                trades: trades.data.tradeAccounts,
              };
            })
          );

          setPositions(positionsWithTrades);
        } else {
          console.log("Error fetching positions: ", response.errors);
          throw new Error();
        }
      } catch (error) {
        console.log("fetchPositions error: ", error);
      }
    };
    fetchPositions();
  }, [program, data]);

  return (
    <Box pt={14}>
      <Heading size="xl" mb="10">
        Your Portfolio_
      </Heading>

      {!publicKey ? (
        <Center py={12} flexDirection={"column"}>
          <Text py={4} fontSize={"lg"}>
            Connect your wallet to view portfolio
          </Text>
          <WalletMultiButton
            className={mode(
              styles.wallet_adapter_button_trigger_light_mode,
              styles.wallet_adapter_button_trigger_dark_mode
            )}
          />
        </Center>
      ) : (
        <PositionsContext.Provider value={positions}>
          <Stack spacing={12}>
            <Stats />

            <Tabs pt={4} index={tabIndex} variant={"unstyled"} isLazy>
              <FormControl
                display={"flex"}
                width={{ base: "full", md: "fit-content" }}
                justifyContent={{ base: "center", md: "flex-start" }}
                mb={{ base: 0, md: -14 }}
              >
                <TabList
                  transition={"all 0.3s ease"}
                  textColor={mode("gray.500", "gray.500")}
                  display={"inline-flex"}
                  backdropFilter={{ base: "", md: "blur(10px)" }}
                  alignItems={"center"}
                  border={mode(
                    "solid 1px rgba(0,0,0,0.1)",
                    "solid 1px rgba(255, 255, 255, 0.07)"
                  )}
                  rounded={"12px"}
                  bg={mode("rgba(255,255,255,0.6)", "rgba(32, 34, 46, 0.5)")}
                  boxShadow={"0px 2px 8px -1px #0000001a"}
                  _hover={{
                    borderColor: mode(
                      "rgba(0,0,0,0.15)",
                      "rgba(255, 255, 255, 0.15)"
                    ),
                  }}
                >
                  <Tab mr={-2} sx={tabStyle} onClick={() => setTabIndex(0)}>
                    Positions
                  </Tab>
                  <FormLabel htmlFor="tab" />
                  <Switch
                    id="tab"
                    variant={"glow"}
                    size={"md"}
                    isChecked={tabIndex === 1}
                    onChange={() => setTabIndex(tabIndex ? 0 : 1)}
                  />
                  <Tab sx={tabStyle} onClick={() => setTabIndex(1)}>
                    Activity
                  </Tab>
                </TabList>
              </FormControl>
              <TabPanels>
                <TabPanel key={1} px={0}>
                  {/* <ReturnsGraph /> */}
                  <PositionsTable />
                </TabPanel>

                <TabPanel key={2} px={0}>
                  <ActivityTable />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </PositionsContext.Provider>
      )}

      <Portal>
        <ChakraImage
          zIndex={-1}
          position={"fixed"}
          overflow={"hidden"}
          src={"/portfolioBgGlow.png"}
          alt="Pascal Portfolio"
          opacity={0.12}
          left={"20%"}
          width={"80%"}
          height={"100%"}
          top={"35%"}
          transform={"rotate(180deg)"}
        />
      </Portal>
    </Box>
  );
};

export default Portfolio;

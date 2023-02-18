import { createContext, useEffect, useState } from "react";
import {
  Box,
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
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { MarketPositions } from "@monaco-protocol/client/src/market_position_query";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Stats from "components/Portfolio/Stats";
import PositionsTable from "components/Portfolio/PositionsTable";
import ReturnsGraph from "components/Portfolio/ReturnsGraph";
import ActivityTable from "components/Portfolio/ActivityTable";
import { useProgram } from "@/context/ProgramProvider";

import styles from "@/styles/Home.module.css";
import { calculateProbability } from "@/utils/helpers";
import useSWR from "swr";

export const PositionsContext = createContext<any>({});

const Portfolio = () => {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [positions, setPositions] = useState<any>(null);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/getMarket", fetcher);

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
              const probYes = calculateProbability(
                market.prices[0].against[market.prices[0].against.length - 1]
                  ?.price,
                market.prices[1].against[market.prices[1].against.length - 1]
                  ?.price
              ).toFixed(2);
              const totalStake =
                parseFloat(position.account.outcomeMaxExposure[0].toString()) /
                  10 ** 6 +
                parseFloat(position.account.outcomeMaxExposure[1].toString()) /
                  10 ** 6;

              return {
                ...position,
                marketTitle: market.title,
                probYes: probYes,
                marketStatus: Object.keys(market.marketStatus)[0],
                totalStake: totalStake,
              };
            });
          setPositions(mapping);
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
    <>
      <Heading size="xl" mb="10">
        Your Portfolio_ &nbsp; 👋🏼
      </Heading>

      {!publicKey ? (
        <Center py={12} flexDirection={"column"}>
          <Text py={4} fontSize={"lg"}>
            Connect your wallet to view your portfolio
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

            <Tabs index={tabIndex} variant={"unstyled"}>
              <FormControl display={"flex"} justifyContent={"center"}>
                <TabList
                  textColor={mode("gray.500", "gray.500")}
                  display={"inline-flex"}
                  backdropFilter={{ base: "", md: "blur(10px)" }}
                  alignItems={"center"}
                  border={"solid 1px rgba(255, 255, 255, 0.07)"}
                  rounded={"12px"}
                  bg={mode("#FBFBFD", "rgba(32, 34, 46, 0.6)")}
                  boxShadow={"0px 2px 8px -1px #0000001a"}
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
          opacity={0.4}
          left={"30%"}
          width={"120%"}
          height={"180%"}
          top={"10%"}
          transform={"rotate(300deg)"}
        />
      </Portal>
    </>
  );
};

export default Portfolio;

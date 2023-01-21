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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import fetch from "unfetch";
import useSWR from "swr";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WithSubnavigation from "components/TopBar";
import { Stats } from "components/Portfolio/Stat";
import { PositionsTable } from "components/Portfolio/PositionsTable";
import { ReturnsGraph } from "components/Portfolio/ReturnsGraph";
import ActivityTable from "components/Portfolio/ActivityTable";
import Layout from "components/Layout";

import styles from "@/styles/Home.module.css";
import Summary from "@/components/Portfolio/Summary";

export function blurChange(publicKey) {
  let blur;
  if (publicKey) {
    blur = "blur(0px)";
  } else {
    blur = "blur(2px)";
  }
  return blur;
}

const fetcher = (url) => fetch(url).then((r) => r.json());

const Portfolio = () => {
  const { publicKey } = useWallet();

  const { data } = useSWR(
    `../api/user?pubKey=${publicKey?.toString()}`,
    fetcher
  );

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

  return (
    <div className={styles.container}>
      <WithSubnavigation />

      <Layout>
        <Box as="section" py="12" blur={"15px"}>
          <Box maxW={{ base: "3xl", lg: "5xl" }} mx="auto">
            <Box overflowX="auto">
              <Heading size="xl" mb="8">
                Your Portfolio_ &nbsp; 👋🏼
              </Heading>

              {!publicKey && (
                <Center py={12} flexDirection={"column"}>
                  <Text py={4} fontSize={"lg"}>
                    Connect your wallet to view your portfolio
                  </Text>
                  <WalletMultiButton
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    className={mode(
                      styles.wallet_adapter_button_trigger_light_mode,
                      styles.wallet_adapter_button_trigger_dark_mode
                    )}
                  />
                </Center>
              )}

              {publicKey && (
                <>
                  <Grid
                    templateRows="repeat(4)"
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      md: "repeat(6, 1fr)",
                    }}
                    gap={4}
                  >
                    <GridItem rowSpan={1} colSpan={4}>
                      <Stats user={data} />
                    </GridItem>
                    <GridItem
                      rowSpan={4}
                      colSpan={2}
                      bgColor={"rgb(17,18,32)"}
                      rounded={"3xl"}
                    >
                      <Summary />
                    </GridItem>
                    <GridItem mt={10} rowSpan={4} colSpan={4}>
                      <Tabs colorScheme={"black"}>
                        <TabList borderWidth={0}>
                          <Tab mr={8} sx={tabListStyle}>
                            Returns
                          </Tab>
                          <Tab sx={tabListStyle}>Activity</Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel key={1} px={0}>
                            <ReturnsGraph user={data} />
                            <PositionsTable user={data} />
                          </TabPanel>

                          <TabPanel key={2} px={0}>
                            <ActivityTable user={data} />
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </GridItem>
                  </Grid>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Layout>
    </div>
  );
};

export default Portfolio;

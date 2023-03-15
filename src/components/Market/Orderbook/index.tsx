import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PriceLevelRow, TitleRow } from "./Rows";
import Spread from "./Spread";
import DepthVisualizer from "./DepthVisualizer";
import GroupingSelectBox from "./GroupingSelectBox";
import { ResizablePanel } from "@/components/common/ResizablePanel";
import { MOBILE_WIDTH, ORDERBOOK_LEVELS } from "@/utils/constants";
import { formatNumber } from "@/utils/helpers";
import { PriceDataContext } from "..";

import { TableContainer } from "./styles";
import styles from "@/styles/Home.module.css";

const outcomeTickers: any = {
  0: "YES / USD",
  1: "NO / USD",
};

export enum OrderType {
  BIDS,
  ASKS,
}

interface OrderBookProps {
  outcomes: any;
  outcomeIndex: number;
  prices: any;
}

export const OrderBook: FunctionComponent<OrderBookProps> = ({
  outcomeIndex,
  prices,
}) => {
  const { colorMode } = useColorMode();
  const { publicKey } = useWallet();
  const { priceData } = useContext(PriceDataContext);
  const [sortedPriceLevels, setSortedPriceLevels] = useState([]);

  const lowestAskPrice =
    prices[outcomeIndex].against[prices[outcomeIndex].against.length - 1]
      ?.price;
  const highestBidPrice = prices[outcomeIndex].for[0]?.price;

  const tableContainerStyle = {
    background:
      colorMode === "light"
        ? "linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top, linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom, radial-gradient( farthest-side at 50% 0, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)) center top, radial-gradient( farthest-side at 50% 100%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)) center bottom"
        : "linear-gradient(rgba(32, 34, 46, 0.2) 30%, rgba(255, 255, 255, 0)) center top, linear-gradient(rgba(255, 255, 255, 0), rgba(32, 34, 46, 0.2) 70%) center bottom, radial-gradient( farthest-side at 50% 0, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)) center top, radial-gradient( farthest-side at 50% 100%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)) center bottom",
  };

  return (
    <ResizablePanel>
      {/* <GroupingSelectBox options={groupingOptions[outcomeIndex]} /> */}

      <Stack
        display={"flex"}
        direction={"column"}
        backdropFilter={"blur(5px)"}
        justifyContent={"center"}
        rounded={"2xl"}
        mt={3}
        borderWidth={1}
        borderColor={mode("#E5E7EB", "rgb(255,255,255,0.1)")}
        background={mode("#F8F9FA", "rgba(32, 34, 46, 0.2)")}
        spacing={0}
      >
        <Flex
          px={6}
          py={4}
          mb={-1}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Heading
            fontSize={"md"}
            fontWeight={"semibold"}
            color={mode("gray.700", "gray.200")}
          >
            Order Book
          </Heading>
          <Heading fontSize={"md"} color={mode("gray.700", "gray.200")}>
            {outcomeTickers[outcomeIndex]}
          </Heading>
        </Flex>
        <Divider borderColor={mode("#E2E8F0", "rgb(255,255,255,0.1)")} />
        <TitleRow reversedFieldsOrder={false} />
        {!publicKey ? (
          <Center py={9} flexDirection={"column"}>
            <Text mb={3}>Connect a wallet to view order book</Text>
            <WalletMultiButton
              // eslint-disable-next-line react-hooks/rules-of-hooks
              className={mode(
                styles.wallet_adapter_button_trigger_light_mode,
                styles.wallet_adapter_button_trigger_dark_mode
              )}
            />
          </Center>
        ) : priceData ? (
          <>
            <Box
              as={TableContainer}
              sx={tableContainerStyle}
              css={{
                "&::-webkit-scrollbar": {
                  width: "0.2em",
                  backgroundColor: "transparent",
                },
              }}
            >
              <PriceLevels
                priceData={priceData?.marketPriceSummary[outcomeIndex].against}
                orderType={OrderType.ASKS}
              />
            </Box>
            <Stack
              display={"flex"}
              direction={"row"}
              py={1}
              justifyContent={"center"}
              fontSize={"md"}
              spacing={6}
              borderWidth={"1px 0 1px 0"}
              borderColor={mode("#F8F9FA", "rgb(255,255,255,0.1)")}
              bgColor={mode("#F8F9FA", "transparent")}
            >
              <Text fontWeight={"normal"} color={mode("#616262", "gray.200")}>
                Last Matched Price
              </Text>
              <Text color={"#118860"}>
                $
                {
                  priceData?.marketOutcomesSummary[outcomeIndex]
                    .latestMatchedPrice
                }
              </Text>
            </Stack>
            <Box
              as={TableContainer}
              sx={tableContainerStyle}
              css={{
                "&::-webkit-scrollbar": {
                  width: "0.2em",
                  backgroundColor: "transparent",
                },
              }}
            >
              <PriceLevels
                priceData={priceData?.marketPriceSummary?.[outcomeIndex].for}
                orderType={OrderType.BIDS}
              />
            </Box>
          </>
        ) : (
          <Stack p={5}>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        )}
        <Spread highestBid={highestBidPrice} lowestAsk={lowestAskPrice} />
      </Stack>
    </ResizablePanel>
  );
};

export default OrderBook;

const PriceLevels = ({ priceData, orderType }) => {
  const [sortedPriceLevels, setSortedPriceLevels] = useState([]);

  useEffect(() => {
    // create a variable to keep track of total liquidity
    let totalLiquidity = 0;
    // map over the sorted data and create new array with the desired format
    const newSortedPriceLevels = priceData?.map((item) => {
      totalLiquidity += item.liquidity;
      return [item.price, item.liquidity, totalLiquidity];
    });
    // update state with new sorted price levels
    setSortedPriceLevels(newSortedPriceLevels);
  }, [priceData]);

  return (
    <>
      {sortedPriceLevels?.map((level, idx) => {
        const price: string = formatPrice(level[0]);
        const size: string = formatNumber(level[1]);
        const calculatedTotal: number = level[2];
        const total: string = formatNumber(calculatedTotal);
        const depth = level[2];

        return (
          <Box key={idx + depth} margin={0}>
            <DepthVisualizer key={depth} depth={depth} orderType={orderType} />
            <PriceLevelRow
              key={size + total}
              total={total}
              size={size}
              price={price}
              isRight={orderType === OrderType.BIDS}
            />
          </Box>
        );
      })}
    </>
  );
};

function formatPrice(arg: number): string {
  return arg.toLocaleString("en", {
    useGrouping: true,
    minimumFractionDigits: 0,
  });
}

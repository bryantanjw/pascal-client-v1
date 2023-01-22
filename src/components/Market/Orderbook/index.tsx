import React, { FunctionComponent, useContext } from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useSelector } from "@/store/store";
import { selectAsks, selectBids } from "@/store/slices/orderbookSlice";
import { PriceLevelRow, TitleRow } from "./Rows";
import Spread from "./Spread";
import DepthVisualizer from "./DepthVisualizer";
import GroupingSelectBox from "./GroupingSelectBox";
import { ResizablePanel } from "@/components/common/ResizablePanel";
import { MOBILE_WIDTH, ORDERBOOK_LEVELS } from "@/utils/constants";
import { formatNumber } from "@/utils/helpers";

import {
  OrderbookContainer,
  TableContainer,
  PriceLevelRowContainer,
} from "./styles";
import { PriceDataContext } from "..";

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
}

export const OrderBook: FunctionComponent<OrderBookProps> = ({
  outcomeIndex,
}) => {
  const { colorMode } = useColorMode();
  const priceData = useContext(PriceDataContext);
  const bids: number[][] = useSelector(selectBids);
  const asks: number[][] = useSelector(selectAsks);

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", {
      useGrouping: true,
      minimumFractionDigits: 0,
    });
  };

  const buildPriceLevels = (
    priceData,
    orderType: OrderType = OrderType.BIDS
  ): React.ReactNode => {
    // sort the data in descending order of price
    const sortedData = priceData?.sort((a, b) => b.price - a.price);
    // create a variable to keep track of total liquidity
    let totalLiquidity = 0;
    // map over the sorted data and create new array with the desired format
    const sortedPriceLevels = sortedData?.map((item) => {
      totalLiquidity += item.liquidity;
      return [item.price, item.liquidity, totalLiquidity];
    });

    return sortedPriceLevels?.map((level, idx) => {
      const price: string = formatPrice(level[0]);
      const size: string = formatNumber(level[1]);
      const calculatedTotal: number = level[2];
      const total: string = formatNumber(calculatedTotal);
      const depth = level[2];

      return (
        <PriceLevelRowContainer key={idx + depth}>
          <DepthVisualizer key={depth} depth={depth} orderType={orderType} />
          <PriceLevelRow
            key={size + total}
            total={total}
            size={size}
            price={price}
            isRight={orderType === OrderType.BIDS}
          />
        </PriceLevelRowContainer>
      );
    });
  };

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
        as={OrderbookContainer}
        rounded={"2xl"}
        borderWidth={1}
        borderColor={mode("#E5E7EB", "rgb(255,255,255,0.1)")}
        background={mode("#F8F9FA", "rgba(32, 34, 46, 0.2)")}
        spacing={0}
        boxShadow={"lg"}
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
        <Divider borderColor={"#E2E8F0"} />
        {priceData ? (
          <>
            <Box
              as={TitleRow}
              reversedFieldsOrder={false}
              bgColor={mode("#F8F9FA", "gray.700")}
              borderColor={mode("#F8F9FA", "gray.600")}
              textColor={mode("#616262", "gray.200")}
            />
            <Box as={TableContainer} sx={tableContainerStyle}>
              {buildPriceLevels(
                priceData?.marketPriceSummary[outcomeIndex].against,
                OrderType.ASKS
              )}
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
            <Box as={TableContainer} sx={tableContainerStyle}>
              {buildPriceLevels(
                priceData?.marketPriceSummary?.[outcomeIndex].for,
                OrderType.BIDS
              )}
            </Box>
          </>
        ) : (
          <Stack p={5}>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        )}
        <Spread bids={bids} asks={asks} />
      </Stack>
    </ResizablePanel>
  );
};

export default OrderBook;

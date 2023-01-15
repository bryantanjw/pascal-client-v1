import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "@/store/store";
import {
  addAsks,
  addBids,
  addExistingState,
  selectAsks,
  selectBids,
} from "@/store/slices/orderbookSlice";
import { PriceLevelRow, TitleRow } from "./Rows";
import Spread from "./Spread";
import Loader from "./Loader";
import DepthVisualizer from "./DepthVisualizer";
import GroupingSelectBox from "./GroupingSelectBox";
import { MOBILE_WIDTH, ORDERBOOK_LEVELS } from "@/utils/constants";
import { formatNumber } from "@/utils/helpers";

import {
  OrderbookContainer,
  TableContainer,
  PriceLevelRowContainer,
} from "./styles";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import { getPriceSummary } from "@/utils/monaco";
import { useProgram } from "@/context/ProgramProvider";
import { ResizablePanel } from "@/components/common/ResizablePanel";

const outcomeTickers: any = {
  0: "YES / USD",
  1: "NO / USD",
};

export enum OrderType {
  BIDS,
  ASKS,
}

interface OrderBookProps {
  outcomeIndex: number;
}

export const OrderBook: FunctionComponent<OrderBookProps> = ({
  outcomeIndex,
}) => {
  const program = useProgram();
  const { asPath } = useRouter();
  const marketPk = asPath.split("/")[2];
  const [windowWidth, setWindowWidth] = useState(0);
  const [data, setData] = useState<any>(null);

  const bids: number[][] = useSelector(selectBids);
  const asks: number[][] = useSelector(selectAsks);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPriceSummary = async () => {
      try {
        const res = await getPriceSummary(new PublicKey(marketPk), program);
        if (res) {
          setData(res);
        } else console.log("loading...");
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchPriceSummary();
  }, [program]);

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", {
      useGrouping: true,
      minimumFractionDigits: 0,
    });
  };

  const buildPriceLevels = (
    data,
    orderType: OrderType = OrderType.BIDS
  ): React.ReactNode => {
    // sort the data in descending order of price
    const sortedData = data?.sort((a, b) => b.price - a.price);
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
          <DepthVisualizer
            key={depth}
            windowWidth={windowWidth}
            depth={depth}
            orderType={orderType}
          />
          <PriceLevelRow
            key={size + total}
            total={total}
            size={size}
            price={price}
            isRight={orderType === OrderType.BIDS}
            windowWidth={windowWidth}
          />
        </PriceLevelRowContainer>
      );
    });
  };

  // Window width detection
  useEffect(() => {
    window.onresize = () => {
      setWindowWidth(window.innerWidth);
    };
    setWindowWidth(() => window.innerWidth);
  }, []);

  return (
    <ResizablePanel>
      {/* <GroupingSelectBox options={groupingOptions[outcomeIndex]} /> */}

      <Stack
        as={OrderbookContainer}
        rounded={"2xl"}
        borderWidth={1}
        borderColor={mode("#E5E7EB", "rgb(255,255,255,0.1)")}
        background={mode("whiteAlpha.800", "rgba(32, 34, 46, 0.2)")}
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
          <Heading fontSize={"md"} fontWeight={"semibold"} color={"gray.500"}>
            Order Book
          </Heading>
          <Heading fontSize={"md"} color={"gray.600"}>
            {outcomeTickers[outcomeIndex]}
          </Heading>
        </Flex>
        <Divider borderColor={"#E2E8F0"} />
        {data ? (
          <>
            <TitleRow windowWidth={windowWidth} reversedFieldsOrder={false} />
            <TableContainer>
              <div>
                {buildPriceLevels(
                  data?.marketPriceSummary[outcomeIndex].against,
                  OrderType.ASKS
                )}
              </div>
            </TableContainer>
            <Stack
              display={"flex"}
              direction={"row"}
              borderWidth={"1px 0"}
              py={1}
              justifyContent={"center"}
              fontSize={"md"}
              spacing={6}
            >
              <Text fontWeight={"medium"} color={"#98a6af"}>
                Last Matched Price
              </Text>
              <Text color={"#118860"}>
                $
                {formatPrice(
                  data?.marketOutcomesSummary[outcomeIndex === 0 ? "Yes" : "No"]
                    .latestMatchedPrice
                )}
              </Text>
            </Stack>
            <TableContainer>
              <div>
                {buildPriceLevels(
                  data?.marketPriceSummary[outcomeIndex].for,
                  OrderType.BIDS
                )}
              </div>
            </TableContainer>
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

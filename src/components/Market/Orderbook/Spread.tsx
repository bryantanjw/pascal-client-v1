import React, { FunctionComponent } from "react";
import { Text } from "@chakra-ui/react";
import { formatNumber } from "@/utils/helpers";

interface SpreadProps {
  bids: number[][];
  asks: number[][];
}

const Spread: FunctionComponent<SpreadProps> = ({ bids, asks }) => {
  const getHighestBid = (bids: number[][]): number => {
    const prices: number[] = bids?.map((bid) => bid[0]);
    return Math.max.apply(Math, prices);
  };

  const getLowestAsk = (asks: number[][]): number => {
    const prices: number[] = asks?.map((ask) => ask[0]);
    return Math.min.apply(Math, prices);
  };

  const getSpreadAmount = (bids: number[][], asks: number[][]): number =>
    Math.abs(getHighestBid(bids) - getLowestAsk(asks));

  const getSpreadPercentage = (spread: number, highestBid: number): string =>
    `(${((spread * 100) / highestBid).toFixed(2)}%)`;

  return (
    <Text
      color={"#98a6af"}
      fontSize={"sm"}
      px={8}
      py={2}
      textAlign={"end"}
      borderTopWidth={"1px"}
    >
      Spread: {formatNumber(getSpreadAmount(bids, asks))}{" "}
      {getSpreadPercentage(getSpreadAmount(bids, asks), getHighestBid(bids))}
    </Text>
  );
};

export default Spread;

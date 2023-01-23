import React, { FunctionComponent } from "react";
import { Text } from "@chakra-ui/react";
import { formatNumber } from "@/utils/helpers";

interface SpreadProps {
  highestBid: number;
  lowestAsk: number;
}

const Spread: FunctionComponent<SpreadProps> = ({ highestBid, lowestAsk }) => {
  const getSpreadAmount = (highestBid: number, lowestAsk: number): number =>
    Math.abs(highestBid - lowestAsk);

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
      Spread: {formatNumber(getSpreadAmount(highestBid, lowestAsk))}{" "}
      {getSpreadPercentage(getSpreadAmount(highestBid, lowestAsk), highestBid)}
    </Text>
  );
};

export default Spread;

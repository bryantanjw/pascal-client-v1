import React, { FunctionComponent } from "react";
import { MOBILE_WIDTH } from "@/utils/constants";
import { PriceContainer } from "./styles";
import { Box, Text, useColorModeValue as mode } from "@chakra-ui/react";

interface TitleRowProps {
  reversedFieldsOrder?: boolean;
  windowWidth?: number;
}

export const TitleRow: FunctionComponent<TitleRowProps> = ({
  reversedFieldsOrder = false,
  windowWidth,
}) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-around"}
      py={1}
      fontSize={"0.8em"}
      borderBottomWidth={1}
      borderColor={mode("transparent", "rgb(255,255,255,0.03)")}
    >
      <Text>PRICE (USD)</Text>
      <Text>SIZE</Text>
      <Text>TOTAL</Text>
    </Box>
  );
};

interface PriceLevelRowProps {
  total: string;
  size: string;
  price: string;
  isRight: boolean;
  windowWidth?: number;
}

export const PriceLevelRow: FunctionComponent<PriceLevelRowProps> = ({
  total,
  size,
  price,
  isRight = false,
  windowWidth,
}) => {
  return (
    <PriceContainer
      data-testid="price-level-row"
      isRight={isRight}
      windowWidth={windowWidth}
    >
      <span className="price">{price}</span>
      <span>{size}</span>
      <span className="total">{total}</span>
    </PriceContainer>
  );
};

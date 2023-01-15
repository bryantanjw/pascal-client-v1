import React, { FunctionComponent } from "react";
import { MOBILE_WIDTH } from "@/utils/constants";
import { TitleContainer, PriceContainer } from "./styles";

interface TitleRowProps {
  reversedFieldsOrder?: boolean;
  windowWidth: number;
}

export const TitleRow: FunctionComponent<TitleRowProps> = ({
  reversedFieldsOrder = false,
  windowWidth,
}) => {
  return (
    <TitleContainer>
      <span>Price (USD)</span>
      <span>Size</span>
      <span>Total</span>
    </TitleContainer>
  );
};

interface PriceLevelRowProps {
  total: string;
  size: string;
  price: string;
  isRight: boolean;
  windowWidth: number;
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

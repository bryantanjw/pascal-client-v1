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
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ? (
        <>
          <span>Price</span>
          <span>Shares</span>
          <span>Total</span>
        </>
      ) : (
        <>
          <span>Total</span>
          <span>Shares</span>
          <span>Price</span>
        </>
      )}
    </TitleContainer>
  );
};

interface PriceLevelRowProps {
  total: string;
  size: string;
  price: string;
  reversedFieldsOrder: boolean;
  windowWidth: number;
}

export const PriceLevelRow: FunctionComponent<PriceLevelRowProps> = ({
  total,
  size,
  price,
  reversedFieldsOrder = false,
  windowWidth,
}) => {
  return (
    <PriceContainer
      data-testid="price-level-row"
      isRight={!reversedFieldsOrder}
      windowWidth={windowWidth}
    >
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ? (
        <>
          <span className="price">{price}</span>
          <span>{size}</span>
          <span>{total}</span>
        </>
      ) : (
        <>
          <span>{total}</span>
          <span>{size}</span>
          <span className="price">{price}</span>
        </>
      )}
    </PriceContainer>
  );
};

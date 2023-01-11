import styled from "styled-components";

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-around;
  color: #98a6af;
  padding: 0.3em;
  font-size: 0.8rem;

  span {
    min-width: 5rem;
  }
`;

export const OrderbookContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  border-color: #263946;

  @media only screen and (min-width: 800px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const TableContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: #bfc1c8;

  @media only screen and (min-width: 800px) {
    width: 50%;
  }
`;

interface PriceButtonContainerProps {
  isRight: boolean;
  windowWidth: number;
}

export const PriceContainer = styled.div<PriceButtonContainerProps>`
  display: flex;
  justify-content: space-around;
  position: relative;

  &:after {
    background-color: ${(props) => (props.isRight ? "#113534" : "#3d1e28")};
    background-position: center;
    height: 100%;
    padding: 0.3em 0;
    display: block;
    content: "";
    position: absolute;
    left: 0;
    right: unset;
    z-index: 0;

    @media only screen and (min-width: 800px) {
      left: ${(props) => (props.isRight ? "unset" : 0)};
      right: ${(props) => (props.isRight ? 0 : "unset")};
    }
  }

  span {
    z-index: 1;
    min-width: 54px;
  }

  .price {
    color: ${(props) => (props.isRight ? "#118860" : "#bb3336")};
  }
`;

export const PriceLevelRowContainer = styled.div`
  margin: 0.155em 0;
`;

interface ButtonContainerProps {
  backgroundColor: string;
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  padding: 0.3em 0.7em;
  margin: 1em;
  border-radius: 4px;
  border: none;
  color: white;
  background: ${(props) => props.backgroundColor};
  font-family: "Calibri", sans-serif;
  font-size: 1.2em;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const GroupingSelectBoxContainer = styled.div`
  select {
    border-radius: 3px;
    padding: 0.3em;
    color: white;
    border: none;
    background-color: #303947;

    &:hover {
      cursor: pointer;
    }
  }
`;

export const SpreadContainer = styled.div`
  color: #98a6af;
  background-color: #121723;
  width: 50%;
  text-align: center;
  padding: 0.7em 0;

  @media only screen and (min-width: 800px) {
    position: absolute;
    top: 5px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 79vh;

  svg {
    width: 4em;
    height: 4em;
  }
`;

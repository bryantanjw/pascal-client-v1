import styled from "styled-components";

export const OrderbookContainer = styled.div`
  display: flex;
  direction={"column"};
  backdrop-filter: blur(5px);

  @media only screen and (min-width: 800px) {
    justify-content: center;
  }
`;

export const TableContainer = styled.div`
  padding-top: 9px;
  font-size: 0.9rem;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 120px;
  overflow: auto;
  overflow-scrolling: touch;

  background:
    /* Shadow Cover TOP */ linear-gradient(
        white 30%,
        rgba(255, 255, 255, 0)
      )
      center top,
    /* Shadow Cover BOTTOM */ linear-gradient(rgba(255, 255, 255, 0), white 70%)
      center bottom,
    /* Shadow TOP */
      radial-gradient(
        farthest-side at 50% 0,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0)
      )
      center top,
    /* Shadow BOTTOM */
      radial-gradient(
        farthest-side at 50% 100%,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0)
      )
      center bottom;

  background-repeat: no-repeat;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;
  @media only screen and (min-width: 800px) {
    width: 100%;
  }
`;

interface PriceButtonContainerProps {
  isRight: boolean;
  windowWidth: number;
}

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-around;
  color: #98a6af;
  padding-top: 0.5em;
  font-size: 0.9em;

  span {
    min-width: 5rem;
  }
`;

export const PriceContainer = styled.div<PriceButtonContainerProps>`
  display: flex;
  justify-content: space-around;
  position: relative;
  margin: 3px 0;

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
    min-width: 5rem;
  }

  .total {
    opacity: 0.6;
  }

  .price {
    color: ${(props) => (props.isRight ? "#118860" : "#bb3336")};
  }
`;

export const PriceLevelRowContainer = styled.div`
  margin: 0 0;
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

import React, { FunctionComponent, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useDispatch, useSelector } from "@/store/store";
import {
  addAsks,
  addBids,
  addExistingState,
  selectAsks,
  selectBids,
} from "@/store/slices/orderbookSlice";
import { PriceLevelRow, TitleRow } from "./HeaderRow";
import Spread from "./Spread";
import Loader from "./Loader";
import DepthVisualizer from "./DepthVisualizer";
import { MOBILE_WIDTH, ORDERBOOK_LEVELS } from "@/utils/constants";
import { formatNumber } from "@/utils/helpers";
import { ProductsMap } from "../Outcomes";
import GroupingSelectBox from "./GroupingSelectBox";
import { Flex } from "@chakra-ui/react";

import {
  OrderbookContainer,
  TableContainer,
  PriceLevelRowContainer,
  ButtonContainer,
} from "./styles";

const WSS_FEED_URL: string = "wss://www.cryptofacilities.com/ws/v1";

interface ButtonProps {
  title: string;
  backgroundColor: string;
  callback: () => void;
}

const Button: FunctionComponent<ButtonProps> = ({
  title,
  backgroundColor = "#5741d9",
  callback,
}) => {
  return (
    <ButtonContainer backgroundColor={backgroundColor} onClick={callback}>
      {title}
    </ButtonContainer>
  );
};

const groupingOptions: any = {
  PI_XBTUSD: [0.5, 1, 2.5],
  PI_ETHUSD: [0.05, 0.1, 0.25],
};

export enum OrderType {
  BIDS,
  ASKS,
}

// interface OrderBookProps {
//   windowWidth: number;
//   productId: string;
//   isFeedKilled: boolean;
// }

interface Delta {
  bids: number[][];
  asks: number[][];
}

let currentBids: number[][] = [];
let currentAsks: number[][] = [];

const OrderBook = ({ productId }) => {
  const [windowWidth, setWindowWidth] = useState(0);

  const bids: number[][] = useSelector(selectBids);
  const asks: number[][] = useSelector(selectAsks);
  const dispatch = useDispatch();
  const { sendJsonMessage, getWebSocket } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap["message"]) => processMessages(event),
  });

  const processMessages = (event: { data: string }) => {
    const response = JSON.parse(event.data);

    if (response.numLevels) {
      dispatch(addExistingState(response));
    } else {
      process(response);
    }
  };

  useEffect(() => {
    function connect(product: string) {
      const unSubscribeMessage = {
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: [ProductsMap[product]],
      };
      sendJsonMessage(unSubscribeMessage);

      const subscribeMessage = {
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [product],
      };
      sendJsonMessage(JSON.parse(JSON.stringify(subscribeMessage)));
    }

    if (isFeedKilled) {
      getWebSocket()?.close();
    } else {
      connect(productId);
    }
  }, [isFeedKilled, productId, sendJsonMessage, getWebSocket]);

  const process = (data: Delta) => {
    if (data?.bids?.length > 0) {
      currentBids = [...currentBids, ...data.bids];

      if (currentBids.length > ORDERBOOK_LEVELS) {
        dispatch(addBids(currentBids));
        currentBids = [];
        currentBids.length = 0;
      }
    }
    if (data?.asks?.length >= 0) {
      currentAsks = [...currentAsks, ...data.asks];

      if (currentAsks.length > ORDERBOOK_LEVELS) {
        dispatch(addAsks(currentAsks));
        currentAsks = [];
        currentAsks.length = 0;
      }
    }
  };

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", {
      useGrouping: true,
      minimumFractionDigits: 2,
    });
  };

  const buildPriceLevels = (
    levels: number[][],
    orderType: OrderType = OrderType.BIDS
  ): React.ReactNode => {
    const sortedLevelsByPrice: number[][] = [...levels].sort(
      (currentLevel: number[], nextLevel: number[]): number => {
        let result: number = 0;
        if (orderType === OrderType.BIDS || windowWidth < MOBILE_WIDTH) {
          result = nextLevel[0] - currentLevel[0];
        } else {
          result = currentLevel[0] - nextLevel[0];
        }
        return result;
      }
    );

    return sortedLevelsByPrice.map((level, idx) => {
      const calculatedTotal: number = level[2];
      const total: string = formatNumber(calculatedTotal);
      const depth = level[3];
      const size: string = formatNumber(level[1]);
      const price: string = formatPrice(level[0]);

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
            reversedFieldsOrder={orderType === OrderType.ASKS}
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

  const toggleFeed = (): void => {
    setIsFeedKilled(!isFeedKilled);
  };

  return (
    <>
      <GroupingSelectBox options={groupingOptions[productId]} />

      <OrderbookContainer>
        {bids.length && asks.length ? (
          <>
            <TableContainer>
              {windowWidth > MOBILE_WIDTH && (
                <TitleRow
                  windowWidth={windowWidth}
                  reversedFieldsOrder={false}
                />
              )}
              <div>{buildPriceLevels(bids, OrderType.BIDS)}</div>
            </TableContainer>
            <Spread bids={bids} asks={asks} />
            <TableContainer>
              <TitleRow windowWidth={windowWidth} reversedFieldsOrder={true} />
              <div>{buildPriceLevels(asks, OrderType.ASKS)}</div>
            </TableContainer>
          </>
        ) : (
          <Loader />
        )}
      </OrderbookContainer>
    </>
  );
};

export default OrderBook;

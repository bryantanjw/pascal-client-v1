import React, { FunctionComponent } from "react";
import { Box, useColorModeValue as mode } from "@chakra-ui/react";
import { OrderType } from "../Orderbook";
import { MOBILE_WIDTH } from "@/utils/constants";

interface DepthVisualizerProps {
  depth: number;
  orderType: OrderType;
  windowWidth?: number;
}

const DepthVisualizer: FunctionComponent<DepthVisualizerProps> = ({
  windowWidth,
  depth,
  orderType,
}) => {
  const DepthVisualizerColors = {
    BIDS: "rgb(0, 179, 60, 0.12)",
    ASKS: "rgb(255, 77, 77, 0.12)",
  };

  return (
    <Box
      data-testid="depth-visualizer"
      backgroundColor={
        orderType === OrderType.BIDS
          ? DepthVisualizerColors.BIDS
          : DepthVisualizerColors.ASKS
      }
      sx={{
        borderRadius: "0 4px 4px 0",
        height: "1.0em",
        width: `${depth}%`,
        position: "relative",
        top: 21,
        left: 0,
        marginTop: -25,
        zIndex: 1,
      }}
    />
  );
};

export default DepthVisualizer;

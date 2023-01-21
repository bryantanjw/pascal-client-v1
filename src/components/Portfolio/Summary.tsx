import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";

import styles from "@/styles/Home.module.css";

import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CardProps {
  title: string;
  data?: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  value: string;
}

const Card = ({ title, data, value }: CardProps) => {
  return (
    <Box
      width={"xl"}
      p={5}
      minW={"200px"}
      bgColor={"rgb(218,227,247)"}
      rounded={"xl"}
    >
      <Heading fontSize={"2xl"}>{title}</Heading>
      <ReactApexChart
        options={lineChartOptionsTotalSpent}
        series={data}
        type={"line"}
      />
      <Text fontWeight={"bold"} fontSize={"xl"}>
        {value}
      </Text>
    </Box>
  );
};

const Summary = () => {
  const { colorMode } = useColorMode();
  return (
    <Stack spacing={9} py={12} px={6}>
      <VStack>
        <Text color={"gray.50"}>Your portfolio</Text>
        <Heading color={"white"}>$128,257</Heading>
      </VStack>

      <Stack direction={"row"} textColor={"gray.50"}>
        <Box
          textAlign={"center"}
          border={"1px solid rgb(255,255,255,0.12)"}
          px={3}
          py={2}
          width={"full"}
          rounded={"2xl"}
        >
          <Text fontSize={"sm"} fontWeight={"light"}>
            Gain
          </Text>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <TriangleUpIcon boxSize={3} color={"lightgreen"} />
            <Text fontSize={"lg"} fontWeight={"bold"}>
              $678
            </Text>
          </Stack>
        </Box>
        <Box
          textAlign={"center"}
          border={"1px solid rgb(255,255,255,0.12)"}
          px={3}
          py={2}
          width={"full"}
          rounded={"2xl"}
        >
          <Text fontSize={"sm"} fontWeight={"light"}>
            Loss
          </Text>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <TriangleDownIcon boxSize={3} color={"yellow.200"} />
            <Text fontSize={"lg"} fontWeight={"bold"}>
              $128
            </Text>
          </Stack>
        </Box>
      </Stack>

      <Stack direction={"column"} py={6}>
        <Text fontWeight={"semibold"} fontSize={"xl"} color={"gray.50"}>
          Cases
        </Text>
        <Stack
          direction={"row"}
          overflowX={"auto"}
          whiteSpace={"nowrap"}
          className={styles.scroll_container}
        >
          <Card title="ETH" value="$180" data={lineChartDataTotalSpent} />
          <Card title="ETH" value="$180" data={lineChartDataTotalSpent} />
        </Stack>
      </Stack>
      <Button
        as={motion.button}
        whileTap={{ scale: 0.9 }}
        textColor={"gray.200"}
        size={"lg"}
        variant={"outline"}
        p={6}
        rounded={"xl"}
        borderColor={"rgb(255,255,255,0.4)"}
        _hover={{
          bgColor: "rgb(255,255,255,0.1)",
        }}
        _active={{
          bgColor: "rgb(255,255,255,0.1)",
        }}
      >
        View markets
      </Button>
    </Stack>
  );
};

export const lineChartDataTotalSpent = [
  {
    data: [50, 64, 48, 66, 49, 68],
  },
];

export const lineChartOptionsTotalSpent: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
      color: "#4318FF",
    },
  },
  colors: ["#4318FF", "#39B8FF"],
  markers: {
    size: 0,
    colors: "white",
    strokeColors: "#7551FF",
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    shape: "circle",
    radius: 1,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    // type: "line",
  },
  xaxis: {
    // type: "numeric",
    categories: ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"],
    labels: {
      show: false,
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    column: {
      // color: ["#7551FF", "#39B8FF"],
      opacity: 0.5,
    },
  },
  // color: ["#7551FF", "#39B8FF"],
};

export default Summary;

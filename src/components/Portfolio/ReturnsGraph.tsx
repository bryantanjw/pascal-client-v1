import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Flex,
  Skeleton,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from "@/styles/Home.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgb(226,232,240,0.4)",
        drawBorder: false,
      },
      ticks: {
        maxTicksLimit: 5,
      },
    },
  },
  maintainAspectRatio: false,
};

const labels = [
  "Oct 17",
  "Oct 24",
  "Oct 31",
  "Nov 07",
  "Nov 14",
  "Nov 21",
  "Nov 28",
];

export const cumulativeReturnsData = {
  labels,
  datasets: [
    {
      label: "Cumulative Returns",
      data: [369, 143, 720, 225, 62, 872, 331, 680, -7, 226],
      borderColor: "rgba(0,0,0,0.7)",
      backgroundColor: "rgba(0,0,0,0.8)",
      tension: 0.1,
     },
  ],
};

export const weeklyReturnsData = {
  labels,
  datasets: [
    {
      label: "Weekly Returns",
      data: [95, 70, 55, 69, 7, 61, -57, 63, -47, 35],
      borderColor: "rgba(0,0,0,0.7)",
      backgroundColor: "rgba(0,0,0,0.8)",
      tension: 0.1,
    },
  ],
};

const ReturnsGraph = () => {
  const { publicKey } = useWallet();

  return (
    <Stack py={4} spacing={9}>
      <Flex className={styles.returns_canvas_container}>
        <Line
          options={options}
          data={cumulativeReturnsData}
          fallbackContent={<Skeleton width={"full"} />}
        />
      </Flex>

      <Flex className={styles.returns_canvas_container}>
        <Bar
          options={options}
          data={weeklyReturnsData}
          fallbackContent={<Skeleton width={"full"} />}
        />
      </Flex>

      {!publicKey && (
        <Text color={mode("gray.600", "gray.700")} p={6} textAlign={"center"}>
          No positions found
        </Text>
      )}
    </Stack>
  );
};

export default ReturnsGraph;

import React from "react";
import moment from "moment";
import useSWR from "swr";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import {
  Stack,
  Text,
  Heading,
  useColorModeValue as mode,
  Alert,
  AlertIcon,
  HStack,
  Skeleton,
} from "@chakra-ui/react";
import { FaSquare } from "react-icons/fa";

const ResearchGraph = ({ market }) => {
  switch (market.category) {
    case "Financial":
      return <FinancialChart market={market} />;
    case "Crypto":
      return <CryptoChart market={market} />;
    case "Economics":
      if (market.tag === "us inflation cpi") {
        return <InflationChart market={market} />;
      } else if (market.tag === "fed fund rate") {
        return <FedFundRateChart />;
      }
    default:
      return null;
  }
};

const FinancialChart = ({ market }) => {
  const { ticker } = market;
  const fetcher = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      const error: any = new Error(
        "An error occurred while fetching the data."
      );

      error.info = await res.json();
      error.status = res.status;
      console.log("fetcher", error);
      throw error;
    }
    return res.json();
  };
  const { data, error } = useSWR(
    `/api/research/fetchFinancialData?ticker=${ticker}`,
    fetcher
  );
  if (error) {
    console.log("Error fetching fed fund rate data from NASDAQ", error);
    return (
      <Alert status="error" rounded={"lg"}>
        <AlertIcon mr={4} />
        An error has occured loading chart.
      </Alert>
    );
  }
  if (!data) {
    return <SkeletonChart />;
  }

  const { indicators, timestamp } = data;

  // Array to store unique timestamps
  const timestamps: number[] = [];
  let day1 = 0;

  const chartData = timestamp.map((timestamp, value) => {
    if (indicators.quote[0].close[value] !== null) {
      let day2 = new Date(timestamp * 1000).getDate();
      if (day1 !== day2) {
        timestamps.push(timestamp * 1000);
        day1 = day2;
      }

      return {
        timestamp: timestamp * 1000,
        value: indicators.quote[0].close[value].toFixed(2),
      };
    }
  });

  const priceChange =
    ((chartData[chartData.length - 1].value - chartData[0].value) /
      chartData[0].value) *
    100;

  return (
    <Stack spacing={5} width={{ base: "87%", md: "full" }} mb={4}>
      {data && (
        <>
          <Stack mt={2}>
            <Heading fontSize={"xl"} fontWeight={"extrabold"}>
              {ticker.toUpperCase()}
            </Heading>
            <HStack spacing={3}>
              <Text fontSize={"md"} fontWeight={"bold"}>
                {chartData[chartData.length - 1].value}
              </Text>
              <Text
                fontSize={"sm"}
                fontWeight={"semibold"}
                color={priceChange < 0 ? "red.400" : "green.400"}
              >
                {priceChange.toFixed(2)}%
              </Text>
            </HStack>
          </Stack>

          <ResponsiveContainer width="100%" aspect={2.2}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={"#3182CE"} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={"#3182CE"} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="timestamp"
                tickFormatter={(tick) => moment(tick).format("DD")}
                tickLine={false}
                axisLine={false}
                ticks={timestamps}
                fontSize={"11px"}
              />
              <YAxis
                type={"number"}
                domain={["auto", "auto"]}
                orientation="right"
                tickCount={5}
                tickLine={false}
                axisLine={false}
                fontSize={"11px"}
              />

              <CartesianGrid
                vertical={false}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                opacity={mode("50%", "20%")}
              />
              <Tooltip content={<TooltipMinute active payload label />} />

              <Area
                type="monotone"
                dataKey="value"
                fillOpacity={1}
                fill="url(#colorvalue)"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                stroke={mode("#3182CE", "#44A3FB")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </Stack>
  );
};

const CryptoChart = ({ market }) => {
  const { ticker } = market;

  const fetcher = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      const error: any = new Error(
        "An error occurred while fetching the data."
      );

      error.info = await res.json();
      error.status = res.status;
      console.log("fetcher", error);
      throw error;
    }
    return res.json();
  };
  const { data, error } = useSWR(
    `https://api.coingecko.com/api/v3/coins/${ticker}/market_chart?vs_currency=usd&days=6`,
    fetcher
  );
  if (error) {
    console.log("Error fetching fed fund rate data from NASDAQ", error);
    return (
      <Alert status="error" rounded={"lg"}>
        <AlertIcon mr={4} />
        An error has occured loading chart.
      </Alert>
    );
  }
  if (!data) {
    return <SkeletonChart />;
  }

  const { prices } = data;

  // Array to store unique timestamps
  const timestamps: number[] = [];
  let day1 = 0;

  const chartData = prices.map((price) => {
    let day2 = new Date(price[0]).getDate();
    if (day1 !== day2) {
      timestamps.push(price[0]);
      day1 = day2;
    }

    return {
      timestamp: price[0],
      value: price[1].toFixed(2),
    };
  });

  const priceChange =
    ((chartData[chartData.length - 1].value - chartData[0].value) /
      chartData[0].value) *
    100;

  return (
    <Stack spacing={5} width={{ base: "87%", md: "full" }} mb={4}>
      {data && (
        <>
          <Stack mt={2}>
            <Heading fontSize={"xl"} fontWeight={"extrabold"}>
              {ticker.toUpperCase()}
            </Heading>
            <HStack spacing={3}>
              <Text fontSize={"md"} fontWeight={"bold"}>
                {chartData[chartData.length - 1].value}
              </Text>
              <Text
                fontSize={"sm"}
                fontWeight={"semibold"}
                color={priceChange < 0 ? "red.400" : "green.400"}
              >
                {priceChange.toFixed(2)}%
              </Text>
            </HStack>
          </Stack>

          <ResponsiveContainer width="100%" aspect={2.2}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={"#3182CE"} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={"#3182CE"} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="timestamp"
                tickFormatter={(tick) => moment(tick).format("DD")}
                ticks={timestamps}
                tickLine={false}
                axisLine={false}
                fontSize={"11px"}
              />
              <YAxis
                type={"number"}
                domain={["auto", "auto"]}
                orientation="right"
                tickCount={5}
                tickLine={false}
                axisLine={false}
                fontSize={"11px"}
              />

              <CartesianGrid
                vertical={false}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                opacity={mode("50%", "20%")}
              />
              <Tooltip content={<TooltipMinute active payload label />} />

              <Area
                type="monotone"
                dataKey="value"
                fillOpacity={1}
                fill="url(#colorvalue)"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                stroke={mode("#3182CE", "#44A3FB")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </Stack>
  );
};

const FedFundRateChart = () => {
  const fetcher = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      const error: any = new Error(
        "An error occurred while fetching the data."
      );

      error.info = await res.json();
      error.status = res.status;
      console.log("fetcher", error);
      throw error;
    }
    const json = await res.json();
    return json.dataset_data.data;
  };
  const today = new Date().toISOString().substr(0, 10);

  const { data, error } = useSWR(
    `https://data.nasdaq.com/api/v3/datasets/FED/RIFSPFF_N_M/data.json?rows=96&order=asc&end_date=${today}&column_index=1&api_key=${process.env.NEXT_PUBLIC_NASDAQ_LINK_API}`,
    fetcher
  );
  if (error) {
    console.log("Error fetching fed fund rate data from NASDAQ", error);
    return (
      <Alert status="error" rounded={"lg"}>
        <AlertIcon mr={4} />
        An error has occured loading chart.
      </Alert>
    );
  }
  if (!data) {
    return <SkeletonChart />;
  }

  const chartData = data.map((d) => {
    return {
      month: d[0],
      value: d[1],
    };
  });

  const TooltipFFR = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Stack fontSize={"sm"} spacing={0} backdropFilter={"blur(1px)"} p={2}>
          <Text
            fontWeight={"semibold"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={mode("gray.700", "gray.200")}
          >
            {moment(label).format("DD MMM YYYY")}
          </Text>
          <Text fontWeight={"bold"} color={"blue.400"}>
            {payload[0].value}
          </Text>
        </Stack>
      );
    }

    return null;
  };

  return (
    <Stack spacing={5} width={{ base: "87%", md: "full" }} mb={4}>
      {data && (
        <Stack spacing={8} mt={4}>
          <Heading fontSize={"lg"} fontWeight={"extrabold"}>
            Federal Funds Effective Rate, monthly
          </Heading>

          <ResponsiveContainer width="100%" aspect={2.2}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={"#3182CE"} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={"#3182CE"} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                tickLine={false}
                tickFormatter={(tick) => moment(tick).format("YYYY")}
                axisLine={false}
                fontSize={"10px"}
                transform={"translate(0, 10)"}
              />
              <YAxis
                type={"number"}
                domain={["auto", "auto"]}
                orientation="right"
                tickLine={false}
                axisLine={false}
                fontSize={"11px"}
              />

              <CartesianGrid
                vertical={false}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                opacity={mode("50%", "20%")}
              />
              <Tooltip content={<TooltipFFR active payload label />} />

              <Area
                type="monotone"
                dataKey="value"
                fillOpacity={1}
                fill="url(#colorvalue)"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                stroke={mode("#3182CE", "#44A3FB")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Stack>
      )}
    </Stack>
  );
};

const InflationChart = ({ market }) => {
  const { ticker } = market;
  const thisYear = new Date().getFullYear();

  const fetcher = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      const error: any = new Error(
        "An error occurred while fetching the data."
      );

      error.info = await res.json();
      error.status = res.status;
      console.log("fetcher", error);
      throw error;
    }
    return res.json();
  };
  const { data, error } = useSWR(
    `/api/research/fetchInflationData?ticker=${ticker}&year=${thisYear}`,
    fetcher
  );

  if (error) {
    console.log("Error fetching fed fund rate data from NASDAQ", error);
    return (
      <Alert status="error" rounded={"lg"}>
        <AlertIcon mr={4} />
        An error has occured loading chart.
      </Alert>
    );
  }
  if (!data) {
    return <SkeletonChart />;
  }

  // Sort dict by year, periodName(month) keys
  const headlineInflation = data[0].data.sort(function (a, b) {
    function getMonthNumberFromName(monthName) {
      const date = new Date(`${monthName} 1, 2022`);
      return date.getMonth() + 1;
    }

    return (
      a.year - b.year ||
      getMonthNumberFromName(a.periodName) -
        getMonthNumberFromName(b.periodName)
    );
  });
  const coreInflation = data[1].data.sort(function (a, b) {
    function getMonthNumberFromName(monthName) {
      const date = new Date(`${monthName} 1, 2022`);
      return date.getMonth() + 1;
    }

    return (
      a.year - b.year ||
      getMonthNumberFromName(a.periodName) -
        getMonthNumberFromName(b.periodName)
    );
  });

  headlineInflation.forEach((headline) => {
    coreInflation
      .filter(
        (core) =>
          core.year == headline.year && core.periodName == headline.periodName
      )
      .forEach((core) => {
        headline["coreInflationCalculations"] = core.calculations;
      });
  });

  const TooltipInflation = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Stack fontSize={"sm"} spacing={0} p={2}>
          <Text
            fontWeight={"bold"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={mode("gray.700", "gray.200")}
          >
            {payload[0].payload.periodName} {payload[0].payload.year}
          </Text>
          <Text fontWeight={"bold"} color={"blue.400"}>
            {payload[0].value}%
          </Text>
          <Text
            fontWeight={"bold"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={mode("gray.600", "gray.300")}
          >
            {payload[1].value}%
          </Text>
        </Stack>
      );
    }

    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <Stack
        fontSize={"sm"}
        textColor={mode("blackAlpha.700", "whiteAlpha.600")}
        direction={"row"}
        spacing={6}
        justifyContent={"center"}
        pr={4}
        pt={2}
        mb={-4}
      >
        <HStack>
          <FaSquare color={mode("#3182CE", "#44A3FB")} />
          <Text>{payload[0].value}</Text>
        </HStack>

        <HStack>
          <FaSquare color={mode("#292929", "#DFDFDF")} />
          <Text>{payload[1].value}</Text>
        </HStack>
      </Stack>
    );
  };

  return (
    <Stack mt={2} spacing={5} width={{ base: "87%", md: "full" }} mb={4}>
      {data && (
        <Stack spacing={8} mt={3}>
          <Heading fontSize={"lg"} fontWeight={"extrabold"}>
            CPI - Year over year change
          </Heading>

          <ResponsiveContainer width="100%" aspect={2}>
            <ComposedChart
              data={headlineInflation}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                fontSize={"11px"}
                padding={{ right: 30 }}
                transform={"translate(0, 3)"}
              />
              <YAxis
                type={"number"}
                domain={["auto", "auto"]}
                orientation="right"
                tickLine={false}
                axisLine={false}
                fontSize={"11px"}
              />

              <CartesianGrid
                vertical={false}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                opacity={mode("50%", "20%")}
              />
              <Tooltip content={<TooltipInflation active payload label />} />
              <Legend content={renderLegend} />

              <Line
                name="Headline"
                dataKey="calculations.pct_changes.12"
                fillOpacity={1}
                dot={false}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                stroke={mode("#3182CE", "#44A3FB")}
              />
              <Line
                name="Core"
                dataKey="coreInflationCalculations.pct_changes.12"
                fillOpacity={1}
                dot={false}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                stroke={mode("#292929", "#DFDFDF")}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Stack>
      )}
    </Stack>
  );
};

const TooltipMinute = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Stack fontSize={"sm"} spacing={0} backdropFilter={"blur(1px)"} p={2}>
        <Text
          fontWeight={"semibold"}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          color={mode("gray.700", "gray.200")}
        >
          {moment(label).format("DD MMM YYYY")} at{" "}
          {moment(label).format("HH:mm")}
        </Text>
        <Text fontWeight={"bold"} color={"blue.400"}>
          {payload[0].value}
        </Text>
      </Stack>
    );
  }

  return null;
};

const SkeletonChart = () => (
  <Skeleton minW={{ md: "500px" }} minH={{ md: "200px" }} rounded={"lg"} />
);

export default ResearchGraph;

import { useContext } from "react";
import {
  Box,
  useColorModeValue as mode,
  Badge,
  Text,
  Stack,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { PositionsContext } from ".";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";

import styles from "@/styles/Home.module.css";

interface StatCardProps {
  data: {
    label: string;
    value: string | number;
    change: number;
  };
}

interface IndicatorProps {
  type: "up" | "down";
  value: string | number;
}

const types = {
  up: { icon: IoMdTrendingUp, colorScheme: "green" },
  down: { icon: IoMdTrendingDown, colorScheme: "red" },
};

const Indicator = (props: IndicatorProps) => {
  const { type, value } = props;

  return (
    <Badge
      display={"inline-flex"}
      alignSelf={"flex-end"}
      alignItems="center"
      variant={mode("subtle", "solid")}
      colorScheme={types[type].colorScheme}
      rounded="base"
      p="1"
    >
      <Box
        aria-hidden
        as={types[type].icon}
        pos="relative"
        boxSize={"18"}
        top={type === "down" ? "px" : undefined}
      />
      <Box srOnly>
        Value is {type} by {value}
      </Box>
      <Text
        fontSize={{ sm: "xs", md: "sm" }}
        color={mode(types[type].colorScheme, "gray.100")}
        marginStart="1.5"
      >
        {value}
      </Text>
    </Badge>
  );
};

const data: StatCardProps["data"][] = [
  // {
  //   label: "Profit",
  //   value: "$40",
  //   change: 0.001,
  // },
  {
    label: "Portfolio value",
    value: "$7,650",
    change: -0.025,
  },
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const StatCard = (props: StatCardProps) => {
  const positions = useContext(PositionsContext);
  const { label, value, change } = props.data;

  const isNegative = change < 0;
  const changeText = `${change * 100}%`;

  let total = positions?.reduce((acc, curr) => {
    const [exposure1, exposure2] = curr.account.outcomeMaxExposure;
    return (
      acc + exposure1.toNumber() / 10 ** 6 + exposure2.toNumber() / 10 ** 6
    );
  }, 0);

  return (
    <Stack
      className={styles.portfolioCard}
      minW={"300px"}
      minH={"140px"}
      p={"1.5rem"}
      mr={"1rem"}
      mb={{ base: 3, md: 0 }}
      boxShadow={"0px 2px 8px 0px #0000001a"}
      _after={{
        bg: mode("#FBFBFD", ""),
        bgImage: mode(
          "none",
          "linear-gradient(to bottom right, rgba(32, 34, 46, 1), #111927)"
        ),
      }}
      _before={{
        width: "220%",
        height: "250%",
      }}
    >
      {/* <Indicator type={isNegative ? "down" : "up"} value={changeText} /> */}
      <Stack spacing={1} pt="3" letterSpacing={"wide"}>
        <Text fontSize={"md"} fontWeight="medium" opacity={0.7}>
          {label}
        </Text>

        <Heading lineHeight="1" fontSize={{ base: "lg", md: "2xl" }}>
          {label === "Portfolio value" ? formatter.format(total) : value}
        </Heading>
      </Stack>
    </Stack>
  );
};

const Stats = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }}>
      {data.map((stat, idx) => (
        <StatCard key={idx} data={stat} />
      ))}
    </Flex>
  );
};

export default Stats;

import { useContext } from "react";
import {
  Box,
  useColorModeValue as mode,
  Badge,
  Text,
  Stack,
  Heading,
  Flex,
  ScaleFade,
  Image,
} from "@chakra-ui/react";
import { PositionsContext } from ".";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
import { formatNumber } from "@/utils/helpers";

import styles from "@/styles/Home.module.css";

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

const StatCard = ({ label }) => {
  const positions = useContext(PositionsContext);
  let change = 0;
  const isNegative = change < 0;
  const changeText = `${change * 100}%`;

  let total = positions?.reduce((acc, curr) => {
    const [exposure1, exposure2] = curr.account.outcomeMaxExposure;
    return (
      acc + exposure1.toNumber() / 10 ** 6 + exposure2.toNumber() / 10 ** 6
    );
  }, 0);

  return (
    <ScaleFade in={true} initialScale={0.9}>
      <Stack
        className={styles.portfolioCard}
        minW={"280px"}
        minH={"140px"}
        p={"1.5rem"}
        mb={{ base: 3, md: 0 }}
        mr={{ base: 0, md: 3 }}
        boxShadow={"0px 2px 8px 0px #0000001a"}
        _after={{
          bg: mode("#FBFBFD", ""),
          bgImage: mode(
            "none",
            "linear-gradient(to bottom right, rgba(32, 34, 46, 1), #111927 100%)"
          ),
        }}
        _before={{
          width: "220%",
          height: "250%",
        }}
      >
        {/* <Indicator type={isNegative ? "down" : "up"} value={changeText} /> */}
        <Stack spacing={1} pt="9" letterSpacing={"wide"}>
          <Text fontSize={"md"} fontWeight="medium" opacity={0.7}>
            {label}
          </Text>

          <Heading lineHeight="1" fontSize={{ base: "xl", md: "2xl" }}>
            ${formatNumber(total ?? 0)}
          </Heading>
        </Stack>
      </Stack>
    </ScaleFade>
  );
};

const Stats = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <StatCard label={"Portfolio value"} />
      <Image
        src="/portfolioCard.png"
        alt="Pascal Portfolio Image"
        width={{ base: "100%", md: "35%" }}
        height={140}
        rounded="12px"
        opacity={mode(1, 0.5)}
        boxShadow={"0px 2px 8px 0px #0000001a"}
        objectFit={"cover"}
      />
    </Flex>
  );
};

export default Stats;

import {
  Box,
  useColorModeValue as mode,
  Badge,
  Text,
  Stack,
  Heading,
  Flex,
} from "@chakra-ui/react";
import * as React from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

export interface StatCardProps {
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
  up: { icon: BsCaretUpFill, colorScheme: "green" },
  down: { icon: BsCaretDownFill, colorScheme: "red" },
};

export const Indicator = (props: IndicatorProps) => {
  const { type, value } = props;

  return (
    <Badge
      display="flex"
      alignItems="center"
      variant="solid"
      colorScheme={types[type].colorScheme}
      rounded="base"
      px="1"
      width={{ sm: "80%", md: "auto" }}
    >
      <Box
        aria-hidden
        color="currentcolor"
        as={types[type].icon}
        pos="relative"
        top={type === "down" ? "px" : undefined}
      />
      <Box srOnly>
        Value is {type} by {value}
      </Box>
      <Text fontSize={{ sm: "xs", md: "sm" }} color="white" marginStart="1">
        {value}
      </Text>
    </Badge>
  );
};

const data: StatCardProps["data"][] = [
  {
    label: "Portfolio value",
    value: "$7,650",
    change: -0.025,
  },
  {
    label: "Return on investment",
    value: "83%",
    change: 0.001,
  },
];

export function StatCard(props: StatCardProps) {
  const { label, value, change } = props.data;

  const isNegative = change < 0;
  const changeText = `${change * 100}%`;

  return (
    <Box
      px={{ base: 3, md: 7 }}
      py="7"
      bg={mode("gray.100", "gray.800")}
      mr={5}
      borderRadius={"3xl"}
      color={mode("gray.800", "white")}
    >
      <Text fontSize={"md"} fontWeight="medium" opacity={0.5}>
        {label}
      </Text>

      <Stack spacing="4" mt="2" direction={{ base: "column", md: "row" }}>
        <Heading
          lineHeight="1"
          letterSpacing="tight"
          fontSize={{ base: "lg", md: "2xl" }}
        >
          {value}
        </Heading>
        <Indicator type={isNegative ? "down" : "up"} value={changeText} />
      </Stack>
    </Box>
  );
}

export const Stats = ({ user }) => {
  return (
    <Flex>
      {data.map((stat, idx) => (
        <StatCard key={idx} data={stat} />
      ))}
    </Flex>
  );
};

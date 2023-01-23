import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import * as React from "react";

interface Props {
  label: string;
  value: string;
}
export const Stat = (props: Props) => {
  const { label, value, ...boxProps } = props;

  return (
    <Box
      py={2}
      mb={{ base: 1, md: 0 }}
      borderRadius="lg"
      width={"full"}
      {...boxProps}
    >
      <Text mb={1} fontSize="md" color="muted">
        {label}
      </Text>
      <Text fontWeight={"semibold"} size={{ base: "sm", md: "md" }}>
        {value}
      </Text>
    </Box>
  );
};

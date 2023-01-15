import { resolutionSources } from "@/utils/constants";
import {
  Stack,
  Box,
  Highlight,
  useColorModeValue as mode,
  Text,
  Link,
} from "@chakra-ui/react";

const MarketResolution = ({ market }) => {
  const { marketLockTimestamp, resolutionSource } = market;
  const dt = new Date(marketLockTimestamp);
  const day = dt.getDate().toString();
  const month = dt.toLocaleString("default", { month: "long" });
  const year = dt.getFullYear().toString();

  return (
    <Stack spacing={3} direction={"column"} width={{ base: "80%", md: "full" }}>
      <Box
        borderColor={mode("purple.200", "purple.900")}
        bg={mode("purple.100", "purple.800")}
        mt={3}
        borderWidth={1}
        rounded={"md"}
        p={4}
      >
        <Text display={"inline"}>{market.description}</Text>
      </Box>

      <Box
        borderColor={mode("teal.100", "teal.900")}
        bg={mode("teal.50", "teal.800")}
        borderWidth={1}
        rounded={"md"}
        p={4}
      >
        <Highlight
          query={"the market resolves to No"}
          styles={{ textColor: mode("teal", "teal.100"), fontWeight: "bold" }}
        >
          Else, the market resolves to No.
        </Highlight>
      </Box>

      {resolutionSource && (
        <Text fontSize={"sm"} textColor={mode("gray.600", "gray.300")} py={1}>
          This market uses&nbsp;
          <Link
            href={
              resolutionSources
                .filter((source) => source.title === resolutionSource)
                .map((source) => source.url)[0]
            }
            isExternal
            textDecoration={"underline"}
          >
            {resolutionSource}
          </Link>
          &nbsp;as the final arbitrator.
        </Text>
      )}
    </Stack>
  );
};

export default MarketResolution;

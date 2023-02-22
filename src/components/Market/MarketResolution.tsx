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
    <Stack
      spacing={3}
      direction={"column"}
      width={{ base: "81%", md: "full" }}
      display={"flex"}
    >
      <Box
        borderColor={mode(
          "rgba(128, 90, 213, 0.5)",
          "rgba(214, 188, 250, 0.6)"
        )}
        bg={mode("rgb(128,90,213,0.2)", "rgb(214,188,250,0.1)")}
        mt={3}
        borderWidth={1}
        rounded={"md"}
        p={4}
      >
        <Text display={"inline"}>{market.description}</Text>
      </Box>

      <Box
        borderColor={mode(
          "rgba(44, 124, 124, 0.5)",
          "rgba(129, 230, 217, 0.5)"
        )}
        bg={mode("rgb(44,124,124,0.2)", "rgb(129,230,217,0.08)")}
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

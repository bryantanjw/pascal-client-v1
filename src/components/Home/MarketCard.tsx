import ChakraNextLink from "../ChakraNextLink";
import React, { Suspense } from "react";
import {
  Flex,
  Stack,
  HStack,
  useColorModeValue as mode,
  Image,
  Text,
  Heading,
  ScaleFade,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

// Style config //
const statStyle = {
  align: "center",
  direction: "row",
  filter: "invert(40%)",
};
// Style config //

const MarketCard = ({ market }) => {
  const iconColor = mode("invert(0%)", "invert(100%)");
  const { outcomes, prices, marketLockTimestamp } = market;

  const dt = new Date(parseInt(marketLockTimestamp, 16) * 1000);

  return (
    <ChakraNextLink
      to={`/market/${market.publicKey}`}
      _hover={{ textDecoration: "none" }}
    >
      <ScaleFade initialScale={0.9} in={true}>
        <Stack
          spacing={4}
          p={5}
          borderColor={mode("#CFDAE1", "rgb(255, 255, 255, 0.08)")}
          borderWidth={1}
          rounded={"10px"}
          backdropFilter={{ base: "none", md: "blur(0px)" }} // <-- Somehow improves page transition latency
          bg={mode("transparent", "")}
          bgImage={mode(
            "none",
            "radial-gradient(at top left, hsl(265.16, 86%, 86%) -400%, transparent 17%), radial-gradient(at bottom right, hsl(265.16, 86%, 86%) -400%, transparent 10%)"
          )}
          _hover={{
            boxShadow: "2xl",
            transition: "all .3s ease",
            borderColor: mode("white", "rgb(255, 255, 255, 0.2)"),
            background: mode("white", ""),
            bgImage: mode(
              "none",
              "radial-gradient(at 20% 20%, hsl(0.00, 0%, 100%) -600%, transparent 80%)"
            ),
          }}
        >
          <Image
            filter={iconColor}
            src={`/${market.category}.svg`}
            alt={market.category}
            width={25}
            height={25}
            fallback={<Skeleton width={25} height={25} />}
          />

          <Suspense
            fallback={<SkeletonText width={{ base: "80%", md: "100px" }} />}
          >
            <Stack spacing={1}>
              <Heading size={"md"}>{market.title}</Heading>
              <h3>
                {`on ${dt.getDate()} ${dt.toLocaleString("default", {
                  month: "long",
                })} ${dt.getFullYear()}`}
              </h3>
            </Stack>
          </Suspense>

          <Flex
            fontWeight={"semibold"}
            justify={"space-between"}
            direction={{ base: "row", md: "column", lg: "row" }}
          >
            <Stack direction={"row"} spacing={3}>
              <Text color={"purple.500"}>
                Yes ${prices[0].against[prices[0].against.length - 1]?.price}
              </Text>
            </Stack>
          </Flex>

          <hr />

          <Stack pt={2} spacing={4} direction={"row"}>
            <HStack sx={statStyle}>
              <Image
                filter={iconColor}
                src={"/liquidity.png"}
                width={17}
                height={17}
                alt="liquidity"
              />
              <h4>{market.liquidityTotal}</h4>
            </HStack>
            {/* <HStack sx={statStyle}>
              <Image
                filter={iconColor}
                src={"/traders.png"}
                width={17}
                height={17}
                alt="traders"
              />
              <h4>{market.recurrence}</h4>
            </HStack> */}
          </Stack>
        </Stack>
      </ScaleFade>
    </ChakraNextLink>
  );
};

export default MarketCard;

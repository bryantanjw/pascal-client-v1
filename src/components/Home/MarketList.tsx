import React, { Suspense } from "react";
import {
  Stack,
  HStack,
  SimpleGrid,
  Image,
  Box,
  useCheckboxGroup,
  Skeleton,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  useColorModeValue as mode,
  Portal,
} from "@chakra-ui/react";
import { categories } from "@/utils/constants";

import styles from "@/styles/Home.module.css";

const FilterToggle = React.lazy(() => import("./FilterToggle")); // <-- to load Suspense
const MarketCard = React.lazy(() => import("./MarketCard"));

const MarketList = ({ markets }) => {
  const { value, getCheckboxProps } = useCheckboxGroup({ defaultValue: [] });

  if (!markets) {
    return (
      <Alert status="error" rounded={"lg"}>
        <AlertIcon mr={4} />
        An error has occured loading markets.
      </Alert>
    );
  }

  let filteredMarkets = [];
  if (markets) {
    filteredMarkets = markets.filter(({ category }) =>
      value.includes(category)
    );
  }

  return (
    <Box>
      <HStack py={5} overflowX={"scroll"} className={styles.scroll_container}>
        {categories.map((category, index) => (
          <Stack key={index}>
            <Suspense fallback={<Skeleton height={"30px"} width={"100px"} />}>
              <FilterToggle
                {...getCheckboxProps({ value: category })}
                iconUrl={`./${category}.svg`}
                title={category}
              />
            </Suspense>
          </Stack>
        ))}
      </HStack>

      <Suspense
        fallback={
          <Center mt={"200px"}>
            <Spinner />
          </Center>
        }
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {filteredMarkets.length != 0
            ? filteredMarkets.map((market: any) => (
                <Stack key={market.publicKey}>
                  <MarketCard market={market} />
                </Stack>
              ))
            : markets &&
              markets.map((market: any) => (
                <Stack key={market.publicKey}>
                  <MarketCard market={market} />
                </Stack>
              ))}
        </SimpleGrid>
      </Suspense>

      <Portal>
        <Image
          display={mode("block", "none")}
          opacity={0.9}
          filter={"blur(110px)"}
          position={"absolute"}
          zIndex={-1}
          src={"gradient-bg.png"}
          alt={"Pascal Home"}
          right={"40px"}
          top={"-200px"}
        />
      </Portal>
    </Box>
  );
};

export default MarketList;

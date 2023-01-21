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
  useColorModeValue,
} from "@chakra-ui/react";
import { categories } from "@/utils/constants";

const FilterToggle = React.lazy(() => import("./FilterToggle")); // <-- to load Suspense
const MarketCard = React.lazy(() => import("./MarketCard"));

// Style config //
const gradientBackgroundStyle = {
  filter: "blur(110px)",
  position: "absolute",
  zIndex: -1,
  opacity: "50%",
};
// Style config //

// TODO: 1. add createMarket button/modal for admin
//  2. Search bar

const MarketList = ({ markets }) => {
  // FilterToggle state management ignored for the time being
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
    <Box pt={3}>
      <HStack py={5}>
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

      <Image
        sx={gradientBackgroundStyle}
        src={"gradient-bg.png"}
        alt={"background"}
        right={"40px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        top={useColorModeValue("-200px", "-320px")}
      />
    </Box>
  );
};

export default MarketList;

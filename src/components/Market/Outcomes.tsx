/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import {
  Progress,
  Text,
  HStack,
  VStack,
  Stack,
  useColorModeValue as mode,
  chakra,
  Box,
  Flex,
  Spacer,
  Collapse,
  UseCheckboxProps,
  useCheckboxGroup,
  Checkbox,
  useCheckbox,
} from "@chakra-ui/react";
import useSWR from "swr";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  MarketOutcomeAccount,
  GetAccount,
  getTradesForProviderWallet,
  Trade,
} from "@monaco-protocol/client";

import { OrderBook } from "./Orderbook";
import { useProgram } from "@/context/ProgramProvider";
import { useRouter } from "next/router";

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

interface CheckboxProps extends UseCheckboxProps {
  marketOutcome: GetAccount<MarketOutcomeAccount>;
}

const CheckboxOption = (props: CheckboxProps) => {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { asPath } = useRouter();
  const marketPk = asPath.split("/")[2];
  const [userPositions, setUserPositions] = useState<GetAccount<Trade>[]>([]);

  const { marketOutcome, ...radioProps } = props;
  const { state, getCheckboxProps, getInputProps, htmlProps } =
    useCheckbox(radioProps);
  const { data } = useSWR(
    publicKey ? `../api/user?pubKey=${publicKey?.toString()}` : null,
    fetcher
  );

  const progressBarColorScheme = ["purple", "teal", "pink"];
  const checkoxColorScheme = ["purple", "teal", "pink"];
  const bgColorScheme = [
    mode("rgb(128,90,213,0.2)", "rgb(214,188,250,0.1)"),
    mode("rgb(44,124,124,0.2)", "rgb(129,230,217,0.1)"),
    "pink",
  ];
  const borderColorScheme = [
    mode("purple.500", "purple.200"),
    mode("#2C7C7C", "#81E6D9"),
  ];

  useEffect(() => {
    const getMatchingTradeAccounts = async () => {
      try {
        const response = await getTradesForProviderWallet(program);
        const { tradeAccounts } = response.data;
        console.log("tradeAccounts", tradeAccounts);
        const matchingTradeAccounts = tradeAccounts.filter(
          (tradeAccount) =>
            tradeAccount.account.purchaser.toBase58() ===
              publicKey?.toBase58() &&
            tradeAccount.account.market.toBase58() === marketPk
        );
        setUserPositions(matchingTradeAccounts);
        console.log("userPositions", userPositions);
      } catch (error) {
        console.log("getMatchingTradeAccounts", error);
      }
    };
    getMatchingTradeAccounts();
  }, [program, publicKey, marketPk]);

  return (
    <chakra.label {...htmlProps}>
      <input {...getInputProps()} hidden />
      <Box
        borderWidth="1px"
        borderColor={mode("gray.300", "gray.700")}
        px="5"
        py="4"
        rounded="2xl"
        cursor="pointer"
        transition="all 0.2s"
        fontWeight={"medium"}
        bg={mode("rgb(255,255,255,0.2)", "blackAlpha.200")}
        fontSize={{ base: "sm", md: "md" }}
        _hover={{
          borderColor: "gray.500",
        }}
        _checked={{
          bg: bgColorScheme[marketOutcome.account.index % bgColorScheme.length],
          borderColor:
            borderColorScheme[
              marketOutcome.account.index % borderColorScheme.length
            ],
        }}
        {...getCheckboxProps()}
      >
        <Flex>
          <Flex width={"full"} alignItems="center">
            <Box flex={1.8}>
              <Stack>
                <HStack justifyContent={"space-between"}>
                  <Text>{marketOutcome.account.title}</Text>
                  <Text>{marketOutcome.account.latestMatchedPrice}%</Text>
                </HStack>
                <Progress
                  value={marketOutcome.account.latestMatchedPrice}
                  size={"sm"}
                  rounded={"xl"}
                  opacity={state.isChecked ? "100%" : "40%"}
                  transition={"all 0.2s ease"}
                  colorScheme={
                    progressBarColorScheme[
                      marketOutcome.account.index %
                        progressBarColorScheme.length
                    ]
                  }
                />
              </Stack>
            </Box>
            <Spacer />
            <Text>{marketOutcome.account.latestMatchedPrice}</Text>
            <Spacer />
            <Stack>
              {!publicKey && <Text>0.00</Text>}
              {data &&
                data.positions.map((position, index) => {
                  let found = false;
                  if (
                    position.marketId === marketOutcome.account.market &&
                    position.outcome === marketOutcome.account.title
                  ) {
                    found = true;
                    return position.shares;
                  }
                  if (index == position.length - 1 && !found) {
                    return 0.0;
                  }
                })}
            </Stack>
          </Flex>

          <Flex
            display={{ base: "none", md: "block" }}
            direction={"column"}
            pl={5}
          >
            <Checkbox
              as={Box}
              isChecked={state.isChecked}
              data-checked={state.isChecked ? "" : undefined}
              fontSize="xl"
              colorScheme={
                checkoxColorScheme[
                  marketOutcome.account.index % checkoxColorScheme.length
                ]
              }
            />
            <Text visibility={"hidden"}>&nbsp;</Text>
          </Flex>
        </Flex>
      </Box>
    </chakra.label>
  );
};

const Outcomes = ({ outcomes }) => {
  return (
    <VStack
      mt={4}
      spacing={{ base: 2, md: 3 }}
      width={{ base: "83%", md: "full" }}
    >
      <Flex
        fontWeight={"bold"}
        textColor={mode("gray.700", "gray.400")}
        width={"full"}
        px={5}
        letterSpacing={"wider"}
        fontSize={{ base: "2xs", md: "xs" }}
        justifyContent={"space-between"}
      >
        <Text>OUTCOME / PROBABILITY</Text>
        <Text pl={{ md: 8 }}>PRICE (USDC)</Text>
        <Text pr={{ md: 10 }}>YOUR SHARES</Text>
      </Flex>
      <Stack width={"full"} spacing={3}>
        {outcomes?.map(
          (outcome: GetAccount<MarketOutcomeAccount>, index: number) => {
            const [isOpen, setIsOpen] = useState(false);
            const handleChange = (value) => {
              setIsOpen(!isOpen);
            };
            const { value, getCheckboxProps } = useCheckboxGroup({
              onChange: handleChange,
            });

            return (
              <>
                <CheckboxOption
                  key={index}
                  marketOutcome={outcome}
                  {...getCheckboxProps({
                    value: index.toString(), // <-- getCheckboxProps value only accepts String
                  })}
                />
                <Collapse
                  style={{ overflow: "visible", marginBottom: "15px" }}
                  in={isOpen}
                  animateOpacity
                >
                  <OrderBook outcomeIndex={index} />
                </Collapse>
              </>
            );
          }
        )}
      </Stack>
    </VStack>
  );
};

export default Outcomes;

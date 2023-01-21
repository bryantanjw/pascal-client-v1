/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
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
import { BN } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { OrderBook } from "./Orderbook";
import { PublicKey } from "@solana/web3.js";
import { getPriceData } from "@/utils/monaco";
import { useProgram } from "@/context/ProgramProvider";
import { PriceDataContext } from ".";

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching user data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

interface CheckboxProps extends UseCheckboxProps {
  outcome: {
    index: number;
    outcome: string;
    latestMatchedPrice: number;
    matchedTotal: BN;
  };
  marketBuyPrice: number;
}

const CheckboxOption = (props: CheckboxProps) => {
  const { publicKey } = useWallet();

  const { outcome, marketBuyPrice, ...radioProps } = props;
  const { state, getCheckboxProps, getInputProps, htmlProps } =
    useCheckbox(radioProps);

  const { data } = useSWR(
    publicKey ? `../api/user?publicKey=${publicKey?.toString()}` : null,
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
        fontWeight={"medium"}
        bg={mode("rgb(255,255,255,0.2)", "blackAlpha.200")}
        fontSize={{ base: "sm", md: "md" }}
        _hover={{
          borderColor: "gray.500",
        }}
        _checked={{
          bg: bgColorScheme[outcome.index % bgColorScheme.length],
          borderColor:
            borderColorScheme[outcome.index % borderColorScheme.length],
        }}
        {...getCheckboxProps()}
      >
        <Flex>
          <Flex width={"full"} alignItems="center">
            <Box flex={1.8}>
              <Stack>
                <HStack justifyContent={"space-between"}>
                  <Text>{outcome.outcome}</Text>
                  <Text>{marketBuyPrice}%</Text>
                </HStack>
                <Progress
                  value={marketBuyPrice}
                  size={"sm"}
                  rounded={"xl"}
                  opacity={state.isChecked ? "100%" : "40%"}
                  transition={"all 0.2s ease"}
                  colorScheme={
                    progressBarColorScheme[
                      outcome.index % progressBarColorScheme.length
                    ]
                  }
                />
              </Stack>
            </Box>
            <Spacer />
            <Text>{marketBuyPrice}</Text>
            <Spacer />
            <Stack>
              {!publicKey && <Text>0.00</Text>}
              {/* {data &&
                data.positions.map((position, index) => {
                  let found = false;
                  if (position.outcome === outcome.outcome) {
                    found = true;
                    return position.shares;
                  }
                  if (index == position.length - 1 && !found) {
                    return 0.0;
                  }
                })} */}
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
                checkoxColorScheme[outcome.index % checkoxColorScheme.length]
              }
            />
            <Text visibility={"hidden"}>&nbsp;</Text>
          </Flex>
        </Flex>
      </Box>
    </chakra.label>
  );
};

const Outcomes = ({ market }) => {
  const { outcomes, prices } = market;

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
        <Text pr={{ md: 10 }}>YOUR POSITION</Text>
      </Flex>
      <Stack width={"full"} spacing={3}>
        {outcomes?.map((outcome, index: number) => {
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
                outcome={outcome}
                marketBuyPrice={
                  prices[index].against[prices[index].against.length - 1]?.price // <-- lowest sell price
                }
                {...getCheckboxProps({
                  value: index.toString(), // <-- getCheckboxProps value only accepts String
                })}
              />
              <Collapse
                style={{
                  overflow: "visible",
                  marginBottom: "15px",
                }}
                in={isOpen}
                animateOpacity
              >
                <OrderBook outcomes={outcomes} outcomeIndex={index} />
              </Collapse>
            </>
          );
        })}
      </Stack>
    </VStack>
  );
};

export default Outcomes;

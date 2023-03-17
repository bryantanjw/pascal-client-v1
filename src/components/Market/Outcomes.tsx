import { useContext, useEffect, useState } from "react";
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
import { getMarketPosition, MarketPosition } from "@monaco-protocol/client";
import { useProgram } from "@/context/ProgramProvider";
import { PriceDataContext } from ".";

interface CheckboxProps extends UseCheckboxProps {
  outcome: {
    index: number;
    outcome: string;
    latestMatchedPrice: number;
    matchedTotal: BN;
  };
  prices: any;
  userPosition: any;
}

const CheckboxOption = (props: CheckboxProps) => {
  const { publicKey } = useWallet();
  const { outcome, prices, userPosition, ...radioProps } = props;
  const { state, getCheckboxProps, getInputProps, htmlProps } =
    useCheckbox(radioProps);
  const { probA, probB } = useContext(PriceDataContext);

  const highlightColor = ["purple", "teal", "pink"];
  const bgColorScheme = [
    mode("rgb(128,90,213,0.2)", "rgb(214,188,250,0.1)"),
    mode("rgb(44,124,124,0.2)", "rgb(129,230,217,0.08)"),
    "pink",
  ];
  const borderColorScheme = [
    mode("purple.500", "purple.200"),
    mode("#2C7C7C", "#81E6D9"),
  ];

  return (
    <chakra.label {...htmlProps}>
      <input {...getInputProps()} hidden />
      <Flex
        borderWidth="1px"
        borderColor={mode("gray.300", "gray.700")}
        px="5"
        py="4"
        mb={-3}
        rounded="2xl"
        cursor="pointer"
        fontWeight={"medium"}
        bg={mode(
          "rgb(255,255,255,0.2)",
          "linear-gradient(to bottom right, rgba(32, 34, 46, 0.3), rgba(32, 34, 46, 0.1))"
        )}
        transition={"all 0.2s ease"}
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
        <Flex
          width={"full"}
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Stack width={"34%"}>
            <HStack justifyContent={"space-between"}>
              <Text>{outcome.outcome}</Text>
              <Text>
                {Math.round((outcome.index === 0 ? probA : probB) * 100)}
              </Text>
            </HStack>
            <Progress
              value={(outcome.index === 0 ? probA : probB) * 100}
              size={"sm"}
              rounded={"xl"}
              opacity={state.isChecked ? "100%" : "40%"}
              transition={"all 0.2s ease"}
              colorScheme={
                highlightColor[outcome.index % highlightColor.length]
              }
            />
          </Stack>
          <Text>
            {
              prices[outcome.index].against[
                prices[outcome.index].against.length - 1
              ]?.price
            }
          </Text>
          <Stack minW={12} mr={6}>
            <Text>
              $
              {userPosition && publicKey
                ? parseInt(userPosition.toString(16), 16) / 10 ** 6
                : 0.0}
            </Text>
          </Stack>
        </Flex>

        <Flex display={{ base: "none", md: "block" }} direction={"column"}>
          <Checkbox
            as={Box}
            isChecked={state.isChecked}
            data-checked={state.isChecked ? "" : undefined}
            colorScheme={highlightColor[outcome.index % highlightColor.length]}
          />
        </Flex>
      </Flex>
    </chakra.label>
  );
};

const Outcomes = ({ market }) => {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { outcomes, prices } = market;
  const [marketPosition, setMarketPosition] = useState<any>();

  useEffect(() => {
    if (publicKey) {
      const fetchUserMarketPositions = async () => {
        try {
          const res = await getMarketPosition(
            program,
            new PublicKey(market.publicKey),
            publicKey
          );
          setMarketPosition(res.data);
        } catch (error) {
          console.log("fetchUserMarketPositions error: ", error);
        }
      };
      fetchUserMarketPositions();
    }
  }, [program]);

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
        <Text minW={12}>OUTCOME / PROBABILITY</Text>
        <Text minW={12}>PRICE (USDC)</Text>
        <Text minW={12}>YOUR STAKE</Text>
      </Flex>
      <Stack width={"full"} spacing={3}>
        {outcomes?.map((outcome, index: number) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [isOpen, setIsOpen] = useState(false);
          const handleChange = (value) => {
            setIsOpen(!isOpen);
          };
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { value, getCheckboxProps } = useCheckboxGroup({
            onChange: handleChange,
          });

          return (
            <>
              <CheckboxOption
                key={index}
                outcome={outcome}
                prices={prices}
                userPosition={
                  marketPosition?.outcomeMaxExposure[index === 0 ? 1 : 0]
                }
                {...getCheckboxProps({
                  value: index.toString(), // getCheckboxProps value only accepts String
                })}
              />
              <Box key={index}>
                <Collapse in={isOpen} animateOpacity>
                  <OrderBook
                    outcomes={outcomes}
                    outcomeIndex={index}
                    prices={prices}
                  />
                </Collapse>
              </Box>
            </>
          );
        })}
      </Stack>
    </VStack>
  );
};

export default Outcomes;

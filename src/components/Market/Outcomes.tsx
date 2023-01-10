import {
  Progress,
  Text,
  HStack,
  VStack,
  Stack,
  useRadioGroup,
  useRadio,
  UseRadioProps,
  useId,
  useColorModeValue as mode,
  chakra,
  StackProps,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { MdCheckCircle, MdOutlineCircle } from "react-icons/md";
import useSWR from "swr";
import { useWallet } from "@solana/wallet-adapter-react";
import { MarketOutcomeAccount, GetAccount } from "@monaco-protocol/client";

import { useDispatch } from "@/store/store";
import { setIndex, setTitle } from "@/store/slices/outcomeSlice";

// Style config //
const progressBarColorScheme = ["purple", "teal", "pink"];
// Style config //

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

interface RadioOptionProps extends UseRadioProps, Omit<StackProps, "onChange"> {
  marketOutcome: GetAccount<MarketOutcomeAccount>;
}

const RadioOption = (props: RadioOptionProps) => {
  const { publicKey } = useWallet();

  const { marketOutcome, ...radioProps } = props;
  const { state, getInputProps, getCheckboxProps, getLabelProps } =
    useRadio(radioProps);
  const { data } = useSWR(
    publicKey ? `../api/user?pubKey=${publicKey?.toString()}` : null,
    fetcher
  );
  const id = useId();

  const checkoxColorScheme = [
    mode("purple.500", "purple.200"),
    mode("#2C7C7C", "#81E6D9"),
  ];
  const bgColorScheme = [
    mode("rgb(128,90,213,0.2)", "rgb(214,188,250,0.1)"),
    mode("rgb(44,124,124,0.2)", "rgb(129,230,217,0.1)"),
  ];
  const radialGradientScheme = [
    "radial-gradient(at top left, hsl(265.16, 86%, 86%) -300%, transparent 80%);",
    "radial-gradient(at top left, hsl(172.28, 67%, 30%) -300%, transparent 80%);",
  ];
  return (
    <chakra.label {...getLabelProps()}>
      <input {...getInputProps()} aria-labelledby={id} />
      <Box
        borderWidth="1px"
        px="5"
        py="4"
        rounded="2xl"
        cursor="pointer"
        transition="all 0.3s"
        borderColor={mode("gray.300", "rgb(255, 255, 255, 0.1)")}
        box-shadow="0 0 1rem 0 rgba(0, 0, 0, 0.2)"
        fontSize={{ base: "sm", md: "md" }}
        _hover={{
          borderColor: mode(
            checkoxColorScheme[
              marketOutcome.account.index % checkoxColorScheme.length
            ],
            "rgb(255, 255, 255, 0.1)"
          ),
          bgImage: mode(
            "none",
            radialGradientScheme[
              marketOutcome.account.index % radialGradientScheme.length
            ]
          ),
        }}
        _checked={{
          bg: mode(
            bgColorScheme[marketOutcome.account.index % bgColorScheme.length],
            "rgba(17, 25, 40, 0.7)"
          ),
          borderColor: mode(
            checkoxColorScheme[
              marketOutcome.account.index % checkoxColorScheme.length
            ],
            "rgb(255, 255, 255, 0.1)"
          ),
          bgImage: mode(
            "none",
            radialGradientScheme[
              marketOutcome.account.index % radialGradientScheme.length
            ]
          ),
        }}
        {...getCheckboxProps()}
        id={id}
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

            <chakra.label {...getLabelProps()} cursor="pointer">
              <input {...getInputProps()} aria-labelledby={id} />
              <Text>{marketOutcome.account.latestMatchedPrice}</Text>
            </chakra.label>

            <Spacer />

            <chakra.label {...getLabelProps()} pr={5} cursor="pointer">
              <input {...getInputProps()} aria-labelledby={id} />
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
            </chakra.label>
          </Flex>

          <Flex display={{ base: "none", md: "block" }} direction={"column"}>
            <Box
              data-checked={state.isChecked ? "" : undefined}
              fontSize="xl"
              _checked={{
                color:
                  checkoxColorScheme[
                    marketOutcome.account.index % checkoxColorScheme.length
                  ],
              }}
              color={mode("gray.300", "whiteAlpha.400")}
            >
              {state.isChecked ? <MdCheckCircle /> : <MdOutlineCircle />}
            </Box>
            <Text visibility={"hidden"}>&nbsp;</Text>
          </Flex>
        </Flex>
      </Box>
    </chakra.label>
  );
};

export const OutcomesTest = ({ marketOutcomes }) => {
  const dispatch = useDispatch(); // <-- calling the reducer

  const handleChange = (value) => {
    dispatch(setTitle(marketOutcomes[parseInt(value)].account.title));
    dispatch(setIndex(parseInt(value)));
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue: "0",
    onChange: handleChange,
  });

  return (
    <VStack
      mt={4}
      spacing={{ base: 2, md: 3 }}
      width={{ base: "83%", md: "full" }}
      {...getRootProps()}
    >
      <Flex
        fontWeight={"bold"}
        textColor={mode("gray.700", "gray.400")}
        width={"full"}
        px={5}
        letterSpacing={"wider"}
        fontSize={{ base: "2xs", md: "xs" }}
        justifyContent={"space-between"}
        textAlign={"center"}
      >
        <Text>OUTCOME / PROBABILITY</Text>
        <Text pl={{ md: 8 }}>PRICE (USDC)</Text>
        <Text pr={{ md: 10 }}>YOUR SHARES</Text>
      </Flex>
      <Stack width={"full"} spacing={3}>
        {marketOutcomes?.map(
          (outcome: GetAccount<MarketOutcomeAccount>, index: number) => {
            return (
              <RadioOption
                key={index}
                marketOutcome={outcome}
                {...getRadioProps({
                  value: index.toString(), // <-- getRadioProps value only accepts String type
                })}
              />
            );
          }
        )}
      </Stack>
    </VStack>
  );
};

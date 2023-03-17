import { useContext, useState } from "react";
import Balancer from "react-wrap-balancer";
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Text,
  useColorModeValue as mode,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  useToast,
  Link,
  Skeleton,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ExternalLinkIcon,
  InfoOutlineIcon,
  LockIcon,
} from "@chakra-ui/icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { createOrderUiStake, Orders } from "@monaco-protocol/client";
import { Field, Formik } from "formik";
import { motion } from "framer-motion";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { TokenSwapForm } from "./TokenPool";
import { Airdrop } from "./TokenPool/AirdropForm";
import { getPriceData, logResponse } from "@/utils/monaco";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "@/context/ProgramProvider";
import { PriceDataContext } from "..";

import styles from "@/styles/Home.module.css";

type TradeFormItemProps = {
  label: string | React.ReactNode;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
};

const TradeFormItem = (props: TradeFormItemProps) => {
  const { label, value, children } = props;

  return (
    <Flex justify="space-between" alignItems={"center"} fontSize="sm">
      <Text as={"div"} fontWeight="medium" color={mode("gray.600", "gray.400")}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  );
};

async function placeBuyOrder(
  program,
  publicKey,
  marketPk: PublicKey,
  marketOutcomeIndex: number,
  orderSide: boolean,
  price: number,
  stake: number
) {
  // Create order
  const orderResponse = await createOrderUiStake(
    program,
    marketPk,
    marketOutcomeIndex,
    orderSide,
    price,
    stake
  );
  logResponse(orderResponse);
  if (orderResponse.success) {
    console.log(`Order placed ✅`);
  } else {
    throw new Error(orderResponse[0].error);
  }
  // Get all of user's orders
  const orderData = await Orders.orderQuery(program)
    .filterByPurchaser(publicKey)
    .fetch();
  const priceData = await getPriceData(program, marketPk);
  const data = {
    publicKey,
    orderData,
    marketPk,
    marketOutcomeIndex,
    priceData,
  };

  // Send data to db
  const response = await fetch("../api/placeOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log("response", response);
  return orderResponse.data.tnxID;
}

const Swap = ({ market }) => {
  const {
    marketLockTimestamp,
    marketStatus,
    outcomes,
    prices,
    marketWinningOutcomeIndex,
  } = market;
  const program = useProgram();
  const { publicKey } = useWallet();
  const { priceData, probA } = useContext(PriceDataContext);
  const [outcomeIndex, setOutcomeIndex] = useState<number>(0);
  const [isMarketBuy, setIsMarketBuy] = useState<boolean>(true);
  const [isSuccess, setSuccess] = useState(false);

  const toast = useToast();
  const steps = [{ label: "" }, { label: "" }];
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const lockTimestamp = new Date(parseInt(marketLockTimestamp, 16) * 1000);
  const dt = new Date();

  const marketBuyPrice =
    priceData?.marketPriceSummary[outcomeIndex].against[
      prices[outcomeIndex].against.length - 1
    ]?.price;

  return (
    <Stack>
      {marketStatus.settled ? (
        <Text
          color={mode("gray.500", "gray.100")}
          fontWeight={"bold"}
          fontSize={"sm"}
        >
          Market has settled to {outcomes[marketWinningOutcomeIndex]?.outcome}
        </Text>
      ) : (
        (activeStep === 0 && (
          <Stack spacing={4}>
            <Flex direction={"column"}>
              <Text
                color={mode("gray.500", "gray.100")}
                fontWeight={"bold"}
                fontSize={"sm"}
              >
                Market says
              </Text>
              <Heading
                fontSize={"5xl"}
                fontWeight={"semibold"}
                color={mode("purple.500", "purple.200")}
              >
                {`${outcomes[0].outcome}
                ${probA * 100}%`}
              </Heading>
            </Flex>

            <Stack spacing={6}>
              <Heading
                width={"90%"}
                fontSize={"2xl"}
                fontWeight={"semibold"}
                textColor={mode("gray.800", "gray.100")}
              >
                <Balancer>{market.title}</Balancer>
              </Heading>
              <Stack pt={2}>
                <Tooltip
                  p={3}
                  mt={2}
                  display={dt >= lockTimestamp ? "block" : "none"}
                  label={
                    <HStack alignContent={"center"}>
                      <LockIcon /> <Text>Market has locked.</Text>
                    </HStack>
                  }
                  aria-label="Market has locked."
                  width={"full"}
                  boxShadow={"2xl"}
                  border={mode(
                    "1px solid rgba(0,0,0,0.12)",
                    "1px solid rgba(255,255,255,0.12)"
                  )}
                  bg={mode("#F9FAFB", "gray.900")}
                  rounded={"lg"}
                  textColor={mode("gray.600", "gray.100")}
                >
                  <ButtonGroup
                    justifyContent={"center"}
                    size="lg"
                    spacing="4"
                    fontSize="2xl"
                    onClick={nextStep}
                    isDisabled={!publicKey || dt >= lockTimestamp}
                  >
                    <Button
                      id="buy"
                      className={mode(
                        styles.wallet_adapter_button_trigger_light_mode,
                        styles.wallet_adapter_button_trigger_dark_mode
                      )}
                      p="7"
                      rounded={"xl"}
                      fontSize={"xl"}
                      width={"full"}
                      textColor={mode("white", "#353535")}
                      bg={mode("#353535", "gray.50")}
                      onClick={() => setOutcomeIndex(0)}
                    >
                      Yes
                    </Button>

                    <Button
                      id="sell"
                      variant={"outline"}
                      p="7"
                      fontSize={"xl"}
                      rounded={"xl"}
                      width="full"
                      textColor={mode("gray.600", "whiteAlpha.700")}
                      borderColor={mode("gray.400", "whiteAlpha.700")}
                      transition={"all 0.3s ease"}
                      _hover={{
                        textColor: mode("gray.800", "white"),
                        borderColor: mode("gray.800", "white"),
                      }}
                      onClick={() => setOutcomeIndex(1)}
                    >
                      No
                    </Button>
                  </ButtonGroup>
                </Tooltip>
              </Stack>
            </Stack>
          </Stack>
        )) ||
        (activeStep === 1 && (
          <Formik
            initialValues={{ stake: 2, limitOrder: marketBuyPrice }}
            onSubmit={async (values) => {
              console.log("values", values);
              try {
                const txId = await placeBuyOrder(
                  program,
                  publicKey,
                  new PublicKey(market.publicKey),
                  outcomeIndex,
                  true,
                  isMarketBuy ? marketBuyPrice : Number(values.limitOrder),
                  values.stake
                );
                setSuccess(true);
                toast({
                  title: "Order placed",
                  description: (
                    <Link
                      href={`https://solscan.io/tx/${txId}?cluster=devnet`}
                      isExternal
                    >
                      <HStack>
                        <Text>View transaction</Text>
                        <ExternalLinkIcon />
                      </HStack>
                    </Link>
                  ),
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  position: "bottom-right",
                  containerStyle: { marginBottom: "25px" },
                });
                nextStep;
              } catch (e) {
                setSuccess(false);
                toast({
                  title: "Order failed",
                  description: e.message,
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                  position: "bottom-right",
                  containerStyle: { marginBottom: "25px" },
                });
              }
            }}
          >
            {({ values, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <Heading size="md">Swap summary</Heading>

                  <Stack spacing="3">
                    <TradeFormItem
                      label={
                        <Button
                          size={"sm"}
                          onClick={() => setIsMarketBuy(!isMarketBuy)}
                        >
                          {isMarketBuy ? `Market buy` : `Limit order`}
                        </Button>
                      }
                    >
                      {isMarketBuy ? (
                        marketBuyPrice ?? (
                          <Skeleton
                            rounded={"md"}
                            width={"80px"}
                            height={"20px"}
                          />
                        )
                      ) : (
                        <Field name="limitOrder">
                          {({ field, form }) => (
                            <NumberInput
                              name="limitOrder"
                              onChange={(val) => {
                                // val.replace(/^\$/, "");
                                form.setFieldValue(field.name, val);
                              }}
                              onKeyPress={(e) => {
                                e.which === 13 && e.preventDefault();
                              }}
                              size={"sm"}
                              width={"35%"}
                              min={1.01}
                              max={1.99}
                              precision={2}
                              step={0.01}
                              value={values.limitOrder}
                            >
                              <NumberInputField
                                fontSize={"sm"}
                                textAlign={"end"}
                                rounded={"md"}
                                boxShadow={"sm"}
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          )}
                        </Field>
                      )}
                    </TradeFormItem>
                    <TradeFormItem label="Stake">
                      <Field name="stake">
                        {({ field, form }) => (
                          <NumberInput
                            name="stake"
                            onChange={(val) =>
                              form.setFieldValue(field.name, val)
                            }
                            onKeyPress={(e) => {
                              e.which === 13 && e.preventDefault();
                            }}
                            size={"sm"}
                            width={"35%"}
                            min={0}
                            max={100}
                            value={values.stake}
                          >
                            <NumberInputField
                              fontSize={"sm"}
                              textAlign={"end"}
                              rounded={"md"}
                              boxShadow={"sm"}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )}
                      </Field>
                    </TradeFormItem>
                    {/* <TradeFormItem
                        label={
                          <HStack>
                            <Text>Fees</Text>
                            <Tooltip
                              label={"A 1% fee goes to liquidity providers"}
                              p={3}
                            >
                              <InfoOutlineIcon cursor={"help"} />
                            </Tooltip>
                          </HStack>
                        }
                      >
                        1%
                      </TradeFormItem> */}
                    <Flex justify="space-between">
                      <Text fontSize="lg" fontWeight="semibold">
                        Total
                      </Text>
                      <Text fontSize="xl" fontWeight="extrabold">
                        {values.stake} USDC
                      </Text>
                    </Flex>
                  </Stack>

                  <ButtonGroup
                    justifyContent={"center"}
                    size="lg"
                    fontSize="md"
                    spacing="3"
                  >
                    <Button
                      onClick={prevStep}
                      variant={"ghost"}
                      transition={"all 0.3s ease"}
                      rounded={"lg"}
                      _hover={{
                        bg: mode("gray.200", "gray.700"),
                        transform: "translateX(-2px)",
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>

                    <Button
                      as={motion.button}
                      whileTap={{ scale: 0.9 }}
                      type={"submit"}
                      className={mode(
                        styles.wallet_adapter_button_trigger_light_mode,
                        styles.wallet_adapter_button_trigger_dark_mode
                      )}
                      isDisabled={
                        !publicKey || values.stake == 0 || dt >= lockTimestamp
                      }
                      isLoading={isSubmitting}
                      textColor={mode("white", "#353535")}
                      bg={mode("#353535", "gray.50")}
                      boxShadow={"xl"}
                      width={"full"}
                      rounded={"lg"}
                    >
                      Place Order
                    </Button>
                    {/* <ThreeButton /> */}
                  </ButtonGroup>
                </Stack>
              </form>
            )}
          </Formik>
        ))
      )}

      {activeStep === steps.length && (
        <Stack spacing={8}>
          <Heading size={"md"}>Woohoo! Your order has been placed!</Heading>
          <Button
            onClick={reset}
            size="lg"
            mt={5}
            textColor={mode("white", "#353535")}
            bg={mode("#353535", "gray.50")}
            boxShadow={"xl"}
            className={mode(
              styles.wallet_adapter_button_trigger_light_mode,
              styles.wallet_adapter_button_trigger_dark_mode
            )}
          >
            Done
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export const TradeForm = ({ market }) => {
  const tabListStyle = {
    color: "blue.500",
    fontSize: "sm",
    fontWeight: "medium",
    rounded: "xl",
    px: "3",
    transition: "all .2s ease",
    _hover: { bg: mode("blue.50", "blue.900") },
    _selected: {
      bg: mode("blue.500", "blue.600"),
      boxShadow: mode(
        "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)",
        "0px 1px 25px -5px rgb(8 133 225 / 48%), 0 10px 10px -5px rgb(8 133 225 / 43%)"
      ),
      fontSize: "sm",
      color: "white",
      fontWeight: "semibold",
    },
  };

  return (
    <Stack
      spacing="8"
      rounded="2xl"
      padding="6"
      borderWidth={"1px"}
      borderColor={mode("whiteAlpha.800", "rgba(255, 255, 255, 0.11)")}
      w={{ base: "full", lg: "340px" }}
      boxShadow={"0 4px 30px rgba(0, 0, 0, 0.1)"}
      background={mode("whiteAlpha.800", "rgba(32, 34, 46, 0.6)")}
      backdropFilter={{ md: "blur(5px)" }}
      mb={{ base: "12", lg: "0" }}
    >
      <Tabs variant={"unstyled"}>
        <TabList mb={3}>
          <Tab sx={tabListStyle}>Trade</Tab>
          <Tab ml={3} sx={tabListStyle}>
            Pool
          </Tab>
          {/* <Tab ml={3} sx={tabListStyle}>
              Airdrop
            </Tab> */}
        </TabList>

        <TabPanels>
          <TabPanel px={0} pb={2}>
            <Swap market={market} />
          </TabPanel>

          <TabPanel px={0}>
            <TokenSwapForm />
          </TabPanel>

          {/* Airdrop Tab for testing */}
          <TabPanel px={0}>
            <Airdrop />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

import { useState } from "react";
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
} from "@chakra-ui/react";
import { ArrowBackIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { Field, Formik } from "formik";
import Confetti from "react-dom-confetti";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { getOutcomeState } from "@/store/slices/outcomeSlice";
import { useSelector } from "@/store/store";
import { TokenSwapForm } from "./TokenPool";
import { Airdrop } from "./TokenPool/AirdropForm";

import styles from "@/styles/Home.module.css";

type TradeFormItemProps = {
  label: string | React.ReactNode;
  value?: string;
  children?: React.ReactNode;
};

const Swap = ({ market }) => {
  const { marketLockTimestamp, outcomeAccounts } = market;
  const [outcome, setOutcome] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const { title, index } = useSelector(getOutcomeState);
  const { publicKey } = useWallet();

  const toast = useToast();
  const steps = [{ label: "" }, { label: "" }];
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const dt = new Date(parseInt(marketLockTimestamp, 16) * 1000);
  const day = dt.getDate().toString();
  const month = dt.toLocaleString("default", { month: "long" });
  const year = dt.getFullYear().toString();

  return (
    <Stack>
      {(activeStep === 0 && (
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
              {`${outcomeAccounts[0].account.title}
              ${outcomeAccounts[0].account.latestMatchedPrice}%`}
            </Heading>
          </Flex>

          <Stack spacing={6}>
            <Heading
              width={"90%"}
              fontSize={"2xl"}
              fontWeight={"semibold"}
              textColor={mode("gray.800", "gray.100")}
            >
              {market.title}
            </Heading>
            <Stack pt={2}>
              <ButtonGroup
                justifyContent={"center"}
                size="lg"
                spacing="4"
                fontSize="2xl"
                onClick={nextStep}
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
                  onClick={() => setOutcome(0)}
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
                  textColor={mode("gray.500", "whiteAlpha.700")}
                  borderColor={mode("gray.400", "whiteAlpha.700")}
                  transition={"all 0.3s ease"}
                  _hover={{
                    textColor: mode("gray.800", "white"),
                    borderColor: mode("gray.800", "white"),
                  }}
                  onClick={() => setOutcome(1)}
                >
                  No
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </Stack>
      )) ||
        (activeStep === 1 && (
          <Formik
            initialValues={{ contractAmount: 2 }}
            onSubmit={(values) => {
              // transferTo(values.contractAmount)
              nextStep;
              setTimeout(() => {
                setSuccess(false);
              }, 6000);
            }}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <Heading size="md">Swap summary</Heading>

                  <Stack spacing="3">
                    <TradeFormItem
                      label="Price per contract"
                      value={`${outcomeAccounts[outcome].account.latestMatchedPrice}`}
                    />
                    <TradeFormItem label="No. of contracts">
                      <Field name="contractAmount">
                        {({ field, form }) => (
                          <NumberInput
                            name="contractAmount"
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
                            value={values.contractAmount}
                          >
                            <NumberInputField
                              fontSize={"sm"}
                              textAlign={"end"}
                              rounded={"md"}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )}
                      </Field>
                    </TradeFormItem>
                    <TradeFormItem
                      label={
                        <HStack>
                          <Text>Fees</Text>
                          <Tooltip
                            label={"A 2% fee goes to liquidity providers"}
                            p={3}
                          >
                            <InfoOutlineIcon cursor={"help"} />
                          </Tooltip>
                        </HStack>
                      }
                    >
                      1%
                    </TradeFormItem>
                    <Flex justify="space-between">
                      <Text fontSize="lg" fontWeight="semibold">
                        Total
                      </Text>
                      <Text fontSize="xl" fontWeight="extrabold">
                        {values.contractAmount *
                          outcomeAccounts[outcome].account
                            .latestMatchedPrice}{" "}
                        USDC
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
                      type={"submit"}
                      className={mode(
                        styles.wallet_adapter_button_trigger_light_mode,
                        styles.wallet_adapter_button_trigger_dark_mode
                      )}
                      isDisabled={!publicKey || values.contractAmount == 0}
                      isLoading={isLoading}
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
        ))}

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

const TradeFormItem = (props: TradeFormItemProps) => {
  const { label, value, children } = props;

  return (
    <Flex justify="space-between" fontSize="sm">
      <Text as={"div"} fontWeight="medium" color={mode("gray.600", "gray.400")}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  );
};

export const TradeForm = ({ market }) => {
  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };
  const tabListStyle = {
    color: "blue.500",
    fontSize: "sm",
    fontWeight: "medium",
    rounded: "xl",
    px: "3",
    transition: "all .2s ease",
    _hover: { bg: mode("blue.50", "blue.900") },
    _selected: {
      bg: "blue.500",
      boxShadow:
        "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)",
      fontSize: "sm",
      color: "white",
      fontWeight: "semibold",
    },
  };

  return (
    <>
      {/* TODO: refine progress bar design */}
      <Stack
        spacing="8"
        rounded="2xl"
        padding="6"
        borderWidth={"1px"}
        borderColor={mode("whiteAlpha.800", "")}
        w={{ base: "full", lg: "340px" }}
        boxShadow={"0 4px 30px rgba(0, 0, 0, 0.1)"}
        background={mode("whiteAlpha.800", "rgba(32, 34, 46, 0.2)")}
        backdropFilter={{ md: "blur(5px)" }}
      >
        <Tabs variant={"unstyled"}>
          <TabList mb={3}>
            <Tab sx={tabListStyle}>Swap</Tab>
            <Tab ml={3} sx={tabListStyle}>
              Pool
            </Tab>
            <Tab ml={3} sx={tabListStyle}>
              Airdrop
            </Tab>
          </TabList>

          <TabPanels>
            {/* Swap Tab */}
            <TabPanel px={0} pb={2}>
              <Swap market={market} />
            </TabPanel>

            {/* Pool Tab */}
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
      {/* <Confetti active={!isLoading} config={confettiConfig} /> */}
    </>
  );
};

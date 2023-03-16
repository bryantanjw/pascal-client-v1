import { useEffect, useMemo, useState, memo } from "react";
import {
  Button,
  useColorModeValue as mode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Circle,
  Stack,
  Flex,
  Text,
  Input,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Image,
  HStack,
  ModalHeader,
  FormErrorMessage,
  Link,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Popover,
  Skeleton,
  ScaleFade,
  Tooltip,
  Switch,
  Collapse,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useNumberInput,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  CloseIcon,
  InfoOutlineIcon,
  LockIcon,
} from "@chakra-ui/icons";
import * as yup from "yup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "@/context/ProgramProvider";
import { createOrderUiStake } from "@monaco-protocol/client";
import { Formik, Field, useFormikContext } from "formik";
import { usdcMint } from "@/utils/constants";
import { getPriceData, logResponse } from "@/utils/monaco";
import {
  formatNumber,
  calculateAverageEntryPrices,
  getCountdown,
  getSellOrderMatches,
} from "@/utils/helpers";

const PositionModal = ({ isOpen, onClose, position }) => {
  console.log("position", position);
  const { marketTitle } = position;
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return (
    <Modal
      size={"lg"}
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="scale"
    >
      <ModalOverlay backdropFilter="auto" backdropBlur="1px" />
      <ModalContent
        mx={"15px"}
        p={"15px"}
        rounded={"2xl"}
        boxShadow={"2xl"}
        borderWidth={"1px"}
        borderColor={mode("gray.300", "rgba(255, 255, 255, 0.11)")}
        background={mode(
          "gray.50",
          "linear-gradient(to bottom right, rgba(31,33,45,0.5), rgba(200,200,200,0.05) 100%)"
        )}
        backdropFilter={"blur(15px)"}
      >
        <Circle
          onClick={onClose}
          p={"3px"}
          m={"12px 0px 0px 12px"}
          size="11px"
          bg="#FB5753"
          color="#7E0609"
          border={"solid 2px #DF4644"}
          _hover={{
            "& > svg": {
              opacity: 1,
            },
          }}
        >
          <CloseIcon boxSize={"6px"} opacity={0} />
        </Circle>

        <ModalHeader mt={4}>
          <Text
            as={Link}
            href={`/market/${position?.account.market}`}
            fontSize={"lg"}
            letterSpacing={"wide"}
            isExternal
          >
            {marketTitle}
          </Text>
        </ModalHeader>
        <FormBody position={position} />
      </ModalContent>
    </Modal>
  );
};

const FormBody = ({ position }) => {
  const { prices, trades } = position;
  const program = useProgram();
  const { publicKey } = useWallet();
  const [outcomeIndex, setOutcomeIndex] = useState<number>(0);

  const formStyle = {
    mb: 3,
    px: 6,
    py: 2,
    rounded: "xl",
    borderWidth: "1px",
    borderColor: mode("gray.300", "rgba(255, 255, 255, 0.11)"),
    background: mode(
      "transparent",
      "linear-gradient(to bottom right, rgba(39,41,53,0.5), rgba(200,200,200,0.01) 160%)"
    ),
    boxShadow: "sm",
  };

  const InputForm = ({ children }) => {
    return (
      <Formik
        initialValues={{ stake: null }}
        validationSchema={yup.object().shape({
          stake: yup.number().required("Required"),
          price: yup
            .number()
            .min(1.01, "Minimum price is $1.01")
            .max(1.99, "Maximum price is $1.99"),
        })}
        onSubmit={async (values) => {
          console.log("values", values);
          await placeSellOrders(
            position.account.market,
            outcomeIndex,
            values.stake!
          );
        }}
      >
        {children}
      </Formik>
    );
  };

  const outcomeStake = useMemo(() => {
    return (
      parseFloat(
        position?.account.outcomeMaxExposure[
          outcomeIndex === 0 ? 1 : 0
        ].toString()
      ) /
      10 ** 6
    );
  }, [position, outcomeIndex]);

  const averageEntryPrices = useMemo(() => {
    const avgPrice = calculateAverageEntryPrices(trades);
    console.log("avgPrice", avgPrice);
    return avgPrice;
  }, [trades]);

  const highestBid = useMemo(() => {
    return prices[outcomeIndex].for[0]?.price;
  }, [prices, outcomeIndex]);

  const matchingAsks = (stake) => {
    if (prices && stake) {
      const bids = prices[outcomeIndex].for;
      // use values.stake to get the stake field value
      const matchingAsks = getSellOrderMatches(
        averageEntryPrices[outcomeIndex].entryPrice,
        stake ?? 0,
        bids
      );
      console.log("matchingAsks", matchingAsks);
      return matchingAsks;
    }
    return null;
  };

  async function placeSellOrders(
    marketPk: PublicKey,
    outcomeIndex: number,
    stake: number
  ) {
    try {
      const priceData = await getPriceData(program, marketPk!);
      const bids = priceData.marketPriceSummary[outcomeIndex].for;
      console.log("bids", bids);

      const matchingAsks = getSellOrderMatches(
        averageEntryPrices[outcomeIndex].entryPrice,
        stake,
        bids
      );
      console.log("matchingAsks", matchingAsks);
      const { sellOrders } = matchingAsks;

      for (let i = 0; i < sellOrders.length; i++) {
        const order = sellOrders[i];
        const response = await createOrderUiStake(
          program,
          marketPk,
          outcomeIndex,
          false,
          order.price,
          order.stake
        );
        if (response.success) {
          logResponse(response);
        } else {
          console.log("error", response.errors);
        }
      }
    } catch (error) {
      console.log("placeSellOrders error", error);
    }
  }

  return (
    <InputForm>
      {(props) => (
        <>
          <ModalBody>
            <LimitToggle position={position} formProps={props} />
            <Stack sx={formStyle}>
              <Flex
                fontSize={"sm"}
                opacity={0.85}
                justifyContent={"space-between"}
                alignItems={"center"}
                pt={2}
              >
                <Text>You sell</Text>
                <Text
                  cursor={"pointer"}
                  onClick={() => props.setFieldValue("stake", outcomeStake)}
                >
                  Stake: ${outcomeStake}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems={"center"}>
                <Menu>
                  <MenuButton
                    fontSize={"xl"}
                    letterSpacing={"wide"}
                    fontWeight={"bold"}
                    variant={"ghost"}
                    as={Button}
                    pl={2}
                  >
                    {outcomeIndex === 0 ? "YES" : "NO"} <ChevronDownIcon />
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup
                      defaultValue={outcomeIndex.toString()}
                      title="Outcome"
                      type="radio"
                      onChange={(value) => setOutcomeIndex(Number(value))}
                    >
                      <MenuItemOption value="0">Yes</MenuItemOption>
                      <MenuItemOption value="1">No</MenuItemOption>
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>

                <Field name="stake">
                  {({ field, form }) => (
                    <FormControl
                      textAlign={"end"}
                      isInvalid={form.errors.stake}
                      isDisabled={
                        props.isSubmitting ||
                        !publicKey ||
                        new Date() >= position.lockTimestamp
                      }
                    >
                      <LockedTooltip lockTimestamp={position.lockTimestamp}>
                        <Input
                          {...field}
                          type={"number"}
                          variant={"unstyled"}
                          placeholder={"0.00"}
                          textAlign={"end"}
                          width={"50%"}
                          fontSize={"xl"}
                          letterSpacing={"wide"}
                          fontWeight={"bold"}
                        />
                      </LockedTooltip>
                      <FormErrorMessage>{form.errors.stake}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
            </Stack>

            <Stack sx={formStyle}>
              <Flex
                fontSize={"sm"}
                opacity={0.85}
                justifyContent={"space-between"}
                alignItems={"center"}
                pt={2}
              >
                <Text>You receive</Text>
                <TokenBalance />
              </Flex>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <HStack px={2} py={1}>
                  <Image alt="USDC coin" boxSize={"1.5rem"} src={"/usdc.png"} />
                  <Text
                    fontSize={"xl"}
                    letterSpacing={"wide"}
                    fontWeight={"bold"}
                  >
                    USDC
                  </Text>
                </HStack>
                <Text
                  fontSize={"xl"}
                  letterSpacing={"wide"}
                  fontWeight={"bold"}
                >
                  {props && props.values && props.values.stake
                    ? (
                        outcomeStake +
                        (matchingAsks(props.values.stake)?.profitLoss ?? 0.0)
                      ).toFixed(2)
                    : "0.00"}
                </Text>
              </Flex>
            </Stack>
            <PositionSummary
              position={position}
              outcomeIndex={outcomeIndex}
              outcomeStake={outcomeStake}
              averageEntryPrices={averageEntryPrices}
              highestBid={highestBid}
              matchingAsks={matchingAsks}
            />
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button
              width={"full"}
              boxShadow={"xl"}
              rounded={"lg"}
              fontSize={"lg"}
              size={"lg"}
              fontWeight={"medium"}
              textColor={mode("white", "gray.800")}
              bg={mode("rgba(53,53,53)", "gray.200")}
              _hover={{
                bg: mode("rgba(53,53,53)", "gray.300"),
              }}
              type={"submit"}
              isLoading={props.isSubmitting}
              isDisabled={
                !publicKey ||
                new Date() >= position.lockTimestamp ||
                !props.values.stake ||
                !props.values.price
              }
              onClick={() => props.handleSubmit()}
            >
              Sell
            </Button>
          </ModalFooter>
        </>
      )}
    </InputForm>
  );
};

type PositionSummaryItemProps = {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
};

const PositionSummaryItem = (props: PositionSummaryItemProps) => {
  const { label, value, children } = props;
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={mode("gray.600", "gray.400")}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  );
};

const PositionSummary = ({
  position,
  outcomeIndex,
  outcomeStake,
  averageEntryPrices,
  highestBid,
  matchingAsks,
}) => {
  const { lockTimestamp } = position;

  return (
    <Stack spacing="2" py={3}>
      <PositionSummaryItem
        label="Remaining unmatched stake"
        value={
          matchingAsks && matchingAsks.unmatchedStake
            ? matchingAsks.unmatchedStake.stake
            : outcomeStake
        }
      />
      <PositionSummaryItem label="Potential earnings">
        <Popover offset={[0, 14]} placement="right-end">
          <PopoverTrigger>
            <InfoOutlineIcon cursor={"help"} />
          </PopoverTrigger>
          <PopoverContent
            width={"full"}
            boxShadow={"2xl"}
            bg={mode("#F9FAFB", "gray.900")}
          >
            <PopoverBody>
              <PotentialEarnings
                position={position}
                outcomeIndex={outcomeIndex}
                averageEntryPrices={averageEntryPrices}
                stake={outcomeStake}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </PositionSummaryItem>
      <PositionSummaryItem label="Market locking in">
        <Countdown timestamp={lockTimestamp} />
      </PositionSummaryItem>
      <PositionSummaryItem
        label="Avg. entry price"
        value={`$${averageEntryPrices?.[outcomeIndex].entryPrice ?? "0.00"}`}
      />
      <PositionSummaryItem
        label="Highest bid price"
        value={`$${highestBid ?? "0.00"}`}
      />
    </Stack>
  );
};

const TokenBalance = memo(function TokenBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [tokenBalance, setTokenBalance] = useState<number | null>(0);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        const usdcATA = await getAssociatedTokenAddress(usdcMint, publicKey!);
        const tokenBalance = (await connection.getTokenAccountBalance(usdcATA))
          .value.uiAmount;
        setTokenBalance(tokenBalance);
      } catch (err) {
        console.log("fetchTokenBalance", err);
      }
    };

    fetchTokenBalance();
  }, [tokenBalance]);

  return <div>Balance: {formatNumber(tokenBalance!)} USDC</div>;
});

function Countdown({ timestamp }) {
  const [countdown, setCountdown] = useState(getCountdown(timestamp));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(getCountdown(timestamp));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return <div>{countdown}</div>;
}

const PotentialEarnings = ({
  position,
  outcomeIndex,
  averageEntryPrices,
  stake,
}) => {
  const { prices, account } = position;

  const matchingAsks = useMemo(() => {
    if (prices) {
      const bids = prices[outcomeIndex].for;
      const matchingAsks = getSellOrderMatches(
        averageEntryPrices[outcomeIndex].entryPrice,
        stake,
        bids
      );
      console.log("matchingAsks", matchingAsks);
      return matchingAsks;
    }
    return null;
  }, [averageEntryPrices]);

  function formatElement(value: number, isBN: boolean = true) {
    return (
      <Text
        display={"inline"}
        fontWeight={"semibold"}
        color={
          value >= 0 ? mode("green", "green.200") : mode("red.400", "red.300")
        }
      >
        ${isBN ? Math.abs(value) / 10 ** 6 : Math.abs(value)}
      </Text>
    );
  }

  return (
    <Stack p={2} minW={"160px"}>
      {matchingAsks ? (
        <ScaleFade initialScale={0.9} in={true}>
          <Text>
            If resolved to <b>YES</b>, you net{" "}
            {formatElement(account.marketOutcomeSums[0])}
          </Text>
          {matchingAsks.sellOrders.length > 0 && (
            <Text>
              If position is liquidated, you net{" "}
              {formatElement(matchingAsks.profitLoss, false)}
            </Text>
          )}
          <Text>
            If resolved to <b>NO</b>, you net{" "}
            {formatElement(account.marketOutcomeSums[1])}
          </Text>
        </ScaleFade>
      ) : (
        Array(3)
          .fill(0)
          .map((_, i) => <Skeleton key={i} height={3} />)
      )}
    </Stack>
  );
};

const LockedTooltip = ({ lockTimestamp, children }) => {
  return (
    <Tooltip
      p={3}
      ml={6}
      display={new Date() >= lockTimestamp ? "block" : "none"}
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
      placement={"right"}
    >
      {children}
    </Tooltip>
  );
};

const LimitToggle = ({ position, formProps }) => {
  const { isSubmitting } = formProps;
  const { publicKey } = useWallet();
  const { isOpen, onToggle } = useDisclosure();

  const format = (val) => `$` + val;
  const parse = (val) => val.replace(/^\$/, "");

  const [value, setValue] = useState("1.53");

  const textStyle = {
    letterSpacing: "wide",
    fontWeight: "normal",
    rounded: "12px",
    _hover: {
      color: mode("gray.700", "gray.500"),
      _before: {
        background:
          "radial-gradient(circle at center bottom, hsl(0.00, 0%, 100%) -300%, transparent 68%)",
      },
    },
    _active: {
      color: mode("gray.900", "gray.50"),
      _before: {
        background:
          "radial-gradient(circle at center bottom, hsl(0.00, 0%, 100%) -80%, transparent 71%)",
      },
    },
  };

  const formStyle = {
    mb: 3,
    px: 6,
    py: 2,
    rounded: "xl",
    borderWidth: "1px",
    borderColor: mode("gray.300", "rgba(255, 255, 255, 0.11)"),
    background: mode(
      "transparent",
      "linear-gradient(to bottom right, rgba(39,41,53,0.5), rgba(200,200,200,0.01) 160%)"
    ),
    boxShadow: "sm",
  };

  return (
    <>
      <HStack
        px={3}
        mb={3}
        transition={"all 0.3s ease"}
        textColor={mode("gray.500", "gray.500")}
        display={"inline-flex"}
        backdropFilter={{ base: "", md: "blur(10px)" }}
        alignItems={"center"}
        borderWidth={"1px"}
        rounded={"xl"}
        borderColor={mode("gray.300", "rgba(255, 255, 255, 0.09)")}
        bg={mode(
          "transparent",
          "linear-gradient(to bottom right, rgba(39,41,53,0.5), rgba(50,50,50,0.1) 160%)"
        )}
        boxShadow={"sm"}
        _hover={{
          borderColor: mode("rgba(0,0,0,0.2)", "rgba(255, 255, 255, 0.15)"),
        }}
        onClick={() => {
          onToggle();
        }}
      >
        <Switch
          id="limitToggle"
          variant={"glow"}
          size={"sm"}
          isChecked={isOpen}
        />
        <Button
          fontSize={"0.98rem"}
          variant={"unstyled"}
          sx={textStyle}
          isActive={isOpen}
        >
          Limit
        </Button>
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <Stack sx={formStyle}>
          <Flex justifyContent="space-between" alignItems={"center"}>
            <Text letterSpacing={"wide"} fontWeight={"semibold"}>
              Price
            </Text>

            <Field name="price">
              {({ field, form }) => (
                <FormControl
                  textAlign={"end"}
                  isInvalid={form.errors.price}
                  isDisabled={isSubmitting || !publicKey}
                >
                  <LockedTooltip lockTimestamp={position.lockTimestamp}>
                    <NumberInput
                      variant={"unstyled"}
                      defaultValue={1.5}
                      precision={2}
                      step={0.05}
                      min={1.01}
                      max={1.99}
                      mr={-5}
                      isDisabled={
                        isSubmitting ||
                        !publicKey ||
                        new Date() >= position.lockTimestamp
                      }
                      onChange={(valueString) => setValue(parse(valueString))}
                      value={format(value)}
                    >
                      <NumberInputField
                        {...field}
                        placeholder={"0.00"}
                        textAlign={"end"}
                        width={"50%"}
                        fontSize={"xl"}
                        letterSpacing={"wide"}
                        fontWeight={"bold"}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </LockedTooltip>
                  <FormErrorMessage>{form.errors.price}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Flex>
        </Stack>
      </Collapse>
    </>
  );
};

export default PositionModal;

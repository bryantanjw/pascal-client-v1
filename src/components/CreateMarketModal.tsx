import React, { useState } from "react";
import {
  Stack,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Textarea,
  Heading,
  useColorModeValue as mode,
  HStack,
  Image,
  Text,
  keyframes,
  FormErrorMessage,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  Link,
  IconButton,
  useToast,
  Progress,
  Center,
  SlideFade,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Select as ReactSelect,
  chakraComponents,
  ChakraStylesConfig,
} from "chakra-react-select";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  getMarket,
  getMarketOutcomesByMarket,
  getTradesForMarket,
} from "@monaco-protocol/client";
import { openMarket } from "@monaco-protocol/admin-client";
import { useProgram } from "@/context/ProgramProvider";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createMarket,
  MarketType,
  DEFAULT_PRICE_LADDER,
  initialiseOutcomes,
  batchAddPricesToAllOutcomePools,
  ClientResponse,
} from "@monaco-protocol/admin-client";
import { categories } from "@/utils/constants";

import styles from "@/styles/Home.module.css";

enum CreateStatus {
  CreatingMarket = "Creating Market",
  InitialisingOutcomes = "Initialising Outcomes",
  AddingPrices = "Adding Prices",
  OpeningMarket = "Opening Market",
  Success = "Success",
}

const Form1 = () => {
  return (
    <>
      <Heading mt={6} mb={5} size="lg" fontWeight="semibold">
        Create a market
      </Heading>
      <Field name="title">
        {({ field, form }) => (
          <FormControl isInvalid={form.errors.title && form.touched.title}>
            <FormLabel htmlFor="title" fontWeight={"normal"}>
              Title
            </FormLabel>
            <Input {...field} id="title" placeholder=" " />
            <FormErrorMessage>{form.errors.title}</FormErrorMessage>
            <FormHelperText textAlign={"end"}>
              Keep it short and sweet!
            </FormHelperText>
          </FormControl>
        )}
      </Field>

      <Field name="category">
        {({ field, form }) => (
          <FormControl
            cursor={"text"}
            isInvalid={form.errors.category && form.touched.category}
          >
            <FormLabel htmlFor="category" fontWeight={"normal"}>
              Category
            </FormLabel>
            <Select {...field} placeholder={"-"}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{form.errors.category}</FormErrorMessage>
          </FormControl>
        )}
      </Field>

      <Field name="lockTimestamp">
        {({ field, form }) => (
          <FormControl
            id="lockTimestamp"
            isInvalid={form.errors.lockTimestamp && form.touched.lockTimestamp}
          >
            <FormLabel htmlFor="title" fontWeight={"normal"} mt={"5%"}>
              Resolution date
            </FormLabel>
            <Input {...field} type={"datetime-local"} />
            <FormErrorMessage>{form.errors.lockTimestamp}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    </>
  );
};

const Form2 = ({ title }) => {
  return (
    <Stack>
      <Heading mt={6} mb={5} size="lg" fontWeight="semibold">
        Create a market
      </Heading>
      <Text fontSize={"xl"} fontWeight={"medium"} size={"md"}>
        {title}
      </Text>
      <Field name="description">
        {({ field, form }) => (
          <FormControl
            isInvalid={form.errors.description && form.touched.description}
          >
            <FormLabel mt={2} htmlFor="description" fontWeight={"normal"}>
              Description
            </FormLabel>
            <Textarea
              {...field}
              id="description"
              placeholder="This market resolves to YES if..."
            />
            <FormErrorMessage>{form.errors.description}</FormErrorMessage>
            <FormHelperText textAlign={"end"}>
              Be clear and objective!
            </FormHelperText>
          </FormControl>
        )}
      </Field>

      <Field name="tag">
        {({ field, form }) => (
          <FormControl
            isInvalid={form.errors.keyword && form.touched.keyword}
            pt={4}
          >
            <FormLabel htmlFor="tag" fontWeight={"normal"}>
              Tag
            </FormLabel>
            <Input {...field} id="tag" placeholder=" " autoComplete="off" />
            <FormHelperText textAlign={"end"}>
              Enter a key phrase related to your market.
            </FormHelperText>
            <FormErrorMessage>{form.errors.keyword}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    </Stack>
  );
};

const SubmittedForm = ({ publicKey, success, isSubmitting, status }) => {
  return (
    <Box color={"gray.50"}>
      <Stack mb={10} mt={12} transition={"all 2s ease-in-out"}>
        {isSubmitting ? (
          <SlideFade in={isSubmitting}>
            <Center>
              <Text
                fontWeight={"bold"}
                fontSize={"3xl"}
                bgClip={"text"}
                bgGradient={mode(
                  "linear(to-r, #585656, #807e7e)",
                  "linear(to-r, #ffffff, #a9a5a5)"
                )}
              >
                {status}
              </Text>
            </Center>
          </SlideFade>
        ) : (
          <Heading
            lineHeight={1.2}
            size={"2xl"}
            fontWeight={"medium"}
            color={success ? "gray.50" : mode("gray.700", "gray.50")}
          >
            {success
              ? "Your market has been created!"
              : "Market creation failed 🙁"}
          </Heading>
        )}
      </Stack>

      <Progress
        size={"xs"}
        value={100}
        bgClip={"bar"}
        sx={{
          "& > div": {
            background: isSubmitting
              ? "linear-gradient(to right, rgba(128,90,213,0.2) 40%, rgba(127,190,188,0.2) 60%)"
              : mode("gray.700", "gray.400"),
          },
        }}
        isIndeterminate={isSubmitting}
        rounded={"2xl"}
      />

      {!isSubmitting && (
        <Flex
          mt={14}
          justifyContent={"flex-start"}
          textAlign={"center"}
          textColor={success ? "gray.50" : mode("gray.700", "gray.50")}
        >
          <Text mr={3} fontWeight={"normal"} fontSize={"lg"}>
            {success
              ? "View the market account on the blockchain"
              : "Please try again later or contact support."}
          </Text>
          <Link
            href={`https://solscan.io/account/${publicKey?.toBase58()}?cluster=devnet`}
            display={success ? "block" : "none"}
            _hover={{
              transform: "translateX(2px) scale(1.01)",
            }}
            isExternal
            fontSize={"lg"}
          >
            <ExternalLinkIcon />
          </Link>
        </Flex>
      )}
    </Box>
  );
};

export const CreateMarketModal = () => {
  const program = useProgram();
  const toast = useToast();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [marketPk, setMarketPk] = useState<PublicKey>();
  const [createStatus, setCreateStatus] = useState<CreateStatus>(
    CreateStatus.CreatingMarket
  );
  let duration = 0.5;

  async function createVerboseMarket(program, marketName, lockTimestamp) {
    const mintToken = new PublicKey(
      "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
    ); // <-- Wrapped SOL token address
    // Generate a publicKey to represent the event
    const eventAccountKeyPair = Keypair.generate();
    const eventPk = eventAccountKeyPair.publicKey;

    const marketLock = new Date(lockTimestamp).getTime(); // <-- lockTimestamp in seconds
    const type = MarketType.EventResultWinner;
    const outcomes = ["Yes", "No"];
    const priceLadder = Array.from({ length: 50 }, (_, i) => i + 1); // <-- 1 - 100 price ladder
    const batchSize = 50;

    function logResponse(response: ClientResponse<{}>) {
      function logJson(json: object) {
        console.log(JSON.stringify(json, null, 2));
      }

      if (!response.success) {
        console.log(response.errors);
        toast({
          title: "Transaction failed",
          description: JSON.stringify(response.errors),
          // .replace(
          //   /^"(.*)"$/,
          //   "$1"
          // ),
          status: "error",
          duration: 8000,
          position: "bottom-right",
          isClosable: true,
          containerStyle: { marginBottom: "50px" },
        });
      } else {
        logJson(response);
      }
    }

    console.log(`Creating market ⏱`);
    const marketResponse = await createMarket(
      program,
      marketName,
      type,
      mintToken,
      marketLock,
      eventPk
    );
    // returns CreateMarketResponse: market account public key, creation transaction id, and market account
    logResponse(marketResponse);
    if (marketResponse.success) {
      console.log(
        `MarketAccount ${marketResponse.data.marketPk.toString()} created ✅`
      );
      console.log(`TransactionId: ${marketResponse.data.tnxId}`);
      setCreateStatus(CreateStatus.InitialisingOutcomes);
    } else {
      console.log("Error creating market");
      return;
    }

    const marketPk = marketResponse.data.marketPk;

    console.log(`Initialising market outcomes ⏱`);
    const initialiseOutcomePoolsResponse = await initialiseOutcomes(
      program,
      marketPk,
      outcomes
    );
    // returns OutcomeInitialisationsResponse: list of outcomes, their pdas, and transaction id
    logResponse(initialiseOutcomePoolsResponse);
    if (initialiseOutcomePoolsResponse.success) {
      console.log(`Outcomes added to market ✅`);
      setCreateStatus(CreateStatus.AddingPrices);
    } else {
      console.log("Error initialising outcomes");
      return;
    }

    console.log(`Adding prices to outcomes ⏱`);
    const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
      program,
      marketPk,
      priceLadder,
      batchSize
    );
    // returns BatchAddPricesToOutcomeResponse: transaction id, and confirmation
    logResponse(addPriceLaddersResponse);
    if (addPriceLaddersResponse.success) {
      console.log(`Prices added to outcomes ✅`);
    } else {
      console.log("Error adding prices to outcomes");
      return;
    }

    console.log(`Market ${marketPk.toString()} creation complete ✨`);
    return marketResponse.data.marketPk;
  }

  const addMarket = async (values) => {
    const { title, category, lockTimestamp, description, tag, program } =
      values;

    try {
      const marketPk = await createVerboseMarket(program, title, lockTimestamp);
      if (!marketPk) {
        throw new Error("Error creating market");
      }
      // Set market status from 'initializing' to 'open'
      setCreateStatus(CreateStatus.OpeningMarket);
      await openMarket(program, marketPk);

      // Get accounts
      const outcomeResponse = await getMarketOutcomesByMarket(
        program,
        marketPk!
      );
      const outcomeAccounts = outcomeResponse?.data.marketOutcomeAccounts;
      const market = await getMarket(program, marketPk!);
      const marketAccount = market.data;
      const trade = await getTradesForMarket(program, marketPk!);
      const tradeAccount = trade.data;

      // Add accounts to database
      const data = {
        category,
        description,
        tag,
        marketAccount,
        outcomeAccounts,
        tradeAccount,
      };
      console.log("data", data);
      const response = await fetch("../api/createMarket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const status = await response.json();

      setIsSuccess(true);
      setCreateStatus(CreateStatus.Success);
      setMarketPk(marketPk);
    } catch (error) {
      setIsSuccess(false);
    }
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Market title is required"),
    category: yup.string().required("Market category is required"),
    lockTimestamp: yup
      .date()
      .min(new Date(), "Resolution date must be in the future")
      .required(),
    description: yup.string().required("Resolution criteria is required"),
    tag: yup.string(),
  });

  return (
    <MotionConfig transition={{ duration, type: "tween" }}>
      <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
      <Formik
        initialValues={{
          title: "",
          category: "",
          lockTimestamp: "",
          description: "",
          tag: "",
          program,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          await addMarket(values);
        }}
      >
        {(props) => (
          <ModalContent
            maxW={"500px"}
            p={"12px 15px"}
            rounded={"2xl"}
            boxShadow={"2xl"}
            transition={`background-color 0.8s ease-in-out`}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={
              isSuccess
                ? mode("rgb(64,40,249,0.85)", "rgb(64,40,220,0.9)")
                : mode("rgb(255,255,255)", "rgb(30,30,30,0.9)")
            }
            backdropFilter={{ md: "blur(5px)" }}
          >
            <ModalCloseButton
              color={isSuccess ? "gray.50" : mode("gray.700", "gray.100")}
              m={"10px auto"}
              rounded={"xl"}
              size={"lg"}
              isDisabled={props.isSubmitting}
            />

            <ModalBody>
              <Box m="10px auto">
                <ResizablePanel>
                  <FormStepper {...props} success={isSuccess}>
                    <Form1 />
                    <Form2 title={props.values.title} />
                    <SubmittedForm
                      publicKey={marketPk}
                      success={isSuccess}
                      isSubmitting={props.isSubmitting}
                      status={createStatus}
                    />
                  </FormStepper>
                </ResizablePanel>
              </Box>
            </ModalBody>
          </ModalContent>
        )}
      </Formik>
    </MotionConfig>
  );
};

const FormStepper = ({ success, children, ...props }) => {
  const { isSubmitting, handleSubmit, errors, values } = props;
  const stepsArray = React.Children.toArray(children);
  const [currentStep, setCurrentStep] = useState(0);
  const currentChild = stepsArray[currentStep];

  const buttonStyle = {
    textColor: mode("gray.700", "gray.100"),
    borderColor: mode("gray.700", "gray.100"),
    transition: "all 0.3s ease",
    _hover: {
      bg: mode("gray.100", "whiteAlpha.100"),
    },
  };

  return (
    <Form>
      <Stack spacing={4}>{currentChild}</Stack>

      <Flex justifyContent={"flex-end"} mt={14} py={2}>
        {currentStep !== 2 && (
          <Button
            disabled={
              !values.title ||
              !values.category ||
              !values.lockTimestamp ||
              isSubmitting
            }
            variant={"outline"}
            onClick={() => {
              currentStep === 0 ? setCurrentStep(1) : setCurrentStep(0);
            }}
            sx={buttonStyle}
          >
            {currentStep === 0 ? "Next" : "Back"}
          </Button>
        )}

        {currentStep === 1 && (
          <Button
            ml={4}
            type="submit"
            isDisabled={isSubmitting || !values.description}
            isLoading={isSubmitting}
            onClick={async () => {
              handleSubmit();
              if (!isSubmitting) setCurrentStep(2);
            }}
            boxShadow={"xl"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            className={mode(
              styles.wallet_adapter_button_trigger_light_mode,
              styles.wallet_adapter_button_trigger_dark_mode
            )}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            textColor={mode("white", "#353535")}
            bg={mode("#353535", "gray.50")}
          >
            Submit
          </Button>
        )}

        {currentStep === 2 && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <IconButton
              display={isSubmitting ? "none" : success ? "none" : "block"}
              aria-label="Back"
              icon={<ChevronLeftIcon />}
              size={"lg"}
              fontSize={"2xl"}
              onClick={() => setCurrentStep(1)}
            />
            <IconButton
              display={isSubmitting ? "none" : success ? "block" : "none"}
              aria-label="View market"
              rounded={"xl"}
              variant={"ghost"}
              fontSize={"4xl"}
              size={"lg"}
              color={"gray.50"}
              bg={"gray.700"}
              boxShadow={"xl"}
              mt={8}
              _hover={{
                transform: "translateX(3px) scale(1.01)",
              }}
              icon={<ChevronRightIcon />}
              as={Link}
            />
          </motion.div>
        )}
      </Flex>
    </Form>
  );
};

// START: Custom styling ReactSelect //
const collapse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const shine = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const chakraStyles: ChakraStylesConfig = {
  menuList: () => ({
    background: "transparent",
  }),
  menu: () => ({
    position: "relative",
    pt: 2,
    mb: 4,
    marginTop: 0,
    height: "0px",
    animation: `${collapse} 0.2s ease-in-out`,
  }),
  option: () => ({
    background: "transparent",
  }),
  input: (provided, state) => ({
    ...provided,
    color: state.hasValue ? "transparent" : "normal",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : 0,
    transition: "all 0.3s ease",
  }),
  placeholder: () => ({
    visibility: "hidden",
  }),
};

const CustomReactSelect = {
  Option: ({ children, ...props }) => (
    // @ts-ignore
    <chakraComponents.Option {...props}>
      <Box
        borderWidth="1px"
        py={1}
        px={{ base: 1, md: 3 }}
        borderRadius="3xl"
        cursor="pointer"
        transition="all 0.2s ease"
        bg={mode("gray.100", "gray.700")}
        _hover={{
          // eslint-disable-next-line react-hooks/rules-of-hooks
          borderColor: mode("black", "white"),
          bg: "transparent",
        }}
        _focus={{ shadow: "outline", boxShadow: "none" }}
      >
        <HStack spacing={1}>
          <Image
            src={props.data.iconUrl}
            alt={props.data.title}
            width={{ base: "9px", md: "14px" }}
            filter={mode("invert(0%)", "invert(100%)")}
          />
          <Box>
            <Text fontSize={{ base: "10px", md: "sm" }} fontWeight="bold">
              {props.data.title}
            </Text>
          </Box>
        </HStack>
      </Box>
    </chakraComponents.Option>
  ),

  SingleValue: ({ children, ...props }) => {
    return (
      // @ts-ignore
      <chakraComponents.SingleValue {...props}>
        <Box
          borderWidth="1px"
          py={1}
          px={{ base: 1, md: 2 }}
          borderRadius="3xl"
          cursor="pointer"
          transition="all 0.2s"
          bg={mode("black", "white")}
          color={mode("white", "black")}
        >
          <HStack spacing={2}>
            <Image
              src={props.data.iconUrl}
              alt={props.data.title}
              width={{ base: "11px", md: "9px" }}
              filter={mode("invert(100%)", "invert(0%)")}
            />
            <Box>
              <Text fontSize={{ base: "10px", md: "2xs" }} fontWeight="bold">
                {props.data.title}
              </Text>
            </Box>
          </HStack>
        </Box>
      </chakraComponents.SingleValue>
    );
  },

  MenuList: ({ children, ...props }) => {
    return (
      // @ts-ignore
      <chakraComponents.MenuList {...props}>
        <HStack
          pt={1}
          bg={"transparent"}
          border={0}
          mb={"30px"}
          position="relative"
        >
          {children}
        </HStack>
      </chakraComponents.MenuList>
    );
  },

  Menu: ({ children, ...props }) => {
    return (
      // @ts-ignore
      <chakraComponents.Menu {...props}>{children}</chakraComponents.Menu>
    );
  },
};

// CustomSelect design to be revisited; field values are not propagating to formik
const CustomSelect = () => {
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
    iconUrl: `./${category}.svg`,
    title: category,
  }));
  return (
    <ReactSelect
      useBasicStyles
      name="category"
      options={categoryOptions}
      components={CustomReactSelect}
      chakraStyles={chakraStyles}
    />
  );
};
// END: Custom styling ReactSelect //

const ResizablePanel = ({ children }) => {
  let [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={{ height: height || "auto" }}
      className="relative overflow-hidden"
    >
      <AnimatePresence initial={false}>
        <Box ref={ref} className="px-8 pb-8">
          {children}
        </Box>
      </AnimatePresence>
    </motion.div>
  );
};

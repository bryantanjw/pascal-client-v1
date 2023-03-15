import React, { useState } from "react";
import {
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  FormHelperText,
  Select,
  Stack,
  Text,
  Input,
  SlideFade,
  Center,
  Box,
  Progress,
  Flex,
  Link,
  Button,
  IconButton,
  useColorModeValue as mode,
  Collapse,
  useDisclosure,
  ModalFooter,
  Tooltip,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import { Field, Form } from "formik";
import { categories, resolutionSources } from "@/utils/constants";

import styles from "@/styles/Home.module.css";

export const Form1 = () => {
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
            <Textarea {...field} id="title" placeholder=" " boxShadow={"sm"} />
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
            <Select {...field} placeholder={"-"} boxShadow={"sm"}>
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
              Market lock date
              <Tooltip
                label={
                  "Trading will be halted after this time (local timezone)."
                }
                p={3}
                ml={2}
                placement={"right"}
                hasArrow
                rounded={"md"}
              >
                <InfoOutlineIcon ml={3} width={"18px"} cursor={"help"} />
              </Tooltip>
            </FormLabel>
            <Input {...field} type={"datetime-local"} boxShadow={"sm"} />
            <FormErrorMessage>{form.errors.lockTimestamp}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    </>
  );
};

export const Form2 = ({ title }) => {
  const { isOpen, onToggle } = useDisclosure();
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
            <FormLabel mt={5} htmlFor="description" fontWeight={"normal"}>
              Description
            </FormLabel>
            <Textarea
              {...field}
              id="description"
              placeholder="This market resolves to YES if..."
              boxShadow={"sm"}
            />
            <FormErrorMessage>{form.errors.description}</FormErrorMessage>
            <FormHelperText textAlign={"end"}>
              Be clear and objective!
            </FormHelperText>
          </FormControl>
        )}
      </Field>

      <Field name="resolutionSource">
        {({ field, form }) => (
          <FormControl
            isInvalid={form.errors.keyword && form.touched.keyword}
            pt={5}
          >
            <FormLabel htmlFor="tag" fontWeight={"normal"}>
              Resolution source
            </FormLabel>
            <Select {...field} placeholder={"-"} boxShadow={"sm"}>
              {resolutionSources.map((source) => (
                <option key={source.title} value={source.title}>
                  {source.title}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{form.errors.keyword}</FormErrorMessage>
          </FormControl>
        )}
      </Field>

      <Field name="tag">
        {({ field, form }) => (
          <FormControl
            isInvalid={form.errors.keyword && form.touched.keyword}
            pt={7}
          >
            <FormLabel htmlFor="tag" fontWeight={"normal"}>
              Tag
            </FormLabel>
            <Input
              {...field}
              id="tag"
              placeholder=" "
              autoComplete="off"
              boxShadow={"sm"}
            />
            <FormHelperText textAlign={"end"}>
              Enter a key phrase related to your market.
            </FormHelperText>
            <FormErrorMessage>{form.errors.keyword}</FormErrorMessage>
          </FormControl>
        )}
      </Field>

      <Text
        pt={6}
        pb={3}
        textDecoration={"underline"}
        cursor={"pointer"}
        onClick={onToggle}
      >
        Advanced options
      </Text>
      <Collapse in={isOpen} animateOpacity>
        <Stack spacing={5}>
          <Field name="ticker">
            {({ field, form }) => (
              <FormControl>
                <FormLabel htmlFor="ticker" fontWeight={"normal"}>
                  Ticker
                </FormLabel>
                <Input
                  {...field}
                  id="tag"
                  placeholder=" "
                  autoComplete="off"
                  boxShadow={"sm"}
                />
                <FormErrorMessage>{form.errors.keyword}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="oracleSymbol">
            {({ field, form }) => (
              <FormControl>
                <FormLabel htmlFor="oracleSymbol" fontWeight={"normal"}>
                  Oracle symbol
                </FormLabel>
                <Input
                  {...field}
                  id="tag"
                  placeholder=" "
                  autoComplete="off"
                  boxShadow={"sm"}
                />
                <FormErrorMessage>{form.errors.keyword}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="resolutionValue">
            {({ field, form }) => (
              <FormControl>
                <FormLabel htmlFor="resolutionValue" fontWeight={"normal"}>
                  Resolution target value
                </FormLabel>
                <Input
                  {...field}
                  id="tag"
                  placeholder=" "
                  autoComplete="off"
                  boxShadow={"sm"}
                />
                <FormErrorMessage>{form.errors.keyword}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </Stack>
      </Collapse>
    </Stack>
  );
};

export const SubmittedForm = ({ publicKey, success, isSubmitting, status }) => {
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
        transition={"background 0.8s ease-in-out"}
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

export const FormStepper = ({ success, marketPk, children, ...props }) => {
  const { isSubmitting, handleSubmit, errors, values, setSubmitting } = props;
  console.log("values", values);
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

      <ModalFooter display={"flex"} mt={8} p={0}>
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
          <>
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
              mr={0}
              _hover={{
                transform: "translateX(3px) scale(1.01)",
              }}
              icon={<ChevronRightIcon />}
              href={`/market/${marketPk}`}
              as={Link}
            />
            {isSubmitting && (
              <Button
                mt={-3}
                mx={"auto"}
                onClick={() => {
                  setCurrentStep(1);
                  setSubmitting(false);
                }}
              >
                Cancel
              </Button>
            )}
          </>
        )}
      </ModalFooter>
    </Form>
  );
};

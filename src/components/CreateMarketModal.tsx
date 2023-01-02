import React, { useState } from 'react'
import {
  Stack,
  Progress,
  Box,
  ButtonGroup, Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Select,
  SimpleGrid,
  Input, InputLeftAddon, InputGroup,
  Textarea,
  FormHelperText,
  useToast,
  useColorModeValue,
  HStack,
  Image,
  Text,
  keyframes,
  useRadio,
} from '@chakra-ui/react'
import { Select as ReactSelect, chakraComponents, ChakraStylesConfig } from 'chakra-react-select'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import useMeasure from 'react-use-measure'
import { Datepicker, Button as MButton, Page, setOptions } from '@mobiscroll/react'

import '@mobiscroll/react/dist/css/mobiscroll.min.css'

const collapse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

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
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 0,
    transition: "all 0.3s ease",
  }),
  placeholder: () => ({
    visibility: "hidden"
  })
};

const CustomSelect = {
  Option: ({ children, ...props }) => (
    // @ts-ignore
    <chakraComponents.Option {...props}>
      <Box
        borderWidth="1px"
        py={1}
        px={{ 'base': 1, 'md': 3 }}
        borderRadius="3xl"
        cursor="pointer"
        transition="all 0.2s ease"
        bg={useColorModeValue('gray.100', 'gray.700')}
        _hover={{
          // eslint-disable-next-line react-hooks/rules-of-hooks
          borderColor: useColorModeValue('black', 'white'),
          bg: 'transparent'
        }}
        _focus={{ shadow: 'outline', boxShadow: 'none' }}
      >
        <HStack spacing={1}>
          <Image src={props.data.iconUrl} alt={props.data.title} width={{ 'base':'9px', 'md':'14px' }} filter={useColorModeValue('invert(0%)', 'invert(100%)')} />
          <Box>
            <Text fontSize={{'base':'10px', 'md': 'sm'}} fontWeight="bold">{props.data.title}</Text>
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
          px={{ 'base': 1, 'md': 2 }}
          borderRadius="3xl"
          cursor="pointer"
          transition="all 0.2s"
          bg={useColorModeValue('black', 'white')}
          color={useColorModeValue('white', 'black')}
        >
          <HStack spacing={2}>
            <Image src={props.data.iconUrl} alt={props.data.title} width={{ 'base':'11px', 'md':'9px' }} filter={useColorModeValue('invert(100%)', 'invert(0%)')} />
            <Box>
              <Text fontSize={{'base':'10px', 'md': '2xs'}} fontWeight="bold">{props.data.title}</Text>
            </Box>
          </HStack>
        </Box>
      </chakraComponents.SingleValue>
    )
  },

  MenuList: ({ children, ...props }) => {
    return (
      // @ts-ignore
      <chakraComponents.MenuList {...props}>
        <HStack pt={1} bg={'transparent'} border={0} mb={'30px'} position="relative">
            {children}
        </HStack>
      </chakraComponents.MenuList>
    )
  },

  Menu: ({ children, ...props }) => {
    return (
      // @ts-ignore
      <chakraComponents.Menu {...props}>
        {children}
      </chakraComponents.Menu>
    )
  },

}

const Form1 = () => {
  const [date, setDate] = useState<Date>()
  const categoryOptions = [
    {
      label: "Financials",
      title: "Financials",
      value: "Financials",
      iconUrl: "./Financials.svg"
    },
    {
      label: "Economics",
      title: "Economics",
      value: "Economics",
      iconUrl: "./Economics.svg"
    },
    {
      label: "Crypto",
      title: "Crypto",
      value: "Crypto",
      iconUrl: "./Crypto.svg"
    },
    {
      label: "Climate",
      title: "Climate",
      value: "Crypto",
      iconUrl: "./Climate.svg"
    },

  ]

  const Custom = () => {
    return <ReactSelect
    useBasicStyles
    variant="flushed"
    instanceId="chakra-react-select-1"
    name="category"
    options={categoryOptions}
    components={CustomSelect}
    chakraStyles={chakraStyles}
  />
  }
  return (
    <ResizablePanel>
    <Stack spacing={4}>
        <FormControl variant={"floating"}>
          <Input variant={"flushed"} id="title" placeholder=" " />
          <FormLabel htmlFor="title" fontWeight={'normal'}>
            Title
          </FormLabel>
          <FormHelperText textAlign={"end"}>Keep it short and sweet!</FormHelperText>
        </FormControl>
        <FormControl variant={"floating"} cursor={"text"}>
          <Input as={Custom} id="category" placeholder=" " />
          <FormLabel htmlFor="category" fontWeight={'normal'}>
              Category
          </FormLabel>
        </FormControl>

        <FormControl id="lockTimestamp">
          <FormLabel htmlFor="title" fontWeight={'normal'} mt={"5%"}>
            Market closes in
          </FormLabel>
          <Flex justifyContent={"flex-end"}>
            <Input type={"date"} mr={"5%"} />
            <Input type={"time"} />
          </Flex>
        </FormControl>
      </Stack>
    </ResizablePanel>
  )
}

const Form2 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        User Details
      </Heading>
      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}>
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md">
          <option>United States</option>
          <option>Canada</option>
          <option>Mexico</option>
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="street_address"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%">
          Street address
        </FormLabel>
        <Input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="city"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%">
          City
        </FormLabel>
        <Input
          type="text"
          name="city"
          id="city"
          autoComplete="city"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="state"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%">
          State / Province
        </FormLabel>
        <Input
          type="text"
          name="state"
          id="state"
          autoComplete="state"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="postal_code"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{
            color: 'gray.50',
          }}
          mt="2%">
          ZIP / Postal
        </FormLabel>
        <Input
          type="text"
          name="postal_code"
          id="postal_code"
          autoComplete="postal-code"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
      </FormControl>
    </>
  );
};

const Form3 = () => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal">
        Social Handles
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl as={GridItem} colSpan={[3, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}>
            Website
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: 'gray.800',
              }}
              color="gray.500"
              rounded="md">
              http://
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.example.com"
              focusBorderColor="brand.400"
              rounded="md"
            />
          </InputGroup>
        </FormControl>

        <FormControl id="email" mt={1}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}>
            About
          </FormLabel>
          <Textarea
            placeholder="you@example.com"
            rows={3}
            shadow="sm"
            focusBorderColor="brand.400"
            fontSize={{
              sm: 'sm',
            }}
          />
          <FormHelperText>
            Brief description for your profile. URLs are hyperlinked.
          </FormHelperText>
        </FormControl>
      </SimpleGrid>
    </>
  );
};

export default function CreateMarketModal() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);

  let duration = 0.5;

  return (
    <MotionConfig transition={{ duration, type: "tween" }}>
      <Box
        m="10px auto"
        as="form">
        <Progress
          value={progress}
          size={'xs'}
          mb="5%"
        />
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
          <Flex justifyContent={'flex-end'} w="100%">
            <ButtonGroup mt="5%">
              <Flex>
                {(step === 2 || step === 3) && <Button
                  p={5}
                  onClick={() => {
                    setStep(step - 1);
                    setProgress(progress - 33.33);
                  }}
                  colorScheme="gray"
                  variant="solid"
                  mr="8%">
                  Back
                </Button>}
                { <Button
                  p={5}
                  isDisabled={step === 3}
                  onClick={() => {
                    setStep(step + 1);
                    if (step === 3) {
                      setProgress(100);
                    } else {
                      setProgress(progress + 33.33);
                    }
                  }}
                  colorScheme="gray"
                  variant="outline">
                  Next
                </Button>}
              </Flex>
              {step === 3 ? (
                <Button
                  w="7rem"
                  colorScheme="red"
                  variant="solid"
                  onClick={() => {
                    toast({
                      title: 'Account created.',
                      description: "We've created your account for you.",
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }}>
                  Submit
                </Button>
              ) : null}
            </ButtonGroup>
          </Flex>
      </Box>
    </MotionConfig>
  );
}

const ResizablePanel = ({ children }) => {
  let [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={{ height: height || "auto" }}
      className="relative overflow-hidden"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={JSON.stringify(children, ignoreCircularReferences())}
          initial={{
            x: 384,
          }}
          animate={{
            x: 0,
            // transition: { duration: duration / 2, delay: duration / 2 },
          }}
          exit={{
            x: -384,
            // transition: { duration: duration / 2 },
          }}
          className={height ? "absolute" : "relative"}
        >
          <Box ref={ref} className="px-8 pb-8">
            {children}
          </Box>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/*
  Replacer function to JSON.stringify that ignores
  circular references and internal React properties.
  https://github.com/facebook/react/issues/8669#issuecomment-531515508
*/
const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (key.startsWith("_")) return; // Don't compare React's internal props.
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};

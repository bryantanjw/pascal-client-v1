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
} from '@chakra-ui/react'
import { Calendar } from 'primereact/calendar'
import { Select as ReactSelect, chakraComponents } from "chakra-react-select"

import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'

const CustomSelectOption = {
  Option: ({ children, ...props }) => (
    // @ts-ignore
    <chakraComponents.Option {...props}>
      <Box
        borderWidth="1px"
        py={1}
        px={{ 'base': 1, 'md': 3 }}
        borderRadius="3xl"
        cursor="pointer"
        transition="all 0.2s"
        bg={useColorModeValue('gray.100', 'gray.700')}
      >
        <HStack spacing={1}>
          <Image src={props.data.iconUrl} alt={props.data.title} width={{ 'base':'11px', 'md':'15px' }} />
          <Box>
            <Text fontSize={{'base':'10px', 'md': 'sm'}} fontWeight="bold">{props.data.title}</Text>
          </Box>
        </HStack>
      </Box>
    </chakraComponents.Option>
  ),
  SingleValue: ({ children, ...props }) => (
    // @ts-ignore
    <chakraComponents.SingleValue {...props}>
      <Box
        borderWidth="1px"
        py={1}
        px={{ 'base': 1, 'md': 3 }}
        borderRadius="3xl"
        cursor="pointer"
        transition="all 0.2s"
        bg={useColorModeValue('gray.100', 'gray.700')}
      >
        <HStack spacing={1}>
          <Image src={props.data.iconUrl} alt={props.data.title} width={{ 'base':'11px', 'md':'15px' }} />
          <Box>
            <Text fontSize={{'base':'10px', 'md': 'sm'}} fontWeight="bold">{props.data.title}</Text>
          </Box>
        </HStack>
      </Box>
    </chakraComponents.SingleValue>
  )
}

const Form1 = () => {
  const [date, setDate] = useState<any>()
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
  return (
    <Stack spacing={4}>
      <Flex>
        <FormControl variant={"floating"}>
          <Input variant={"flushed"} id="title" placeholder=" " />
          <FormLabel htmlFor="title" fontWeight={'normal'}>
            Title
          </FormLabel>
          <FormHelperText textAlign={"end"}>Keep it very short and sweet!</FormHelperText>
        </FormControl>
      </Flex>

      <FormControl variant={"floating"} id="category" cursor={"text"}>
        <FormLabel htmlFor="title" fontWeight={'normal'}>
            Category
          </FormLabel>
        <ReactSelect
          useBasicStyles
          variant="flushed"
          instanceId="chakra-react-select-1"
          name="category"
          placeholder={""}
          options={categoryOptions}
          components={CustomSelectOption}
        />
      </FormControl>

      <FormControl id="lockTimestamp">
        <FormLabel htmlFor="title" fontWeight={'normal'} mt={"5%"}>
          When should your market lock for resolution?
        </FormLabel>
        <Calendar id="time24" value={date} onChange={(e) => setDate(e.value)} inline showTime showSeconds
          style={{
            border: '0px !important',
            width: '100%'
          }}
        />
      </FormControl>
    </Stack>
  );
};

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
  return (
    <>
      <Box
        m="10px auto"
        as="form">
        <Progress
          value={progress}
          size={'xs'}
          mb="5%"
          isAnimated></Progress>
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
          <Flex justifyContent={'flex-end'} w="100%">
            <ButtonGroup mt="5%">
              <Flex>
                <Button
                  p={5}
                  onClick={() => {
                    setStep(step - 1);
                    setProgress(progress - 33.33);
                  }}
                  isDisabled={step === 1}
                  colorScheme="gray"
                  variant="solid"
                  mr="8%">
                  Back
                </Button>
                <Button
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
                </Button>
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
    </>
  );
}

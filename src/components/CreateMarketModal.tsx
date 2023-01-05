import React, { useState } from 'react'
import {
  Stack,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Heading,
  useColorModeValue as mode,
  HStack,
  Image,
  Text,
  keyframes,
  FormErrorMessage,
  ModalOverlay, ModalBody, ModalHeader, ModalContent, ModalCloseButton,
  Select,
  Textarea,
  Divider,
  Link,
  IconButton,
} from '@chakra-ui/react'
import { ChevronRightIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Select as ReactSelect, chakraComponents, ChakraStylesConfig } from 'chakra-react-select'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import useMeasure from 'react-use-measure'
import { Field, Form, Formik } from 'formik'
import * as yup from "yup"

import styles from '@/styles/Home.module.css'

const categories = ['Financials', 'Economics', 'Crypto', 'Climate', 'Other']

const Form1 = () => {
  return (
    <>
    <Field name="title">
      {({ field, form }) => (
      <FormControl isInvalid={form.errors.title && form.touched.title}>
        <FormLabel htmlFor="title" fontWeight={'normal'}>
          Title
        </FormLabel>
        <Input {...field} id="title" placeholder=" " />
        <FormErrorMessage>{form.errors.title}</FormErrorMessage>
        <FormHelperText textAlign={"end"}>Keep it short and sweet!</FormHelperText>
      </FormControl>
      )}
    </Field>
    
    <Field name="category">
      {({ field, form }) => (
      <FormControl cursor={"text"} isInvalid={form.errors.category && form.touched.category}>
        <FormLabel htmlFor="category" fontWeight={'normal'}>
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
      <FormControl id="lockTimestamp" isInvalid={form.errors.lockTimestamp && form.touched.lockTimestamp}>
        <FormLabel htmlFor="title" fontWeight={'normal'} mt={"5%"}>
          Resolution date
        </FormLabel>
        <Input {...field} type={"datetime-local"}/>
        <FormErrorMessage>{form.errors.lockTimestamp}</FormErrorMessage>
      </FormControl>
      )}
    </Field>
    </>
  )
}

const Form2 = ({ title }) => {
  return (
    <Stack spacing={8}>
      <Heading fontWeight={"medium"} size={'md'}>{title}</Heading>
      <Field name="description">
        {({ field, form }) => (
        <FormControl isInvalid={form.errors.description && form.touched.description}>
          <FormLabel htmlFor="description" fontWeight={'normal'}>
            Description
          </FormLabel>
          <Textarea {...field} id="description" placeholder="This market resolves to YES if..." />
          <FormErrorMessage>{form.errors.description}</FormErrorMessage>
          <FormHelperText textAlign={"end"}>Be clear and objective!</FormHelperText>
        </FormControl>
        )}
      </Field>
    </Stack>
  )
}

const SuccessForm = ({ ...props }) => {
  return (
    <Box color={"gray.50"}>
      <Heading size={"2xl"} fontWeight={"medium"}>Your market<br /> has been created! </Heading>
      <Divider my={12} borderColor={"gray.700"} />
      <Flex justifyContent={"flex-start"} textAlign={"center"}>
        <Text mr={3} fontWeight={"normal"} fontSize={"lg"}>View the market account on the blockchain</Text> 
        <Link href='https://solscan.io/?cluster=devnet' 
          _hover={{ 
            transform: "translateX(2px) scale(1.01)",
            }} 
          isExternal
          fontSize={"lg"}
        >
          <ExternalLinkIcon />
        </Link>
      </Flex>
    </Box>
  )
}

export const CreateMarketModal = () => {
  const [success, setSuccess] = useState(false)
  let duration = 0.5;

  const createMarket = async (values) => {
    try {
      const response = await fetch("../api/createMarket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
        console.log(error);
        alert("Error creating market")
    }
  }

  const validationSchema = yup.object().shape({
    title: yup.string().required("Market title is required"),
    category: yup.string().required("Market category is required"),
    lockTimestamp: yup.date().min(new Date(), 'Resolution date must be in the future').required(),
    description: yup.string().required("Resolution criteria is required")
  })
  
  return (
    <MotionConfig transition={{ duration, type: "tween" }}>
      <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
        <Formik
          initialValues={{ title: '', category: '', lockTimestamp: '', description: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            createMarket(values);
            actions.setSubmitting(false);
            setSuccess(true);
          }}
        >
          {(props) => (
            <ModalContent
              maxW={"500px"}
              p={'12px 15px'} 
              rounded={'2xl'} 
              boxShadow={"2xl"}
              transition={`background-color 1s ease-in-out`}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={success ? mode("rgb(64,40,249, 0.95)", "rgb(64,40,220, 0.95)") : mode("gray.50", "gray.800")}
            >
            <ModalHeader mt={6}>
              <Heading size="lg" fontWeight="semibold">
                {success ? null : "Create a market"}
              </Heading>
            </ModalHeader>
            <ModalCloseButton color={success ? "gray.50" : "gray.700"} m={"10px auto"} rounded={'xl'} size={"lg"} />
            
            <ModalBody>
              <Box m="10px auto">
                <ResizablePanel>
                  <FormStepper {...props}>
                    <Form1 />
                    <Form2 title={props.values.title} />
                    <SuccessForm />
                  </FormStepper>
                </ResizablePanel>
              </Box>
            </ModalBody>
          </ModalContent>
        )}
      </Formik>
    </MotionConfig>
  )
}

const FormStepper = ({ children, ...props }) => {
  const { isSubmitting, handleSubmit, errors, values } = props
  const stepsArray = React.Children.toArray(children)
  const [currentStep, setCurrentStep] = useState(0)
  const currentChild = stepsArray[currentStep]
  console.log(values)

  const buttonStyle = {
    textColor: mode('gray.700', 'gray.100'),
    borderColor: mode('gray.700', 'gray.100'),
    transition: 'all 0.3s ease',
    _hover: {
      bg: mode('gray.100', 'whiteAlpha.100'),
    }
  }

  return (
    <Form>
      <Stack spacing={4}>
        {currentChild}
      </Stack>

      <Flex justifyContent={"flex-end"} mt={14} py={2}>

        {currentStep !==2 && <Button
          disabled={!values.title || !values.category || !values.lockTimestamp}
          variant={"outline"}
          onClick={() => {
            currentStep === 0 ? setCurrentStep(1) : setCurrentStep(0);
          }}
          sx={buttonStyle}
        >
          {(currentStep === 0) ? "Next" : "Back"}
        </Button>}

        {currentStep === 1 && (
          <Button 
            ml={4} 
            type="submit" 
            isDisabled={isSubmitting || !values.description} 
            isLoading={isSubmitting}
            onClick={() => {
              handleSubmit();
              !isSubmitting && setCurrentStep(2);
            }}
            boxShadow={'xl'}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            className={mode(styles.wallet_adapter_button_trigger_light_mode, styles.wallet_adapter_button_trigger_dark_mode)}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            textColor={mode('white', '#353535')} bg={mode('#353535', 'gray.50')} 
          >
            Submit
          </Button>
        )}
        
        {currentStep === 2 && (
          <HStack spacing={4}>
            <IconButton
              aria-label='View market' 
              rounded={"xl"} 
              variant={"ghost"} 
              fontSize={'4xl'}
              size={'lg'}
              color={'gray.50'}
              bg={"gray.700"}
              boxShadow={'xl'}
              mt={8}
              _hover={{
                transform: 'translateX(3px) scale(1.01)',
              }}
              icon={<ChevronRightIcon />}
              as={Link}
            />
          </HStack>
        )}
      </Flex>
    </Form>
  )
}

// START: Custom styling ReactSelect //
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

const CustomReactSelect = {
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
        bg={mode('gray.100', 'gray.700')}
        _hover={{
          // eslint-disable-next-line react-hooks/rules-of-hooks
          borderColor: mode('black', 'white'),
          bg: 'transparent'
        }}
        _focus={{ shadow: 'outline', boxShadow: 'none' }}
      >
        <HStack spacing={1}>
          <Image src={props.data.iconUrl} alt={props.data.title} width={{ 'base':'9px', 'md':'14px' }} filter={mode('invert(0%)', 'invert(100%)')} />
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
          bg={mode('black', 'white')}
          color={mode('white', 'black')}
        >
          <HStack spacing={2}>
            <Image src={props.data.iconUrl} alt={props.data.title} width={{ 'base':'11px', 'md':'9px' }} filter={mode('invert(100%)', 'invert(0%)')} />
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

// CustomSelect design to be revisited; field values are not propagating to formik
const CustomSelect = () => {
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
    iconUrl: `./${category}.svg`,
    title: category
  }))
  return ( 
    <ReactSelect
      useBasicStyles
      name="category"
      options={categoryOptions}
      components={CustomReactSelect}
      chakraStyles={chakraStyles}
    />
  )
}
// END: Custom styling ReactSelect //


const ResizablePanel = ({ children }) => {
  let [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={{ height: height || "auto" }}
      className="relative overflow-hidden">
      <AnimatePresence initial={false}>
          <Box ref={ref} className="px-8 pb-8">
            {children}
          </Box>
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
}

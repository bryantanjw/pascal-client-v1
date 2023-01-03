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
  useColorModeValue,
  HStack,
  Image,
  Text,
  keyframes,
  FormErrorMessage,
} from '@chakra-ui/react'
import { Select as ReactSelect, chakraComponents, ChakraStylesConfig } from 'chakra-react-select'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import useMeasure from 'react-use-measure'
import { Field, Form, Formik } from 'formik'
import * as yup from "yup"

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

const Select = () => {
  const categories = ['Financials', 'Economics', 'Crypto', 'Climate', 'Other']
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
    iconUrl: `./${category}.svg`,
    title: category
  }))

  return ( 
    <ReactSelect
      useBasicStyles
      instanceId="chakra-react-select-1"
      name="category"
      options={categoryOptions}
      components={CustomReactSelect}
      chakraStyles={chakraStyles}
    />
  )
}

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
        <Select {...field} />
        <FormErrorMessage>{form.errors.category}</FormErrorMessage>
      </FormControl>
      )}
    </Field>

    <Field name="lockTimestamp">
      {({ field, form }) => (
      <FormControl id="lockTimestamp" isInvalid={form.errors.lockTimestamp && form.touched.lockTimestamp}>
        <FormLabel htmlFor="title" fontWeight={'normal'} mt={"5%"}>
          Market closes in
        </FormLabel>
        <Flex justifyContent={"flex-end"}>
          <Input {...field} type={"date"} mr={"5%"} />
          <Input {...field} type={"time"} />
        </Flex>
        <FormErrorMessage>{form.errors.lockTimestamp}</FormErrorMessage>
      </FormControl>
      )}
    </Field>
    </>
  )
}

const Form2 = ({ title }) => {
  return (
    <>
    <Heading size={'md'}>{title}</Heading>
    <Field name="resolutionCriteria">
      {({ field, form }) => (
      <FormControl isInvalid={form.errors.resolutionCriteria && form.touched.resolutionCriteria}>
        <FormLabel htmlFor="resolutionCriteria" fontWeight={'normal'}>
          Resolution Criteria
        </FormLabel>
        <Input {...field} id="resolutionCriteria" placeholder="This market resolves if..." />
        <FormErrorMessage>{form.errors.resolutionCriteria}</FormErrorMessage>
        <FormHelperText textAlign={"end"}>Be clear and objective!</FormHelperText>
      </FormControl>
      )}
    </Field>

    </>
  )
}

export const CreateMarketModal = () => {
  let duration = 0.5;

  const ValidationSchema = yup.object().shape({
    title: yup.string().required("Market title is required"),
    category: yup.string().required("Market category is required"),
    lockTimestamp: yup.date().min(new Date(), 'Resolution date must be in the future').required(),
    resolutionCriteria: yup.string().required("Resolution criteria is required")
  })
  
  return (
    <MotionConfig transition={{ duration, type: "tween" }}>
      <Box
        m="10px auto"
      >
        <Formik
          initialValues={{ title: '', category: '', lockTimestamp: '', resolutionCriteria: '' }}
          validationSchema={ValidationSchema}
          onSubmit={async (values, actions) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {(props) => (
            <FormStepper {...props}>
              <Form1 />
              <Form2 title={props.values.title} />
            </FormStepper>
          )}
        </Formik>
      </Box>
    </MotionConfig>
  );
}

const FormStepper = ({ children, ...props }) => {
  const { isSubmitting, errors, values } = props
  const stepsArray = React.Children.toArray(children)
  const [currentStep, setCurrentStep] = useState(0)
  const currentChild = stepsArray[currentStep]
  console.log(values)

  return (
    <Form>
      <Stack spacing={4}>
        {currentChild}
      </Stack>

      <Flex justifyContent={"flex-end"} mt={5} py={2}>
        <Button
          variant={"outline"}
          onClick={() => {
            currentStep === 0 ? setCurrentStep(1) : setCurrentStep(0);
          }}
        >
          {currentStep === 0 ? "Next" : "Back"}
        </Button>
        {currentStep === 1 && (
          <Button ml={4} type="submit" isDisabled={isSubmitting || errors || !values}>
            Submit
          </Button>
        )}
      </Flex>
    </Form>
  )
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
}

import { useState } from 'react'
import {
  Button, ButtonGroup,
  Flex, Box,
  Heading,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Stack,
  Text,
  useColorModeValue,
  CircularProgress,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import Confetti from 'react-dom-confetti'
import { Step, Steps, useSteps } from "chakra-ui-steps"
import * as React from 'react'


type TradeFormItemProps = {
  label: string
  value?: string
  children?: React.ReactNode
}

const TradeFormItem = (props: TradeFormItemProps) => {
  const { label, value, children } = props
  
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  )
}


export const TradeForm = ({ p }) => {
  const steps = [{ label: "" }, { label: "" }]
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })
  const [numberInput, setNumberInput] = useState<any>(1)
  const [isLoading, setIsLoading] = useState<Boolean | undefined>(false)
 
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
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  }
  
  const placeOrder = async () => {
    setIsLoading(true);
    nextStep();
    setTimeout(() => setIsLoading(false), 500);
  }
  
  return (
    <>
    {/* TODO: refine progress bar design */}
    <Stack overflow={'visible'} spacing="8" borderWidth="1px" rounded="lg" padding="6" width={{'base': 's', 'md': 'xs'}}>
      <Steps width={'45%'} orientation='horizontal' colorScheme={'gray'} activeStep={activeStep}>
        {steps.map(({ label }, index) => (
          <Step label={label} key={index} />            
        ))}
      </Steps>
      {
        // TODO: set dynamic value of underlying
        activeStep === 0 && (
          <Stack spacing={8}>
            <Heading size={'md'}>Will {p.props.ticker} close above #value on {new Date(p.props.closing_date).toISOString().split('T')[0]}</Heading>
            
            <ButtonGroup onClick={nextStep} justifyContent={'center'} size="lg" spacing='3'>
              <Button p={7} width={'full'} colorScheme='pink'>Yes, it will</Button>
              <Button p={7} width={'full'} colorScheme='teal'>No, it won&apos;t</Button>
            </ButtonGroup>
          </Stack>
        )
        
        || activeStep === 1 && (
          <Stack spacing={8}>
            <Heading size="md">Order Summary</Heading>

            <Stack spacing="4">
              <TradeFormItem label="Price per contract" value={`${p.props.probability[0].yes}`} />
              <TradeFormItem label="No. of contracts">
                <NumberInput onChange={(e) => setNumberInput(e)} size={'sm'} width={'35%'} defaultValue={numberInput} min={1} max={100}>
                  <NumberInputField fontSize={'sm'} textAlign={'end'} />
                  <NumberInputStepper><NumberIncrementStepper/><NumberDecrementStepper /></NumberInputStepper>
                </NumberInput>
              </TradeFormItem>
              <TradeFormItem label="Fees">
                1%
              </TradeFormItem>
              <Flex justify="space-between">
                <Text fontSize="lg" fontWeight="semibold">
                  Total
                </Text>
                <Text fontSize="xl" fontWeight="extrabold">
                  {numberInput * p.props.probability[0].yes} SOL
                </Text>
              </Flex>
            </Stack>

            <ButtonGroup colorScheme={'purple'} justifyContent={'center'} size="lg" fontSize="md" spacing='3'>
              <Button variant={'outline'} onClick={prevStep}><ArrowBackIcon /></Button>
              <Button onClick={placeOrder} width={'80%'}>
              {isLoading ? (
                  <CircularProgress isIndeterminate size="24px" color="purple.500" />
                  ) : (
                      'Place order'
              )}</Button>
            </ButtonGroup>
          </Stack>
        )
      }
      
      {activeStep === steps.length && (
      <Stack spacing={8}>
        <Heading size={'md'}>
          Woohoo! Your order has been placed!
        </Heading>
        <ButtonGroup justifyContent={'center'} colorScheme={'purple'} size="lg" fontSize="md" spacing='3'>
          <Button onClick={reset} width={'full'}>Done</Button>
        </ButtonGroup>
      </Stack>
      )}
    </Stack>
    <Confetti active={!isLoading} config={confettiConfig} />
    </>
  )
}
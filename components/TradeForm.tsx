import { useState } from 'react'
import {
  Button, ButtonGroup,
  Flex,
  Heading,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
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
      <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
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
  const [numberInput, setNumberInput] = useState(1)
 
  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width={'xs'}>
      <Steps colorScheme={'blue'} activeStep={activeStep}>
        {steps.map(({ label }, index) => (
          <Step width={'50%'} label={label} key={index}>
            {activeStep === steps.length - 1 ? (
              <Stack spacing={8}>
                <Heading size="md">Order Summary</Heading>
    
                <Stack spacing="4">
                  {/* TODO: 
                    1. Input for no. of contracts
                    2. Calculation of order price
                  */}
                  <TradeFormItem label="Price per contract" value={`${p.props.probability[0].yes}`} />
                  <TradeFormItem label="No. of contracts">
                    <NumberInput onChange={setNumberInput} size={'sm'} width={'35%'} defaultValue={1} min={1} max={100}>
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
                      {numberInput * p.props.probability[0].yes}
                    </Text>
                  </Flex>
                </Stack>

                <ButtonGroup colorScheme={'blue'} justifyContent={'center'} size="lg" fontSize="md" spacing='3'>
                  <Button variant={'outline'} onClick={prevStep}><ArrowBackIcon /></Button>
                  <Button onClick={nextStep} width={'80%'}>Place order</Button>
                </ButtonGroup>
              </Stack>
              ) : (
              <Stack spacing={8}>
                <Heading size={'md'}>Will {p.props.ticker} close above #value on {new Date(p.props.closing_date).toISOString().split('T')[0]}</Heading>
                
                <ButtonGroup onClick={nextStep} justifyContent={'center'} size="lg" fontSize="md" spacing='3'>
                  <Button colorScheme='pink'>Yes, it will</Button>
                  <Button colorScheme='teal'>No, it won&apos;t</Button>
                </ButtonGroup>
              </Stack>
            )}
          </Step>
        ))}
      </Steps>
    </Stack>
  )
}
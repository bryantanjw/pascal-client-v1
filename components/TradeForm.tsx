import {
  Button, ButtonGroup,
  Flex,
  Heading,
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
 
  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Steps colorScheme={'black'} activeStep={activeStep + 1}>
        {steps.map(({ label }, index) => (
          <Step width={'50%'} label={label} key={index}>
            {activeStep === -1 ? (
              <Stack spacing={8}>
                <Heading size="md">Trade Summary</Heading>
    
                <Stack spacing="6">
                  <TradeFormItem label="Subtotal" value={'2.4 SOL'} />
                  <TradeFormItem label="Fees">
                    1%
                  </TradeFormItem>
                  <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                      Total
                    </Text>
                    <Text fontSize="xl" fontWeight="extrabold">
                      2.4 SOL
                    </Text>
                  </Flex>
                </Stack>

                <ButtonGroup justifyContent={'center'} size="lg" fontSize="md" spacing='3'>
                  <Button variant={'outline'}><ArrowBackIcon /></Button>
                  <Button>Trade</Button>
                </ButtonGroup>
              </Stack>
              ) : (
              <Stack spacing={8}>
                <Heading size={'lg'}>Will {p.props.ticker} close above #price on {new Date(p.props.closing_date).toISOString().split('T')[0]}</Heading>
                
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
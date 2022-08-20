import { Step, Steps, useSteps } from "chakra-ui-steps"
import { Flex, Heading, Button, Text } from "@chakra-ui/react"

const steps = [
  { label: "Market opened", description: "" },
  { label: "Finalizing", description: "Pyth" },
  { label: "Closed", description: "" },
]

export const MarketProgress = () => {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })
  return (
    <Flex minWidth={'lg'} py={4}>
      <Steps orientation="horizontal" colorScheme="black" activeStep={activeStep+1}>
        {steps.map(({ label, description }) => (
          <Step label={label} key={label} description={description} />
        ))}
      </Steps>
    </Flex>
  )
}

export default MarketProgress


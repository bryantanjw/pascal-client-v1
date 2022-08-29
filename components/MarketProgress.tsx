import { Step, Steps, useSteps } from "chakra-ui-steps"
import { Flex, Heading, Button, Text } from "@chakra-ui/react"


export const MarketProgress = ({ market }) => {
  const steps = [
    { label: "Market opened", description: market.props.closing_date },
    { label: "Finalizing", description: "" },
    { label: "Closed", description: "" },
  ]

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  return (
    <Flex minWidth={'lg'} py={4}>
      <Steps orientation="horizontal" colorScheme="gray" activeStep={activeStep+1}>
        {steps.map(({ label, description }) => (
          <Step label={label} key={label} description={description} />
        ))}
      </Steps>
    </Flex>
  )
}

export default MarketProgress


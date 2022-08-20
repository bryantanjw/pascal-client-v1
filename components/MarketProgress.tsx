import { Step, Steps, useSteps } from "chakra-ui-steps"
import { Flex, Heading, Button, Text } from "@chakra-ui/react"

const steps = [
  { label: "Market opened", description: "" },
  { label: "Finalizing", description: "" },
  { label: "Closed", description: "Pyth" },
]

export const MarketProgress = () => {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })
  return (
    <Flex py={4} flexDir="column" width="100%">
      <Steps orientation="vertical" colorScheme="blue" activeStep={activeStep}>
        {steps.map(({ label, description }) => (
          <Step label={label} key={label} description={description}>
          </Step>
        ))}
      </Steps>
      {activeStep === steps.length ? (
        <Flex px={4} py={4} width="100%" flexDirection="column">
          <Heading fontSize="xl" textAlign="center">
            Woohoo! All steps completed!
          </Heading>
          <Button mx="auto" mt={6} size="sm" onClick={reset}>
            Reset
          </Button>
        </Flex>
      ) : (
        <Flex width="100%" justify="flex-end">
          <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <Button size="sm" onClick={nextStep}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default MarketProgress


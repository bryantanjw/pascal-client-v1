import { Step, Steps, useSteps } from "chakra-ui-steps"
import { Flex, Heading, Button, Text } from "@chakra-ui/react"
import { useState } from "react";

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

export const MarketProgress = ({ market }) => {
  const dt = new Date(market.props.closing_date)
  const market_opened_time = dt.toUTCString()

  const recurrence = market.props.recurrence
  const renderFinalizingTime = () => {
    if (recurrence == "Daily") {
        return addDays(dt, 1).toUTCString()
    } else if (recurrence == "Weekly") {
      return addDays(dt, 7).toUTCString()
    } else if (recurrence == "Monthly") {
      return addDays(dt, 30).toUTCString()
    }
  }

  const steps = [
    { label: "Market opened", description: market_opened_time },
    { label: "Finalizing", description: renderFinalizingTime() },
    { label: "Closed", description: "" },
  ]

  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  return (
    <Flex minWidth={'lg'} py={4}>
      <Steps orientation="vertical" colorScheme="gray" activeStep={activeStep+1}>
        {steps.map(({ label, description }) => (
          <Step label={label} key={label} description={description} />
        ))}
      </Steps>
    </Flex>
  )
}

export default MarketProgress


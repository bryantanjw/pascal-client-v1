import { Step, Steps, useSteps } from "chakra-ui-steps";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

export const MarketProgress = ({ account }) => {
  const {
    marketCreateTimestamp,
    marketLockTimestamp,
    marketSettleTimestamp,
    marketStatus,
  } = account;
  const formattedLockTimestamp = new Date(
    parseInt(marketLockTimestamp, 16) * 1000
  );

  const steps = [
    {
      label: "Market opened",
      description: new Date(
        parseInt(marketCreateTimestamp, 16) * 1000
      ).toUTCString(),
    },
    {
      label: "Finalizing",
      description: formattedLockTimestamp.toUTCString(),
    },
    {
      label: "Settled",
      description: marketSettleTimestamp
        ? new Date(parseInt(marketSettleTimestamp, 16) * 1000).toUTCString()
        : "",
    },
  ];

  const { setStep, activeStep } = useSteps({
    initialStep: 1,
  });
  const dt = new Date();

  useEffect(() => {
    if (dt >= formattedLockTimestamp) {
      setStep(2);
    }
    if (marketStatus.settled) {
      setStep(3);
    }
  }, [dt.getMinutes()]);

  return (
    <Flex minWidth={"lg"} py={4}>
      <Steps orientation="vertical" colorScheme="gray" activeStep={activeStep}>
        {steps.map(({ label, description }) => (
          <Step label={label} key={label} description={description} />
        ))}
      </Steps>
    </Flex>
  );
};

export default MarketProgress;

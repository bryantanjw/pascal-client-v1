/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import {
  Button, ButtonGroup,
  Flex,
  Heading,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Stack,
  Text,
  useColorModeValue,
  CircularProgress,
  Tabs, TabList, TabPanels, Tab, TabPanel,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import Confetti from 'react-dom-confetti'
import { Step, Steps, useSteps } from "chakra-ui-steps"
import * as React from 'react'
import { TokenSwapForm } from './TokenSwap'
import styles from '../styles/Home.module.css'
import { Airdrop } from './TokenSwap/AirdropForm'
import { useWallet } from '@solana/wallet-adapter-react'

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

export const TradeForm = ({ market }) => {
  const steps = [{ label: "" }, { label: "" }]
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })
  const [numberInput, setNumberInput] = useState<any>(1)
  const [isLoading, setIsLoading] = useState<Boolean | undefined>(false)

  const { publicKey } = useWallet()
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false )
 
  // Styling config //
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
  const headerTextStyle = {
    textColor: useColorModeValue('gray.500', 'gray.300'),
    fontWeight: 'bold',
    fontSize: 'sm',
  }
  const colorSchemeYes = {
    textColor: useColorModeValue('#D53F8C', '#FBB6CE'),
    fontSize: '5xl',
    fontWeight: 'semibold'
  }
  const colorSchemeNo = {
    textColor: useColorModeValue('#2C7C7C', '#81E6D9'),
    fontSize: '5xl',
    fontWeight: 'semibold'
  }
  const tabListStyle = {
    color: 'blue.500',
    fontSize: 'sm',
    fontWeight: 'medium',
    rounded: 'lg',
    px: '3',
    transition: 'all .2s ease',
    _hover: {bg: useColorModeValue('blue.50', 'blue.900')},
    _selected: {
      bg: 'blue.500',
      boxShadow: '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)',
      fontSize: 'sm',
      color: 'white',
      fontWeight: 'semibold'
    },
  }
  // Styling config //
  
  // TODO: state management for place order (below is temporary)
  const placeOrder = async () => {
    setIsLoading(true);
    nextStep();
    setTimeout(() => setIsLoading(false), 500);
  }

  const dt = new Date(market.closing_date)
  const day = dt.getDate().toString()
  const month = dt.toLocaleString('default', { month: 'long' })
  const year = dt.getFullYear().toString()
  
  return (
    <>
    {/* TODO: refine progress bar design */}
    <Stack overflow={'visible'} spacing="8" 
      rounded="xl" padding="6" borderWidth={'1px'} 
      position={{ 'sm': 'relative', 'lg': 'fixed'}} left={{ 'sm': 'none', 'lg': '60%'}}
      width={{'base': 's', 'md': '340px'}}>
      
      <Tabs variant={'unstyled'}>
          <TabList mb={3}>
            <Tab sx={tabListStyle}>Swap</Tab>
            <Tab ml={3} sx={tabListStyle}>Pool</Tab>
            {isOwner &&
              <Tab ml={3} sx={tabListStyle}>Airdrop</Tab>
            }
          </TabList>

          <TabPanels>
            {/* Swap Tab */}
            <TabPanel px={0}>
              {/* <Steps width={'45%'} orientation={'horizontal'} colorScheme={'gray'} activeStep={activeStep}>
                {steps.map(({ label }, index) => (
                  <Step label={label} key={index} />            
                ))}
              </Steps> */}

              {
              activeStep === 0 && (
                <Stack spacing={6}>

                  <Flex direction={'column'}>
                    <Text sx={headerTextStyle}>
                      Market says
                    </Text>
                    {(market.probability[0].yes >= market.probability[0].yes)
                      ? <Heading sx={colorSchemeYes}>Yes {market.probability[0].yes * 100}%</Heading>
                      : <Heading sx={colorSchemeNo}>No {market.probability[0].no * 100}%</Heading>
                    }
                  </Flex>

                  <Stack spacing={8}>
                    <Heading width={'90%'} fontSize={'2xl'} fontWeight={'semibold'}>
                      Will {market.short} close above {market.target_value} on {month} {day}, {year}?
                    </Heading>
                    
                    <ButtonGroup onClick={nextStep} justifyContent={'center'} size="lg" spacing='3'>
                      <Button p={7} width={'full'} colorScheme='pink'>Yes, it will</Button>
                      <Button p={7} width={'full'} colorScheme='teal'>No, it won&apos;t</Button>
                    </ButtonGroup>
                  </Stack>

                </Stack>
              )
              
              || activeStep === 1 && (
                <Stack spacing={8}>
                  <Heading size="md">Trade Summary</Heading>

                  <Stack spacing="4">
                    <TradeFormItem label="Price per contract" value={`${market.probability[0].yes}`} />
                    <TradeFormItem label="No. of contracts">
                      <NumberInput onChange={(e) => setNumberInput(e)} size={'sm'} width={'35%'} defaultValue={numberInput} min={1} max={100}>
                        <NumberInputField fontSize={'sm'} textAlign={'end'} />
                        <NumberInputStepper><NumberIncrementStepper/><NumberDecrementStepper /></NumberInputStepper>
                      </NumberInput>
                    </TradeFormItem>
                    {/* <TradeFormItem label="Fees">
                      1%
                    </TradeFormItem> */}
                    <Flex justify="space-between">
                      <Text fontSize="lg" fontWeight="semibold">
                        Total
                      </Text>
                      <Text fontSize="xl" fontWeight="extrabold">
                        {numberInput * market.probability[0].yes} SOL
                      </Text>
                    </Flex>
                  </Stack>

                  <ButtonGroup justifyContent={'center'} size="lg" fontSize="md" spacing='3'>
                    <Button borderColor={useColorModeValue('#353535', 'gray.100')} variant={'outline'} onClick={prevStep}><ArrowBackIcon color={useColorModeValue('#353535', 'gray.50')} /></Button>
                    <Button type={'submit'}
                    className={
                      useColorModeValue(styles.wallet_adapter_button_trigger_light_mode, 
                        styles.wallet_adapter_button_trigger_dark_mode
                      )
                    } 
                      textColor={useColorModeValue('white', '#353535')} bg={useColorModeValue('#353535', 'gray.50')} width={'80%'} boxShadow={'xl'}
                      _hover={{
                        bg: useColorModeValue('black', 'gray.300')
                      }}
                      onClick={placeOrder}
                    >
                    {isLoading ? (
                        <CircularProgress isIndeterminate size="24px" color="white.500" />
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
          </TabPanel>


          {/* Pool Tab */}
          <TabPanel px={0}>
              <TokenSwapForm />
          </TabPanel>

          {/* Airdrop Tab for testing */}
          <TabPanel px={0}>
              <Airdrop />
          </TabPanel>

        </TabPanels>
      </Tabs>
    </Stack>
    <Confetti active={!isLoading} config={confettiConfig} />
    </>
  )
}
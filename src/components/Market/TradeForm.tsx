/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react'
import {
  Button, ButtonGroup,
  Flex,
  Heading,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Stack,
  Text,
  useColorModeValue as mode,
  Tooltip,
  Tabs, TabList, TabPanels, Tab, TabPanel, HStack, useDisclosure,
} from '@chakra-ui/react'
import { ArrowBackIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import Confetti from 'react-dom-confetti'
import { Step, Steps, useSteps } from "chakra-ui-steps"
import * as React from 'react'
import { TokenSwapForm } from '../TokenSwap'
import styles from '@/styles/Home.module.css'
import { Airdrop } from '../TokenSwap/AirdropForm'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSelector } from '@/store/store'
import { getOutcomeState, setIndex, setTitle } from '@/store/slices/outcomeSlice'
import { useDispatch } from 'react-redux'

type TradeFormItemProps = {
  label: string | React.ReactNode
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

export const TradeForm = ({ market }) => {
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
    textColor: mode('gray.500', 'gray.300'),
    fontWeight: 'bold',
    fontSize: 'sm',
  }
  const tabListStyle = {
    color: 'blue.500',
    fontSize: 'sm',
    fontWeight: 'medium',
    rounded: 'lg',
    px: '3',
    transition: 'all .2s ease',
    _hover: {bg: mode('blue.50', 'blue.900')},
    _selected: {
      bg: 'blue.500',
      boxShadow: '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)',
      fontSize: 'sm',
      color: 'white',
      fontWeight: 'semibold'
    },
  }
  const sellButtonStyle = {
    p: 7,
    width: 'full',
    fontSize: 'xl',
    textColor: mode('gray.500', 'whiteAlpha.700'),
    borderColor: mode('gray.400', 'whiteAlpha.700'),
    transition: 'all 0.3s ease',
    _hover: {
      textColor: mode('gray.800', 'white'),
      borderColor: mode('gray.800', 'white')
    }
  }
  const buyButtonStyle = {
    p: 7,
    width: 'full',
    fontSize: 'xl',
    textColor: mode('white', 353535),
    bg: mode('#353535', 'gray.50'),
  }
  const alternatingColorScheme = [mode('purple.500', 'purple.200'), mode('#2C7C7C', '#81E6D9'), 'pink']
  // Styling config //

  
  const steps = [{ label: "" }, { label: "" }]
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  const [numberInput, setNumberInput] = useState<any>(1)
  
  // TODO: Fix dispatch issues (i.e., initialState for title)
  const dispatch = useDispatch()
  const { title, index } = useSelector(getOutcomeState)

  const { publicKey } = useWallet()
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false )

  const dt = new Date(market.closing_date)
  const day = dt.getDate().toString()
  const month = dt.toLocaleString('default', { month: 'long' })
  const year = dt.getFullYear().toString()

  // Call useEffect once to display first outcome
  useEffect(() => {
    dispatch(setTitle(market.outcomes[0].title))
  }, [])
  

  return (
    <>
    {/* TODO: refine progress bar design */}
    <Stack spacing="8" 
      rounded="xl" padding="6" borderWidth={'1px'} 
      maxW={{'base': 's', 'md': 'full', 'lg': '340px'}}
      boxShadow={'md'}
      background={mode('whiteAlpha.700', 'rgba(23, 25, 35, 0.2)')}
      className={mode('', styles.glassmorphism)}
    >
      
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
          <TabPanel px={0} pb={2}>
            {/* <Steps width={'45%'} orientation={'horizontal'} colorScheme={'gray'} activeStep={activeStep}>
              {steps.map(({ label }, index) => (
                <Step label={label} key={index} />            
              ))}
            </Steps> */}

            {
              activeStep === 0 && (
                <Stack spacing={4}>

                  <Flex direction={'column'}>
                    <Text sx={headerTextStyle}>
                      Market says
                    </Text>
                    <Heading fontSize={'5xl'} fontWeight={'semibold'} color={alternatingColorScheme[index % alternatingColorScheme.length]}>
                      {title} 
                      {market.outcomes.map((outcome, index) => {
                        if (outcome.title === title) {
                          dispatch(setIndex(index))
                          return ` ${outcome.probability * 100}%`
                        }
                      })}
                    </Heading>
                  </Flex>

                  <Stack spacing={6}>
                    <Heading width={'90%'} fontSize={'2xl'} fontWeight={'semibold'} textColor={mode('gray.800', 'gray.100')}>
                      Will {market.short} close above {market.target_value} on {month} {day}, {year}?
                    </Heading>
                    
                    <Stack>
                      <Text color={mode('gray.700', 'gray.200')} fontWeight={'medium'} mb={2}>
                        Select an outcome option on the left
                      </Text>

                      <ButtonGroup 
                        justifyContent={'center'} size="lg" spacing='4'
                        onClick={nextStep}
                        isDisabled={!title}
                      >
                        <Button id="buy" className={
                          mode(styles.wallet_adapter_button_trigger_light_mode, 
                            styles.wallet_adapter_button_trigger_dark_mode
                          )}
                          sx={buyButtonStyle}
                        >
                          Buy
                        </Button>
                        
                        <Button id="sell" sx={sellButtonStyle} variant={'outline'}
                        >
                          Sell
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </Stack>

                </Stack>
              )
              
              || activeStep === 1 && (
                <Stack spacing={6}>
                  <Heading size="md">Swap Summary</Heading>

                  <Stack spacing="3">
                    <TradeFormItem label="Price per contract" value={`${market.outcomes[0].probability}`} />
                    <TradeFormItem label="No. of contracts">
                      <NumberInput onChange={(e) => setNumberInput(e)} size={'sm'} width={'35%'} defaultValue={numberInput} min={1} max={100}>
                        <NumberInputField fontSize={'sm'} textAlign={'end'} />
                        <NumberInputStepper><NumberIncrementStepper/><NumberDecrementStepper /></NumberInputStepper>
                      </NumberInput>
                    </TradeFormItem>
                    <TradeFormItem 
                      label={
                        <HStack>
                          <Text>Fees</Text>
                          <Tooltip label={"A 2% fee goes to liquidity providers"} p={3}>
                            <InfoOutlineIcon cursor={'help'} />
                          </Tooltip>
                        </HStack>
                      }
                    >
                      1%
                    </TradeFormItem>
                    <Flex justify="space-between">
                      <Text fontSize="lg" fontWeight="semibold">
                        Total
                      </Text>
                      <Text fontSize="xl" fontWeight="extrabold">
                        {numberInput * market.outcomes[0].probability} SOL
                      </Text>
                    </Flex>
                  </Stack>
                  
                  <ButtonGroup justifyContent={'center'} size="lg" fontSize="md" spacing='3'>
                    <Button onClick={prevStep} variant={'ghost'}>
                      <ArrowBackIcon />
                    </Button>

                    <Button type={'submit'} isDisabled={!publicKey}
                      className={
                        mode(styles.wallet_adapter_button_trigger_light_mode, 
                          styles.wallet_adapter_button_trigger_dark_mode
                        )
                      }
                      textColor={mode('white', '#353535')} bg={mode('#353535', 'gray.50')} 
                      boxShadow={'xl'} width={'full'}
                      onClick={nextStep}
                    >
                      Place Order
                    </Button>
                  </ButtonGroup>
                </Stack>
              )
            }
          
            {
              activeStep === steps.length && (
              <Stack spacing={8}>
                <Heading size={'md'}>
                  Woohoo! Your order has been placed!
                </Heading>
                <ButtonGroup justifyContent={'center'} colorScheme={'purple'} size="lg" fontSize="md" spacing='3'>
                  <Button onClick={reset} width={'full'}>Done</Button>
                </ButtonGroup>
              </Stack>
              )
            }
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
    {/* <Confetti active={!isLoading} config={confettiConfig} /> */}
    </>
  )
}
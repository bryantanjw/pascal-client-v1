import * as React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  Button, ButtonGroup,
  Flex,
  Heading,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Stack,
  Text,
  useColorModeValue as mode,
  Tooltip,
  Tabs, TabList, TabPanels, Tab, TabPanel, HStack,
  useToast,
  Link,
} from '@chakra-ui/react'
import { ArrowBackIcon, InfoOutlineIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import * as web3 from "@solana/web3.js"
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as token from '@solana/spl-token'
import { Field, Formik } from 'formik'
import Confetti from 'react-dom-confetti'
import { Step, Steps, useSteps } from "chakra-ui-steps"

import { getOutcomeState, setIndex, setTitle } from '@/store/slices/outcomeSlice'
import { useSelector } from '@/store/store'
import { TokenSwapForm } from '../TokenSwap'
import { Airdrop } from '../TokenSwap/AirdropForm'

import styles from '@/styles/Home.module.css'

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
  // Style config //
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
    rounded: 'xl',
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
  // Style config //

  const { closing_date, outcomes, short, target_value, token_info } = market

  // States
  const [orderSide, setOrderSide] = useState<String>('')
  const [isLoading, setLoading] = useState(false)
  const [isSuccess, setSuccess] = useState(false)
  const [isSubmitted, setSubmitted] = useState(false)
  
  const dispatch = useDispatch()
  const { title, index } = useSelector(getOutcomeState)

  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false )

  const toast = useToast()
  const steps = [{ label: "" }, { label: "" }]
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  })

  const dt = new Date(closing_date)
  const day = dt.getDate().toString()
  const month = dt.toLocaleString('default', { month: 'long' })
  const year = dt.getFullYear().toString()

  // Call useEffect once to display first outcome
  useEffect(() => {
    dispatch(setTitle(outcomes[0].title))
  }, [])

  const transferTo = async (contractAmount) => {
    try {
      setLoading(true)

      if (!connection || !publicKey) {
        return
      }

      const mintPubKey = new web3.PublicKey(token_info.mintAddress)
  
      const secret = JSON.parse(process.env.NEXT_PUBLIC_USER_PRIVATE_KEY ?? "") as number[]
      const secretKey = Uint8Array.from(secret)
      const ownerKeypair = web3.Keypair.fromSecretKey(secretKey)
      console.log("ownerTokenAccount", ownerKeypair.publicKey.toBase58())
    
      const ownerTokenAccount = await token.getOrCreateAssociatedTokenAccount(
        connection,
        ownerKeypair,
        mintPubKey,
        ownerKeypair.publicKey
      )
      console.log("ownerTokenAccount", ownerTokenAccount.address.toBase58())
  
      const recipientTokenAccount = await token.getOrCreateAssociatedTokenAccount(
        connection,
        ownerKeypair,
        mintPubKey,
        publicKey
      )
      console.log("recipientTokenAccount", recipientTokenAccount)
  
      const mintInfo = await token.getMint(connection, mintPubKey)
      const tx = new web3.Transaction()
      tx.add(token.createTransferInstruction(
        ownerTokenAccount.address,
        recipientTokenAccount.address,
        ownerKeypair.publicKey,
        contractAmount * 10 ** mintInfo.decimals
      ))
      let latestBlockHash = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = await latestBlockHash.blockhash;      
      let signature = await web3.sendAndConfirmTransaction(connection, tx, [ownerKeypair])

      console.log(
          `Transaction submitted: https://solana.fm/tx/${signature}?cluster=devnet`
      )
      toast({
          title: "Transaction submitted",
          description: 
              <Link href={`https://solana.fm/tx/${signature}?cluster=devnet`} isExternal>
                  <HStack>
                      <Text>View transaction</Text>
                      <ExternalLinkIcon />
                  </HStack>
              </Link>,
          position: "top",
          isClosable: true,
          duration: 10000,
          status: 'success',
          variant: 'subtle',
          containerStyle: { marginTop: '75px', marginBottom: '-65px'},
      })
      setSuccess(true)
    } catch (e) {
        setSuccess(false)
        toast({
          title: 'Transaction failed',
          description: JSON.stringify(e.message).replace(/^"(.*)"$/, '$1'),
          position: "top",
          isClosable: true,
          duration: 10000,
          status: 'error',
          variant: 'subtle',
          containerStyle: { marginTop: '75px', marginBottom: '-65px'},
        })
      console.log(JSON.stringify(e))
    }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
    {/* TODO: refine progress bar design */}
    <Stack spacing="8" 
      rounded="2xl" padding="6" borderWidth={'1px'} borderColor={mode('whiteAlpha.800', '')}
      w={{'base': 'full', 'lg': '340px'}}
      boxShadow={'0 4px 30px rgba(0, 0, 0, 0.1)'}
      background={mode('whiteAlpha.800', 'rgba(32, 34, 46, 0.2)')}
      backdropFilter={{ 'md': 'blur(5px)' }}
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

            {activeStep === 0 && 
              (
                <Stack spacing={4}>

                  <Flex direction={'column'}>
                    <Text sx={headerTextStyle}>
                      Market says
                    </Text>
                    <Heading fontSize={'5xl'} fontWeight={'semibold'} color={alternatingColorScheme[index % alternatingColorScheme.length]}>
                      {title} 
                      {outcomes.map((outcome, index) => {
                        if (outcome.title === title) {
                          dispatch(setIndex(index))
                          return ` ${outcome.probability * 100}%`
                        }
                      })}
                    </Heading>
                  </Flex>

                  <Stack spacing={6}>
                    <Heading width={'90%'} fontSize={'2xl'} fontWeight={'semibold'} textColor={mode('gray.800', 'gray.100')}>
                      Will {short} close above {target_value} on {month} {day}, {year}?
                    </Heading>
                    
                    <Stack>
                      <Text color={mode('gray.700', 'gray.200')} fontWeight={'medium'} mb={1}>
                        Select an outcome option on the left
                      </Text>

                      <ButtonGroup 
                        justifyContent={'center'} size="lg" spacing='4'
                        onClick={nextStep}
                        isDisabled={!title}
                      >
                        <Button id="buy" sx={buyButtonStyle}
                          className={
                            mode(styles.wallet_adapter_button_trigger_light_mode, styles.wallet_adapter_button_trigger_dark_mode)
                          }
                          onClick={() => setOrderSide("buy")}
                        >
                          Buy
                        </Button>
                        
                        <Button id="sell" sx={sellButtonStyle} variant={'outline'}
                          onClick={() => setOrderSide("buy")}
                        >
                          Sell
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </Stack>
                </Stack>
              )
              
              || activeStep === 1 && (
                <Formik 
                  initialValues={{ contractAmount: 2 }}
                  onSubmit={(values) => {
                      transferTo(values.contractAmount)
                      nextStep
                      setTimeout(() => {
                          setSuccess(false)
                      }, 6000)
                  }}
                >
                  {({
                      values,
                      errors,
                      handleChange,
                      handleSubmit,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={6}>
                        <Heading size="md">Swap summary</Heading>
                        
                        <Stack spacing="3">
                          <TradeFormItem label="Price per contract" value={`${outcomes[0].probability}`} />
                          <TradeFormItem label="No. of contracts">
                            <Field name="contractAmount">
                              {({ field, form }) => (
                                <NumberInput
                                  name="contractAmount"
                                  onChange={val=>form.setFieldValue(field.name, val)}
                                  onKeyPress={e => { e.which === 13 && e.preventDefault() }}
                                  size={'sm'} width={'35%'} 
                                  min={0} max={100}
                                  value={values.contractAmount}
                                >
                                  <NumberInputField fontSize={'sm'} textAlign={'end'} rounded={'md'} />
                                  <NumberInputStepper><NumberIncrementStepper/><NumberDecrementStepper /></NumberInputStepper>
                                </NumberInput>
                              )}
                            </Field>
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
                              {values.contractAmount * outcomes[0].probability} USDC
                            </Text>
                          </Flex>
                        </Stack>
                        
                        <ButtonGroup justifyContent={'center'} size="lg" fontSize="md" spacing='3'>
                          <Button onClick={prevStep} variant={'ghost'} 
                            transition={'all 0.3s ease'} rounded={'lg'}
                            _hover={{ bg: mode('gray.200', 'gray.700') }}
                          >
                            <ArrowBackIcon />
                          </Button>

                          <Button type={'submit'} 
                            className={
                              mode(styles.wallet_adapter_button_trigger_light_mode, styles.wallet_adapter_button_trigger_dark_mode)
                            }
                            isDisabled={!publicKey || values.contractAmount == 0} isLoading={isLoading}
                            textColor={mode('white', '#353535')} bg={mode('#353535', 'gray.50')} 
                            boxShadow={'xl'} width={'full'} rounded={'lg'}
                          >
                            Place Order
                          </Button>
                        </ButtonGroup>
                      </Stack>
                    </form>
                  )}
                </Formik>
              )
            }
          
            {activeStep === steps.length && (
              <Stack spacing={8}>
                <Heading size={'md'}>
                  Woohoo! Your order has been placed!
                </Heading>
                  <Button onClick={reset}
                    size="lg" mt={5} textColor={mode('white', '#353535')} bg={mode('#353535', 'gray.50')}
                    boxShadow={'xl'}
                    className={
                      mode(styles.wallet_adapter_button_trigger_light_mode, styles.wallet_adapter_button_trigger_dark_mode)
                    }
                  >
                    Done
                  </Button>
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
    {/* <Confetti active={!isLoading} config={confettiConfig} /> */}
    </>
  )
}
import {
    Progress, Text, HStack, VStack, Stack,
    useRadioGroup, useRadio, UseRadioProps, useId,
    useColorModeValue as mode,
    chakra,
    StackProps,
    Box, Flex,
    Spacer,
} from '@chakra-ui/react'
import { MdCheckCircle, MdOutlineCircle } from 'react-icons/md'
import fetch from 'unfetch'
import useSWR from "swr"
import { useWallet } from '@solana/wallet-adapter-react'
import { useDispatch } from '@/store/store'
import { setTitle } from '@/store/slices/outcomeSlice'

// Style config //
const progressBarColorScheme = ['purple', 'teal', 'pink']
// Style config //

const fetcher = async url => {
    const res = await fetch(url)
  
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error: any = new Error('An error occurred while fetching the data.')
      // Attach extra info to the error object.
      error.info = await res.json()
      error.status = res.status
      throw error
    }
  
    return res.json()
}

interface RadioOptionProps extends UseRadioProps, Omit<StackProps, 'onChange'> {
    index: number
    outcome: any
    market: any
}

const RadioOption = (props: RadioOptionProps) => {
    const { publicKey } = useWallet()
    
    const { index, outcome, market, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps, getLabelProps } = useRadio(radioProps)
    const id = useId()
    
    const checkoxColorScheme = [mode('purple.500', 'purple.200'), mode('#2C7C7C', '#81E6D9'), 'pink']
    const bgColorScheme = [mode('rgb(128,90,213,0.2)', 'rgb(214,188,250,0.1)'), mode('rgb(44,124,124,0.2)', 'rgb(129,230,217,0.1)'), 'pink']

    const { data } = useSWR(publicKey ? `../api/user?pubKey=${publicKey?.toString()}` : null, fetcher)
    
    return (
        <chakra.label {...getLabelProps()}>
            <input {...getInputProps()} aria-labelledby={id} />
            <Box
                borderWidth="1px"
                px="5"
                py="4"
                rounded="2xl"
                cursor="pointer"
                transition="all 0.2s"
                fontSize= {{ 'base': 'sm', 'md': 'md' }}
                _hover={{
                    borderColor: "gray.400"
                }}
                _checked={{
                    bg: bgColorScheme[index % bgColorScheme.length],
                    borderColor: checkoxColorScheme[index % checkoxColorScheme.length],
                }}
                {...getCheckboxProps(props)} id={id}
            >
                <Flex >
                    <Flex width={"full"} alignItems="center">
                        <Box flex={1.8}>
                            <Stack>
                                <HStack justifyContent={'space-between'}>
                                    <Text>{outcome.title}</Text>
                                    <Text>{outcome.probability * 100}%</Text>
                                </HStack>
                                <Progress value={outcome.probability * 100}
                                    size={'sm'} rounded={'xl'} 
                                    opacity={state.isChecked ? '100%' : '40%'} transition={'all 0.2s ease'}
                                    colorScheme={progressBarColorScheme[index % progressBarColorScheme.length]}
                                />
                            </Stack>
                        </Box>

                        <Spacer />

                        <chakra.label {...getLabelProps()} cursor="pointer">
                            <input {...getInputProps()} aria-labelledby={id} />
                            <Text>{outcome.probability}</Text>
                        </chakra.label>

                        <Spacer />

                        <chakra.label {...getLabelProps()} pr={5} cursor="pointer">
                            <input {...getInputProps()} aria-labelledby={id} />
                            {!publicKey && <Text>0.00</Text>}
                            {data && data.positions.map((position, index) => {
                                let found = false
                                if (position.marketId === market.marketId && position.outcome === outcome.title) {
                                    found = true
                                    return position.shares
                                }
                                if (index == position.length - 1 && !found) {
                                    return 0.00
                                }
                            })}
                        </chakra.label>
                    </Flex>

                    <Flex display={{ 'base': 'none', 'md': 'block'}} direction={"column"}>
                        <Box
                            data-checked={state.isChecked ? '' : undefined}
                            fontSize="xl"
                            _checked={{
                                color: checkoxColorScheme[index % checkoxColorScheme.length],
                            }}
                            color={mode('gray.300', 'whiteAlpha.400')}
                        >
                            {state.isChecked ? <MdCheckCircle /> : <MdOutlineCircle />}
                        </Box>
                        <Text visibility={"hidden"}>&nbsp;</Text>
                    </Flex>
                </Flex>
            </Box>
        </chakra.label>
    )
}

const Outcomes = ({ market }) => {
    const dispatch = useDispatch() // <-- calling the reducer

    const handleChange = (value) => {
        dispatch(setTitle(value))
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        defaultValue: market.outcomes[0].title,
        onChange: handleChange
    })

    return (
        <VStack mt={4} spacing={{ base: 2, md: 3 }} width={{ 'base': '83%', 'md': 'full' }} 
            {...getRootProps()}
        >
            <Flex fontWeight={"bold"} textColor={mode('gray.700', 'gray.400')}
                width={"full"} px={5} letterSpacing={"wider"}
                fontSize={{ 'base': '2xs', 'md': 'xs' }}
                justifyContent={'space-between'} textAlign={"center"}
            >
                <Text>OUTCOME / PROBABILITY</Text>
                <Text pl={{ 'md': 8 }}>PRICE (USDC)</Text>
                <Text pr={{ 'md': 10 }}>YOUR SHARES</Text>
            </Flex>
            <Stack width={"full"} spacing={3}>
                {market.outcomes.map((outcome, index) => {
                    return (
                        <RadioOption key={index} 
                            index={index} market={market} outcome={outcome}
                            {...getRadioProps({ 
                                value: outcome.title,
                            })}
                        />
                    )
                })}
            </Stack>
        </VStack>
    )
}

export default Outcomes

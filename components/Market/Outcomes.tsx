import {
    Progress, Text, HStack, VStack, Stack,
    Table, Thead, Tbody, Tr, Th, Td,
    Radio, useRadioGroup, useRadio, UseRadioProps, useId, 
    useColorModeValue as mode,
    chakra,
    StackProps,
} from '@chakra-ui/react'
import fetch from 'unfetch'
import useSWR from "swr"
import { useWallet } from '@solana/wallet-adapter-react'

// Style config //
const tableHeaderStyle = {
    pl: 0,
    fontSize: { 'base': '2xs', 'md': 'xs'}
}
const tableCellStyle = {
    fontSize: { 'base': 'sm', 'md': 'md'}
}
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

interface RadioGroupProps extends Omit<StackProps, 'onChange'> {
    market: any
    onChange: (value: any) => void
}

const RadioOption = (props: RadioOptionProps) => {
    const { publicKey } = useWallet()
    
    const { index, outcome, market, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps, getLabelProps } = useRadio(radioProps)
    const id = useId()

    const alternatingColorScheme = ['purple', 'teal']
    const color = alternatingColorScheme[index % alternatingColorScheme.length]

    const { data, error } = useSWR(publicKey ? `../api/users?pubKey=${publicKey?.toString()}` : null, fetcher)
    
    return (
        <Tr _hover={{ bg: mode('gray.100', 'gray.800') }} {...getCheckboxProps()}>
            <Td sx={tableCellStyle} pl={2} pr={0}>
                <chakra.label {...getLabelProps()} cursor={'pointer'}>
                    <input {...getInputProps()} aria-labelledby={id} />
                    <HStack spacing={6}>
                        <Radio {...getCheckboxProps(props)} transition={'all 0.2s ease'} colorScheme={color} />
                        <Stack width={'full'}>
                            <HStack justifyContent={'space-between'}>
                                <Text>{outcome.title}</Text>
                                <Text>{outcome.probability * 100}%</Text>
                            </HStack>
                            <Progress value={outcome.probability * 100}
                                size={'sm'} rounded={'xl'} 
                                opacity={state.isChecked ? '100%' : '40%'} transition={'all 0.3s ease'}
                                colorScheme={color}
                            />
                        </Stack>
                    </HStack>
                </chakra.label>
            </Td>
            <Td sx={tableCellStyle} isNumeric>
                <chakra.label {...getLabelProps()} cursor={'pointer'}>
                    <input {...getInputProps()} aria-labelledby={id} />
                    <Text>{outcome.probability}</Text>
                </chakra.label>
            </Td>
            <Td sx={tableCellStyle} isNumeric>
                <chakra.label {...getLabelProps()} cursor={'pointer'}>
                    <input {...getInputProps()} aria-labelledby={id} />
                    {data && data[0].positions.map((position, index) => {
                        console.log(index)
                        if (position.marketId === market.marketId && position.outcome === outcome.title) {
                            console.log(index)
                            return <Text key={index}>{position.shares}</Text>
                        }
                        if (index === data[0].positions.length - 1) {
                            return <Text key={index}>0.00</Text>
                        }
                    })}
                </chakra.label>
            </Td>
        </Tr>
    )
}

const RadioGroup = (props: RadioGroupProps) => {
    const { market, onChange } = props
    const { getRootProps, getRadioProps } = useRadioGroup({
        defaultValue: market.outcomes[0].title,
        onChange,
    })

    return (
        <VStack spacing={{ base: 2, md: 4 }} width={{ 'base': '86%', 'md': 'full' }} 
            {...getRootProps()}
        >
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th sx={tableHeaderStyle}>Outcome/Probability</Th>
                        <Th sx={tableHeaderStyle} isNumeric>Price (USDC)</Th>
                        <Th sx={tableHeaderStyle} isNumeric>Your Shares</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {market.outcomes.map((outcome, index) => (
                        <RadioOption key={index} 
                            index={index} market={market} outcome={outcome}
                            {...getRadioProps({ value: outcome.title })}
                        />
                    ))}
                </Tbody>
            </Table>
        </VStack>
    )
}

const Outcomes = ({ market }) => {
    
    return (
        <RadioGroup market={market} onChange={console.log} />
    )
}

export default Outcomes
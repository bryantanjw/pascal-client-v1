import {
    Progress, Text, HStack, VStack, Stack,
    Table, Thead, Tbody, Tr, Th, Td,
    Radio, useRadioGroup, useRadio, UseRadioProps, useId, 
    Box,
    chakra,
    StackProps,
} from '@chakra-ui/react'

// Style config //
const tableHeaderStyle = {
    pl: 0,
    fontSize: { 'base': '2xs', 'md': 'xs'}
}
const tableCellStyle = {
    fontSize: { 'base': 'sm', 'md': 'md'}
}
// Style config //



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
    const { index, outcome, market, ...radioProps } = props
    const { state, getInputProps, getCheckboxProps, getLabelProps } = useRadio(radioProps)
    const id = useId()

    const alternatingColorScheme = ['purple', 'teal']
    const color = alternatingColorScheme[index % alternatingColorScheme.length]
  
    return (
            <Tr _hover={{ bg: 'gray.100' }}
                {...getCheckboxProps()} 
            >
                <Td sx={tableCellStyle} pl={2}>
                    <chakra.label {...getLabelProps()} cursor={'pointer'}>
                        <HStack spacing={6}>
                            <Radio {...getCheckboxProps(props)} transition={'all 0.3s ease'} colorScheme={color} />
                            <Stack width={'full'}>
                                <HStack justifyContent={'space-between'}>
                                    <Text>{outcome.title}</Text>
                                    <Text>{market.outcomes[0].probability * 100}%</Text>
                                </HStack>
                                <Progress value={market.outcomes[0].probability * 100}
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
                        <Text>{market.outcomes[0].probability}</Text>
                    </chakra.label>
                </Td>
                <Td sx={tableCellStyle} isNumeric>
                    <chakra.label {...getLabelProps()} cursor={'pointer'}>
                        <input {...getInputProps()} aria-labelledby={id} />
                        <Text>0.00</Text>
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
        <VStack spacing={{ base: 2, md: 4 }} {...getRootProps()}>
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
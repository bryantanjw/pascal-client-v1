import {
    Progress, Text, HStack, VStack,
    Table, Thead, Tbody, Tr, Th, Td,
} from '@chakra-ui/react'

// Style config //
const tableHeaderStyle = {
    pl: 0,
    fontSize: { 'base': '2xs', 'md': 'xs'}
}
const tableDataStyle = {
    fontSize: { 'base': 'sm', 'md': 'md'}
}
// Style config //

export default function OutcomeGraph({ market }) {

    return (
        <VStack width={{ 'base': '86%', 'md': 'full' }}>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th sx={tableHeaderStyle}>Outcome/Probability</Th>
                        <Th sx={tableHeaderStyle} isNumeric>Price (SOL)</Th>
                        <Th sx={tableHeaderStyle} isNumeric>Your Shares</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {market.outcomes.map((outcome, index) => (
                        <Tr key={index}>
                            <Td sx={tableDataStyle} pl={0}>
                                <HStack mb={2} justifyContent={'space-between'}>
                                    <Text>{outcome.title}</Text>
                                    <Text>{market.outcomes[0].probability * 100}%</Text>
                                </HStack>
                                <Progress value={market.outcomes[0].probability * 100} 
                                    size={'sm'} rounded={'xl'} colorScheme={alternatingColorScheme[index % alternatingColorScheme.length]}
                                />
                            </Td>
                            <Td sx={tableDataStyle} isNumeric>{market.outcomes[0].probability}</Td>
                            <Td sx={tableDataStyle} isNumeric>0.00</Td>
                        </Tr>
                    ))
                    }
                </Tbody>
            </Table>
        </VStack>
    )
}

const alternatingColorScheme = ['purple', 'teal']
import {
    Progress, Text, HStack, VStack,
    Table, Thead, Tbody, Tr, Th, Td,
} from '@chakra-ui/react'

export default function OutcomeGraph({ market, publicKey }) {

    return (
        <VStack width={{ 'base': '80%', 'md': 'full' }}>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th pl={0}>Outcome/Probability</Th>
                        <Th pl={0} isNumeric>Price (SOL)</Th>
                        <Th pl={0} isNumeric>Your Shares</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {market.outcomes.map((outcome, index) => (
                        <Tr key={index}>
                            <Td pl={0}>
                                <HStack mb={2} justifyContent={'space-between'}>
                                    <Text>{outcome.title}</Text>
                                    <Text>{market.outcomes[0].probability * 100}%</Text>
                                </HStack>
                                <Progress value={market.outcomes[0].probability * 100} 
                                    size={'sm'} rounded={'xl'} colorScheme={alternatingColorScheme[index % alternatingColorScheme.length]}
                                />
                            </Td>
                            <Td isNumeric>{market.outcomes[0].probability}</Td>
                            <Td isNumeric>0.00</Td>
                        </Tr>
                    ))
                    }
                </Tbody>
            </Table>
        </VStack>
    )
}

const alternatingColorScheme = ['purple', 'teal']
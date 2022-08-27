import {
    Progress, Text, HStack, Stack, VStack,
    Table, Thead, Tbody, Tr, Th, Td,
    ButtonGroup, Button, useDisclosure, Heading
} from '@chakra-ui/react'

export default function Graph({ market }) {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <VStack>
        {isOpen ? (
            // <Buy itemID={id} />
            <Heading>text</Heading>
            ) : (
            <>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Outcome/Probability</Th>
                        <Th isNumeric>Price (SOL)</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>
                            <HStack mb={2} justifyContent={'space-between'}>
                                <Text>Yes</Text>
                                <Text>{market.props.probability[0].yes * 100}%</Text>
                            </HStack>
                            <Progress value={market.props.probability[0].yes * 100} size={'sm'} rounded={'xl'} colorScheme={'pink'}/>
                        </Td>
                        <Td isNumeric>{market.props.probability[0].yes}</Td>
                    </Tr>
                    <Tr>
                        <Td>
                            <HStack mb={2} justifyContent={'space-between'}>
                                <Text>No</Text>
                                <Text>{market.props.probability[0].no * 100}%</Text>
                            </HStack>
                            <Progress value={market.props.probability[0].no * 100} size={'sm'} rounded={'xl'} colorScheme={'teal'} />
                        </Td>
                        <Td isNumeric>{market.props.probability[0].no}</Td>
                    </Tr>
                </Tbody>
            </Table>
            </>
        )}
        </VStack>
    )
}
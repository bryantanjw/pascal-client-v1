import {
    Progress, Text, HStack, Stack, VStack,
    Table, Thead, Tbody, Tr, Th, Td,
    ButtonGroup, Button, useDisclosure, Heading
} from '@chakra-ui/react'

export default function Graph({ id }) {
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
                                <Text>69.2%</Text>
                            </HStack>
                            <Progress value={69.2} size={'sm'} rounded={'xl'} colorScheme={'pink'}/>
                        </Td>
                        <Td isNumeric>2.4</Td>
                    </Tr>
                    <Tr>
                        <Td>
                            <HStack mb={2} justifyContent={'space-between'}>
                                <Text>No</Text>
                                <Text>30.8%</Text>
                            </HStack>
                            <Progress value={30.8} size={'sm'} rounded={'xl'} colorScheme={'teal'} />
                        </Td>
                        <Td isNumeric>0.2</Td>
                    </Tr>
                </Tbody>
            </Table>
            </>
        )}
        </VStack>
    )
}
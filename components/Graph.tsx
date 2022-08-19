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
                        <Th px={8} fontWeight={400}>Outcome/Probability</Th>
                        <Th px={8} fontWeight={400} isNumeric>Price (SOL)</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td px={8}>
                            <HStack justifyContent={'space-between'}>
                                <Text color={'gray.700'} pb={2}>Yes</Text>
                                <Text color={'gray.700'}>69.2%</Text>
                            </HStack>
                            <Progress value={69.2} size={'sm'} rounded={'xl'} colorScheme={'pink'}/>
                        </Td>
                        <Td px={8} isNumeric>2.4</Td>
                    </Tr>
                    <Tr>
                        <Td px={8}>
                            <HStack justifyContent={'space-between'}>
                                <Text pb={2} color={'gray.700'}>No</Text>
                                <Text color={'gray.700'}>30.8%</Text>
                            </HStack>
                            <Progress value={30.8} size={'sm'} rounded={'xl'} colorScheme={'teal'} />
                        </Td>
                        <Td px={8} isNumeric>0.2</Td>
                    </Tr>
                </Tbody>
            </Table>
            
            <ButtonGroup px={7} py={3} variant={'outline'} spacing={4} alignSelf='end'>
                <Button fontSize={'sm'} fontWeight={300} isDisabled>Sell</Button>
                <Button fontSize={'sm'} fontWeight={300} onClick={onToggle}>Buy</Button>
            </ButtonGroup>
            </>
        )}
        </VStack>
    )
}
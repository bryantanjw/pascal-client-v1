import {
    FormControl, FormLabel,
    HStack,
    Input, InputGroup, InputLeftElement,
    Select,
    Stack,
    Table, Thead, Tr, Th, Tbody, Td,
    useColorModeValue as mode,
    Box,
    Img,
    Badge,
} from '@chakra-ui/react'
import * as React from 'react'
import { BsSearch } from 'react-icons/bs'
import data from "../../pages/api/users.json"

interface MarketPositionProps {
    data: {
      image: string
      name: string
    }
}
  
export const Position = (props: MarketPositionProps) => {
    const { image, name } = props.data
    return (
        <Stack direction="row" spacing="4" align="center">
            <Box flexShrink={0} h="5" w="5">
                <Img
                    filter={mode('invert(0%)', 'invert(100%)')}
                    objectFit="cover"
                    src={image}
                    alt=""
                />
            </Box>
            <Box>
                <Box fontSize="sm" fontWeight="medium">
                {name}
                </Box>
            </Box>
        </Stack>
    )
}


const badgeEnum: Record<string, string> = {
    active: 'green',
    resolving: 'orange',
    closed: 'gray',
  }
  
  export const columns = [
    {
        Header: 'Market',
        accessor: 'user',
        Cell: function MarketCell(data: any) {
            return <Position data={data} />
        },
    },
    {
        Header: 'Deposit',
    },
    {
        Header: 'Value',
        accessor: 'earned',
    },
    {
        Header: 'Net return',
    },
    {
        Header: 'Tokens',
        accessor: 'role',
    },
    {
        Header: 'Status',
        accessor: 'status',
        Cell: function StatusCell(data: any) {
            return (
            <Badge variant={'subtle'} fontSize="xs" colorScheme={badgeEnum[data]}>
                {data}
            </Badge>
            )
        },
    },
]  

export const TableContent = () => {
    return (
        <Box my={4} rounded={'lg'} borderWidth="1px">
            <Table fontSize="sm">
                <Thead bg={mode('gray.50', 'gray.800')}>
                    <Tr>
                        {columns.map((column, index) => (
                        <Th whiteSpace="nowrap" scope="col" key={index}>
                            {column.Header}
                        </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((row, index) => (
                        <Tr key={index}>
                            {columns.map((column, index) => {
                                const cell = row[column.accessor as keyof typeof row]
                                const element = column.Cell?.(cell) ?? cell
                                return (
                                    <Td whiteSpace="nowrap" key={index}>
                                        {element}
                                    </Td>
                                )
                            })}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    )
}

export const TableActions = () => {
    return (
      <Stack spacing="4" direction={{ base: 'column', md: 'row' }} justify="space-between">
        <HStack>
            <FormControl minW={{ md: '280px' }} id="search">
                <InputGroup size="sm">
                <FormLabel srOnly>Filter by market</FormLabel>
                <InputLeftElement pointerEvents="none" color="gray.400">
                    <BsSearch />
                </InputLeftElement>
                <Input rounded="base" type="search" placeholder="Filter by market" />
                </InputGroup>
            </FormControl>
            
            <Select w={{ base: '200px', md: '160px' }} rounded="base" size="sm" bg={mode('gray.100', 'gray.700')}>
                <option>All status</option>
                <option>Active</option>
                <option>Resolution</option>
                <option>Closed</option>
            </Select>
        </HStack>
      </Stack>
    )
}
  
export const PositionsTable = () => {
    return (
        <>
            <TableActions />
            <TableContent />
        </>
    )
}
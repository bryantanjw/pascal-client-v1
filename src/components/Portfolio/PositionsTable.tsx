import {
    FormControl, FormLabel,
    HStack,
    Input, InputGroup, InputLeftElement,
    Stack,
    Text,
    Table, Thead, Tr, Th, Tbody, Td,
    useColorModeValue as mode,
    Box,
    Img,
    Badge,
} from '@chakra-ui/react'
import {
    Select as ReactSelect,
    chakraComponents,
} from "chakra-react-select"
import { BsSearch } from 'react-icons/bs'

// Custom style config for ReactSelect
// Documentation: https://github.com/csandman/chakra-react-select
const ReactSelectMenuItem = {
    Option: ({ children, ...props }) => (
        // @ts-ignore
        <chakraComponents.Option {...props}>
            <Badge my={1} colorScheme={props.data.colorScheme}>
                {children}
            </Badge>
        </chakraComponents.Option>
    ),
};
  

const statusOptions = [
    {
        label: 'ACTIVE',
        value: 'active',
        colorScheme: 'green',
    },
    {
        label: 'RESOLVING',
        value: 'resolving',
        colorScheme: 'orange'
    },
    {
        label: 'CLOSED',
        value: 'closed',
        colorScheme: 'gray'
    }
]

interface MarketPositionProps {
    data: {
        category: string
        market: string
    }
}

export const Position = (props: MarketPositionProps) => {
    const { category, market } = props.data

    return (
        <Stack direction="row" spacing="4" align="center">
            <Box flexShrink={0} h="5" w="5">
                <Img
                    filter={mode('invert(0%)', 'invert(100%)')}
                    objectFit="cover"
                    src={`${category}.svg`}
                    alt=""
                />
            </Box>
            <Box>
                <Box fontSize="sm" fontWeight="medium">
                    {category}
                </Box>
            </Box>
        </Stack>
    )
}

export const badgeEnum: Record<string, string> = {
    active: 'green',
    resolving: 'orange',
    closed: 'gray',
}

export const TableContent = ({ user }, error) => {
    const columns = [
        // TODO: Add category icon to Market column. why tf is it not working??
        {
            Header: 'Market',
            accessor: 'market',
            // Cell: function MarketCell(data: any) {
            //     return <Position data={data} />
            // },
        },
        {
            Header: 'Shares',
            accessor: 'shares',
        },
        {
            Header: 'Value',
        },
        {
            Header: 'Net return',
            accessor: 'unrealizedPnl'
        },
        {
            Header: 'Tokens',
            accessor: 'tokenBalance',
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

    return (
        <Box my={4} rounded={'lg'} borderWidth="1px" overflowX={'auto'}>
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
                    {user && user.positions.map((row, index) => (
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
                    ))
                    }
                </Tbody>
            </Table>
            {!user &&
                    <Text color={mode('gray.600', 'gray.700')} p={6} textAlign={'center'}>No positions found</Text>
            }
        </Box>
    )
}

export const TableActions = () => {

    return (
      <Stack spacing="4" mt={8}>
        <HStack>
            <FormControl w={'300px'} id="search">
                <InputGroup size="sm" variant={'filled'}>
                    <FormLabel srOnly>Filter by market</FormLabel>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                        <BsSearch />
                    </InputLeftElement>
                    <Input rounded="base" type="search" placeholder="Filter by market" />
                </InputGroup>
            </FormControl>

            <FormControl minW={{ 'base': '100px', 'md':'150px' }} w={'auto'}>
                <ReactSelect
                    variant="outline"
                    isMulti
                    useBasicStyles
                    size='sm'
                    name="status"
                    options={statusOptions}
                    placeholder="Status"
                    closeMenuOnSelect={false}
                    components={ReactSelectMenuItem}
                />
            </FormControl>
        </HStack>
      </Stack>
    )
}
  
export const PositionsTable = ({ user }) => {
    return (
        <>
            <TableActions />
            <TableContent user={user} />
        </>
    )
}
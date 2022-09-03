import {
    FormControl, FormLabel,
    HStack,
    Input, InputGroup, InputLeftElement,
    Stack,
    Table, Thead, Tr, Th, Tbody, Td,
    useColorModeValue as mode,
    Box,
    Img,
    Badge,
    VStack,
} from '@chakra-ui/react'
import {
    Select as CustomSelect,
    ChakraStylesConfig,
    chakraComponents,
} from "chakra-react-select"
import React, { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import data from "../../pages/api/users.json"

const customSelectMenuItem = {
    Option: ({ children, ...props }) => (
        <chakraComponents.Option {...props}>
            <Badge my={1} colorScheme={props.data.colorScheme}>
                {children}
            </Badge>
        </chakraComponents.Option>
    ),
  };
  

const statusOptions = [
    {
        label: 'ALL STATUS',
        value: 'all-status',
        colorScheme: 'white'
    },
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

export const badgeEnum: Record<string, string> = {
    "all status": 'none',
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
      <Stack spacing="4">
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

            <FormControl minW={'230px'} w={'auto'}>
                <CustomSelect
                    variant="outline"
                    isMulti
                    useBasicStyles
                    size='sm'
                    name="status"
                    options={statusOptions}
                    placeholder="Status"
                    closeMenuOnSelect={false}
                    components={customSelectMenuItem}
                />
            </FormControl>

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
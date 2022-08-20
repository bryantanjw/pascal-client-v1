import { useEffect, useState } from 'react'
import {
    Box, Button, Divider,
    Stack, VStack, HStack,
    Text,
    Menu, MenuButton, Tooltip, Heading,
    Flex, Link, Tab, Tabs, TabList, TabPanels, TabPanel, useColorMode, useColorModeValue,
} from '@chakra-ui/react'
import { FaRegChartBar, FaChartLine } from 'react-icons/fa'
import { ViewIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { TradeForm } from './TradeForm'
import Graph from './Graph'
import { Connection, PublicKey } from "@solana/web3.js"
import WithSubnavigation from './TopBar'
import { useRouter } from 'next/router'
import MarketProgress from './MarketProgress'

const MarketView = ({ p }) => {
    const router = useRouter()

    return (
        <div className={`bg-th-bkg-1 text-th-fgd-1 transition-all`}>
        <WithSubnavigation />

        <Box
            maxW={{ base: '3xl', lg: '6xl' }}
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                align={{ lg: 'flex-start' }}
                spacing={{ base: '8', md: '16' }}
            >
                <Stack spacing={{ base: '8', md: '10' }} flex="2">
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        <Link onClick={() => router.back()}><ArrowBackIcon mr={4}/>{p.props.title}</Link>
                    </Heading>

                    <Tabs colorScheme={'black'}>
                        <TabList>
                            <Tab>Graph</Tab>
                        </TabList>
                    </Tabs>

                    <Graph id={p.props.id} />

                    <Tabs colorScheme={'black'}>
                        <TabList>
                            <Tab>About</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Flex>
                                    <Stack>
                                        
                                        <MarketProgress />

                                        <HStack spacing={10} px={8} py={5}>
                                            <VStack alignItems={'start'} spacing={1}>
                                                <Text color={'gray.700'} fontWeight={500}>{p.props.liquidity}</Text>
                                                <Text color={'gray.500'}>Liquidity</Text>
                                            </VStack>
                                            <VStack alignItems={'start'} spacing={1}>
                                                <Text color={'gray.700'} fontWeight={500}>{p.props.volume}</Text>
                                                <Text color={'gray.500'}>Total Volume</Text>
                                            </VStack>
                                            <VStack alignItems={'start'} spacing={1}>
                                                <Text color={'gray.700'} fontWeight={500}>2022-04-30 - 00:00</Text>
                                                <Text color={'gray.500'}>Closing Date - UTC</Text>
                                            </VStack>
                                            <VStack alignItems={'start'} spacing={1}>
                                                <Text color={'gray.700'} fontWeight={500}>{p.props.closing_date}</Text>
                                                <Text color={'gray.500'}>Remaining</Text>
                                            </VStack>
                                        </HStack>

                                        <Divider />

                                        <HStack cursor={'default'} px={8} pt={4} spacing={8}>
                                            <HStack spacing={2}>
                                                <FaChartLine /><Text>{p.props.category}</Text>
                                            </HStack>
                                            <Tooltip fontWeight={300} p={4} rounded={'md'} label='This market uses Pyth as the final arbitrator.' hasArrow> 
                                                <HStack spacing={2}>
                                                        <ViewIcon /><Text>Pyth</Text>
                                                </HStack>
                                            </Tooltip>
                                        </HStack>
                                    </Stack>
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <TradeForm />
                </Flex>
            </Stack>
        </Box>
        </div>
    )
}

export default MarketView
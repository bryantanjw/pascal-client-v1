import { useEffect, useState } from 'react'
import {
    Box, Button, Divider,
    Stack, VStack, HStack,
    Text,
    Menu, MenuButton, Tooltip, Heading,
    Flex, Link, Tab, Tabs, TabList, TabPanels, TabPanel,
} from '@chakra-ui/react'
import { FaRegChartBar, FaChartLine } from 'react-icons/fa'
import { ViewIcon, ArrowBackIcon } from '@chakra-ui/icons'
import TopBar from 'components/TopBar'
import Swap from './Swap'
import { Connection, PublicKey } from "@solana/web3.js"
import WithSubnavigation from './TopBar'

const MarketView = ({ p }) => {

    return (
        <div className={`bg-th-bkg-1 text-th-fgd-1 transition-all`}>
        <WithSubnavigation />
        <Flex align={'center'} justify={'center'}>
            <Stack mx={'auto'} maxW={'2xl'} py={12} px={6}>
                <HStack spacing={3} alignSelf="start">
                    <Link href='/' _hover={{color:'currentColor'}}>
                        <Button variant='ghost'><ArrowBackIcon w={4} h={4} /></Button>
                    </Link>
                    <Heading color={'gray.700'} fontWeight={500} size={'sm'}>{p.props.title}</Heading>
                </HStack>
                
                {/* MarketInfo component */}
                <Box border={'1px'} rounded={'xl'} borderColor={'gray.200'} boxShadow={'sm'}>
                    <VStack py={4} alignItems={'start'} spacing={0} width={'100%'}>
                        <Stack pt={2} px={8}>
                            <Menu>
                                <MenuButton as={Button} minW={'230px'} minH={'50px'} borderColor='gray.300'
                                    leftIcon={<FaRegChartBar />} bg={'gray.20'} textAlign={'left'} fontWeight={400}
                                    px={5} transition='all s' borderRadius='md' borderWidth='1px' textColor={'gray.600'} fontSize={'sm'}
                                    _expanded={{ borderColor: 'gray.400' }}
                                    _focus={{ borderColor: 'gray.400' }}>
                                    Categorical Market
                                </MenuButton>
                            </Menu>
                        </Stack>
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
                    </VStack>
                </Box>
                {/* MarketInfo component */}

                <Stack py={4}>
                    <Box border={'1px'} rounded={'xl'} borderColor={'gray.200'} boxShadow={'sm'}>
                        <VStack py={1} alignItems={'start'} spacing={0} width={'100%'}>
                            <Tabs width={'100%'} variant='unstyled'>
                                <TabList textColor={'gray.700'} py={4} px={8} >
                                    <Tab  mr={2} fontSize={'sm'} _selected={{ fontWeight:'500', textColor:'indigo', bg: 'purple.100' }}>
                                        Swap
                                    </Tab>
                                    <Tab fontSize={'sm'}  _selected={{ fontWeight:'500', textColor:'indigo', bg: 'purple.100' }}>
                                        Pool
                                    </Tab>
                                </TabList>
                                <Divider />
                                <TabPanels>
                                    <TabPanel py={1} px={0}>
                                        <Swap id={p.props.id} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Text px={8} fontStyle={'italic'}>Coming soon!</Text>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </VStack>
                    </Box>
                </Stack>

            </Stack>
        </Flex>
        </div>
    )
}

export default MarketView
import React from 'react'
import Head from 'next/head'
import {
    Box, Divider,
    Stack, HStack, SimpleGrid,
    Heading,
    Flex, 
    Tab, Tabs, TabList, TabPanels, TabPanel, useColorModeValue as mode,
    Image,
    useColorModeValue
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import MarketProgress from './MarketProgress'
import { Stat } from './Stat'
import NewsList from './NewsList'
import { TradeForm } from './TradeForm'
import Graph from './Graph'
import WithSubnavigation from './TopBar'
import MarketResolution from './MarketResolution'
import Layout from './Layout'
import ChakraNextLink from './ChakraNextLink'
import { useWallet } from '@solana/wallet-adapter-react'
import styles from '../styles/Home.module.css'

// Dynamically load ResearchGraph component on client side
const ResearchGraph = dynamic(import('./ResearchGraph'), {
    ssr: false
})

const MarketView = ({ market }) => {
    const router = useRouter()

    const { publicKey } = useWallet()
    const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false )

    // Style config
    const dividerColor = mode('gray.300', '#464A54')
    const iconColor = mode('invert(0%)', 'invert(100%)')
    const tabListStyle = {
        fontWeight:' semibold',
        fontSize: 'lg',
        px: 0,
        textColor: 'gray.400',
        _selected: {
            textColor: useColorModeValue('black', 'gray.100'),
            borderColor: useColorModeValue('black', 'gray.100')
        }
    }
    const sectionHeadingStyle = {
        fontSize: 'lg',
        fontWeight: 'bold'
    }
    const stats = [
        { label: 'Liquidity', value: market.liquidity },
        { label: 'Total Volume', value: market.volume },
        { label: 'Closing Date - UTC', value: new Date(market.closing_date).toISOString().split('T')[0] },
    ]

    return (
        <div className={styles.container}>
        <Head>
            <title>{market.title}</title>
            <meta name="description" content="Trade directly on the outcome of events" />
            <meta property="og:title" content={market.title} />
            <meta
            property="og:description"
            content="Trade directly on the outcome of events"
            />
            <meta
            property="og:image"
            content="/Preview.png"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <WithSubnavigation />

        <Layout>
            <Box
                overflow={'hidden'}
                maxW={{ base: '3xl', lg: '5xl' }}
                mx="auto"
                px={{ base: '1', md: '8', lg: '12' }}
                py={{ base: '6', md: '8', lg: '14' }}
            >
                <ChakraNextLink href={'/'} scroll={false}>
                    <Stack mb={6} align={'center'} direction={'row'} width={{ 'base': '85%', 'md': 'full' }}>
                        <ArrowBackIcon mr={4}/>
                        <Heading fontSize={{ 'base': 'xl', 'md': '2xl' }} fontWeight="extrabold">
                            {market.title}
                        </Heading>
                    </Stack>
                </ChakraNextLink>

                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    align={{ lg: 'flex-start' }}
                    width={{ 'base': 'full', 'lg': '64%' }}
                    spacing={5}
                >
                    <Stack spacing={{ base: '8', md: '10' }} minW={'sm'} flex="2">
                        <Tabs colorScheme={'black'}>
                            <TabList>
                                <Tab sx={tabListStyle}>Graph</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel key={0} px={0}>
                                    <Graph market={market} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                        <Tabs isLazy colorScheme={'black'}> {/* isLazy defers rendering until tab is selected */}
                            <TabList>
                                <Tab sx={tabListStyle} mr={7}>About</Tab>
                                <Tab sx={tabListStyle}>Research and News</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel key={0} px={0}>
                                    <Flex flexDirection={'column'}>
                                        <Stack>
                                            <MarketProgress market={market} />
                                            
                                            <Divider borderColor={dividerColor} />

                                            {/* Statistics */}
                                            <Stack py={3} direction={'column'}>
                                                <HStack spacing={3}>
                                                    <Image filter={iconColor} alt='Statistics' width={'18px'} src={`/Statistics.png`} />
                                                    <Heading sx={sectionHeadingStyle}>Statistics</Heading>
                                                </HStack>
                                                <SimpleGrid columns={{ base: 2, md: 3 }}>
                                                    {stats.map(({ label, value }) => (
                                                    <Stat key={label} label={label} value={value} />
                                                    ))}
                                                </SimpleGrid>
                                            </Stack>

                                            <Divider borderColor={dividerColor} />

                                            {/* Market Resolution */}
                                            <Stack py={3} direction={'column'}>
                                                <HStack spacing={3}>
                                                    <Image filter={iconColor} alt='Resolution' width={'18px'} src={`/Resolution.png`} />
                                                    <Heading sx={sectionHeadingStyle}>Market Resolution</Heading>
                                                </HStack>
                                                
                                                <MarketResolution market={market} />
                                            </Stack>
                                        </Stack>
                                    </Flex>
                                </TabPanel>

                                <TabPanel key={1} px={0}>
                                    <Stack marginTop={5}>
                                        <ResearchGraph market={market} />
                                        <NewsList market={market} />
                                    </Stack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Stack>

                    <Flex direction="column" align="center">
                        <TradeForm market={market} />
                    </Flex>

                </Stack>
            </Box>
        </Layout>
        </div>
    )
}

export default MarketView
import React from 'react';
import {
    Box, Divider,
    Stack, HStack, SimpleGrid,
    Text,
    Heading,
    Flex, Link, 
    Tab, Tabs, TabList, TabPanels, TabPanel, useColorModeValue,
    Image, Skeleton,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { TradeForm } from './TradeForm'
import Graph from './Graph'
import WithSubnavigation from './TopBar'
import { useRouter } from 'next/router'
import MarketProgress from './MarketProgress'
import { Stat } from './Stat'
import styles from '../styles/Home.module.css'
import NewsList from './NewsList';
import ResearchGraph from './ResearchGraph';

const MarketView = ({ market }) => {
    const router = useRouter()

    const dividerColor = useColorModeValue('gray.300', '#464A54')
    const iconColor = useColorModeValue('invert(0%)', 'invert(100%)')
    const tabListStyle = {
        fontWeight:' semibold',
        fontSize: 'lg',
        px: 0
    }
    const sectionHeadingStyle = {
        fontSize: 'lg',
        fontWeight: 'bold'
    }
    const stats = [
        { label: 'Liquidity', value: market.props.liquidity },
        { label: 'Total Volume', value: market.props.volume },
        { label: 'Closing Date - UTC', value: new Date(market.props.closing_date).toISOString().split('T')[0] },
    ]

    return (
        <div className={styles.container}>
        <WithSubnavigation />
        <Box
            overflow={'hidden'}
            maxW={{ base: '3xl', lg: '5xl' }}
            mx="auto"
            px={{ base: '1', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '14' }}
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                align={{ lg: 'flex-start' }}
                spacing={5}
            >
                <Stack spacing={{ base: '8', md: '10' }} flex="2">
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        <Link onClick={() => router.back()}><ArrowBackIcon mr={4}/>{market.props.title}</Link>
                    </Heading>

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

                    <Tabs colorScheme={'black'}>
                        <TabList>
                            <Tab sx={tabListStyle} mr={7}>About</Tab>
                            <Tab sx={tabListStyle}>Research and News</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel key={0} px={0}>
                                <Flex flexDirection={'column'}>
                                    <Stack>
                                        <MarketProgress />
                                        
                                        <Divider borderColor={dividerColor} />
                                        <Stack py={2} direction={'column'}>
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
                                        <Stack py={2} direction={'column'}>
                                            <HStack spacing={3}>
                                                <Image filter={iconColor} alt='Resolution' width={'18px'} src={`/Resolution.png`} />
                                                <Heading sx={sectionHeadingStyle}>Market Resolution</Heading>
                                            </HStack>
                                            <HStack cursor={'default'} spacing={8}>
                                               <Text>This market uses Pyth as the final arbitrator.</Text>
                                            </HStack>
                                        </Stack>
                                    </Stack>
                                </Flex>
                            </TabPanel>

                            <TabPanel key={1} px={0}>
                                <ResearchGraph />
                                <NewsList market={market} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Stack>

                <Flex position={'static'} direction="column" align="center" flex="1">
                    <TradeForm market={market} />
                </Flex>

            </Stack>
        </Box>
        </div>
    )
}

export default MarketView
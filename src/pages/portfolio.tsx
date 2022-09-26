import { 
    Box, 
    Heading,
    Text,
    Center,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    useColorModeValue,
} from "@chakra-ui/react"
import WithSubnavigation from "components/TopBar"
import { Stats } from "components/Portfolio/Stat"
import { PositionsTable } from "@/components/Portfolio/PositionsTable"
import { ReturnsGraph } from "components/Portfolio/ReturnsGraph"
import ActivityTable from "components/Portfolio/ActivityTable"
import Layout from "components/Layout"
import { useWallet } from "@solana/wallet-adapter-react"
import fetch from 'unfetch'
import useSWR from "swr"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import styles from '@/styles/Home.module.css'

export function blurChange(publicKey) {
    let blur
    if (publicKey) {
        blur = 'blur(0px)'
    } else {
        blur = 'blur(2px)'
    }
    return blur
}

const fetcher = url => fetch(url).then(r => r.json())

const Portfolio = () => {
    const { publicKey } = useWallet()

    const { data, error } = useSWR(`../api/users?pubKey=${publicKey?.toString()}`, fetcher)

    return (
        <div className={styles.container}>
            <WithSubnavigation />
            
            <Layout>
                <Box as="section" py="12" blur={'15px'}>
                    <Box maxW={{ base: '3xl', lg: '5xl' }}
                        mx="auto"
                    >
                        <Box overflowX="auto">
                            <Heading size="xl" mb="6">
                                Your Portfolio
                            </Heading>

                            {!publicKey &&
                                <Center py={12} flexDirection={'column'}>
                                    <Text py={4} fontSize={'lg'}>Connect your wallet to view your portfolio</Text>
                                    <WalletMultiButton 
                                        // eslint-disable-next-line react-hooks/rules-of-hooks
                                        className={useColorModeValue(
                                            styles.wallet_adapter_button_trigger_light_mode, 
                                            styles.wallet_adapter_button_trigger_dark_mode
                                        )} 
                                    />
                                </Center>
                            }

                            {publicKey &&
                                <>
                                {data && <Stats account={data} />}
                        
                                <Tabs py={10} variant={'enclosed'} colorScheme={'black'}>
                                    <TabList>
                                        <Tab>Returns</Tab>
                                        <Tab>Activity</Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel key={1} px={0}>
                                            <ReturnsGraph account={data} />
                                            <PositionsTable account={data} />
                                        </TabPanel>

                                        <TabPanel key={2} px={0}>
                                            <ActivityTable account={data} />
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                                </>
                            }
                        </Box>
                    </Box>
                </Box>
            </Layout>
        </div>
    )
}

export default Portfolio
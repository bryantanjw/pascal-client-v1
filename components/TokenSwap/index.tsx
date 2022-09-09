import { 
    Stack,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Text,
    Flex,
    useColorModeValue as mode,
    Divider,
} from "@chakra-ui/react"
import { DepositSingleTokenType } from "./Deposit"
import { WithdrawSingleTokenType } from "./Withdraw"

export const TokenSwapForm = () => {
    // Style config //
    const tabStyle = {
        flex: 1,
        color: mode('gray.500', 'gray.400'),
        bg: mode('gray.50', 'none'),
        borderRadius: 'lg',
        fontSize: 'sm',
        fontWeight: 'medium',
        transition: 'all .2s ease',
        _hover : { bg: mode('gray.100', 'whiteAlpha.100')},
        _selected: {
            bg: mode('gray.600', 'gray.600'),
            color: 'white',
        }
    }
    // Style config //

    return (
        <Stack spacing={7}>
            <Stack spacing={3}>
                <Flex justify={'space-between'}>
                    <Text fontSize={'sm'}>Your Liquidity</Text>
                    <Text fontSize={'sm'}># USDC</Text>
                </Flex>
                <Flex justify={'space-between'}>
                    <Text fontSize={'sm'}>Your Earnings</Text>
                    <Text fontSize={'sm'}># USDC</Text>
                </Flex>
            </Stack>

            <Tabs variant={'unstyled'}>
                <TabList 
                    borderRadius={'lg'}
                >
                    <Tab sx={tabStyle}>Deposit</Tab>
                    <Divider orientation="vertical" mx={3} alignSelf={'center'} height={6} borderWidth={'0.5px'} borderColor={mode('gray.400', 'gray.600')} />
                    <Tab sx={tabStyle}>Withdraw</Tab>
                </TabList>

                <TabPanels>
                    {/* Deposit Liquidity */}
                    <TabPanel px={0} pb={0}>
                        <DepositSingleTokenType />
                    </TabPanel>

                    {/* Withdraw Liquidity */}
                    <TabPanel px={0}>
                        <WithdrawSingleTokenType />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    )
}
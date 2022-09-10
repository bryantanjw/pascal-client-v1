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
        // color: mode('gray.500', 'gray.400'),
        // bg: mode('gray.50', 'none'),
        color: mode('gray.800', 'gray.100'),
        borderRadius: 'lg',
        fontSize: 'sm',
        mx: '2px',
        fontWeight: 'medium',
        transition: 'all .2s ease',
        _hover : { bg: mode('blackAlpha.50', 'whiteAlpha.100')},
        _selected: {
            // bg: mode('gray.600', 'gray.600'),
            // color: 'white',
            bg: mode('gray.50', 'gray.600'),
            boxShadow: 'md',
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
                    borderRadius={'lg'} bg={mode('#EFEEEE', 'gray.800')} py={'2px'}
                >
                    <Tab sx={tabStyle}>Deposit</Tab>
                    <Tab sx={tabStyle}>Withdraw</Tab>
                </TabList>

                <TabPanels>
                    {/* Deposit Liquidity */}
                    <TabPanel px={0} pb={0}>
                        <DepositSingleTokenType />
                    </TabPanel>

                    {/* Withdraw Liquidity */}
                    <TabPanel px={0} pb={0}>
                        <WithdrawSingleTokenType />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    )
}
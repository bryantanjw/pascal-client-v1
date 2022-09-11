import { 
    Stack,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Text,
    Flex,
    useColorModeValue as mode,
} from "@chakra-ui/react"
import { DepositSingleTokenType } from "./Deposit"
import { WithdrawSingleTokenType } from "./Withdraw"
import { PublicKey } from '@solana/web3.js'
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { poolMint } from "utils/constants"
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { PoolTooltip } from "./LiquidityInfo"

export const TokenSwapForm = () => {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const [accountLiquidity, setAccountLiquidity] = useState<any>(0)

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
            bg: mode('white', 'gray.600'),
            boxShadow: 'md',
        }
    }
    const textStyle = {
        fontWeight: 'medium',
        fontSize: 'sm',
        
    }
    function blurChange() {
        let blur
        if (publicKey) {
            blur = 'blur(0px)'
        } else {
            blur = 'blur(2px)'
        }
        return blur
    }
    // Style config //

    //  derive the wallet's associated token address.
    async function findAssociatedTokenAddress(
        walletAddress: PublicKey,
        tokenMintAddress: PublicKey
    ): Promise<PublicKey> {
        const associatedAddress = (await PublicKey.findProgramAddress(
            [
                walletAddress.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                tokenMintAddress.toBuffer(),
            ],
            ASSOCIATED_TOKEN_PROGRAM_ID
        )
        )[0]
        console.log("User's associated token address", associatedAddress.toBase58())

        return associatedAddress
    }
    
    useEffect(() => {
        if (!publicKey) {
            return
        }
        const fetchPoolBalance = async () => {
            try {
                const address = await findAssociatedTokenAddress(publicKey, poolMint)
                const balance = (await connection.getTokenAccountBalance(address)).value.uiAmount

                setAccountLiquidity(balance?.toLocaleString())
            } catch (err) {
                console.log(err)
                setAccountLiquidity(0)
            }
        }

        fetchPoolBalance()
    }, [connection, publicKey])

    return (
        <Stack spacing={7}>
            <PoolTooltip publicKey={publicKey} label={'Connect wallet to view liquidity'}>
                <Stack spacing={3} filter={blurChange()} transition={'all .2s ease'} cursor={publicKey ? 'auto': 'not-allowed'}>
                    <Flex justify={'space-between'}>
                        <Text sx={textStyle} color={mode('gray.600', 'gray.400')}>Your Liquidity</Text>
                        <Text sx={textStyle}>{accountLiquidity} LP</Text>
                    </Flex>
                    <Flex justify={'space-between'}>
                        <Text sx={textStyle} color={mode('gray.600', 'gray.400')}>Your Earnings</Text>
                        <Text sx={textStyle}># USDC</Text>
                    </Flex>
                </Stack>
            </PoolTooltip>

            <Tabs variant={'unstyled'}>
                <TabList 
                    borderRadius={'lg'} bg={mode('#EFEEEE', 'gray.800')} py={'2px'}
                >
                    <Tab sx={tabStyle}>Deposit</Tab>
                    <Tab sx={tabStyle}>Withdraw</Tab>
                </TabList>

                <TabPanels minWidth={{ 'base': '300px', 'md': 'full' }}>
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
import {
    Box,
    Button,
    FormControl,
    NumberInput, NumberInputField,
    Text,
    useColorModeValue as mode,
    Alert,
    HStack,
    Link,
    useToast,
} from "@chakra-ui/react"
import { WarningTwoIcon, ExternalLinkIcon } from "@chakra-ui/icons"
import { useFormik } from 'formik'
import { FC, useState } from "react"
import * as Web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
    kryptMint,
    ScroogeCoinMint,
    tokenSwapStateAccount,
    swapAuthority,
    poolKryptAccount,
    poolScroogeAccount,
    poolMint,
    tokenAccountPool,
} from "../../utils/constants"
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap"
import * as token from "@solana/spl-token"
import { MarketLiquidityInfo, PoolTooltip } from "./LiquidityInfo"
import styles from '../../styles/Home.module.css'

export const DepositSingleTokenType: FC = (props: {
    onInputChange?: (val: number) => void
    onMintChange?: (account: string) => void
}) => {
    const [poolTokenAmount, setAmount] = useState(0)

    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    // Handle deposit form submit
    const toast = useToast()
    const formik = useFormik({
        initialValues: {
            depositAmount: '',
        },
        onSubmit: (values, actions) => {
            actions.setSubmitting(true)
            handleTransactionSubmit();
            actions.setSubmitting(false);
        },
    })

    const handleTransactionSubmit = async () => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }

        const poolMintInfo = await token.getMint(connection, poolMint)

        const kryptATA = await token.getAssociatedTokenAddress(
            kryptMint,
            publicKey
        )
        const scroogeATA = await token.getAssociatedTokenAddress(
            ScroogeCoinMint,
            publicKey
        )
        const tokenAccountPool = await token.getAssociatedTokenAddress(
            poolMint,
            publicKey
        )

        const transaction = new Web3.Transaction()

        let account = await connection.getAccountInfo(tokenAccountPool)

        if (account == null) {
            const createATAInstruction =
                token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    tokenAccountPool,
                    publicKey,
                    poolMint
                )
            transaction.add(createATAInstruction)
        }

        const instruction = TokenSwap.depositAllTokenTypesInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            publicKey, // userTransferAuthority
            kryptATA, // user token A account to transfer tokens into the swap pool token A account
            scroogeATA, // user token B account to transfer tokens into the swap pool token B account
            poolKryptAccount, // swap pool token account A to receive user's token A
            poolScroogeAccount, // swap pool token account B to receive user's token B
            poolMint, // LP-token mint address
            tokenAccountPool, // user LP-token account the swap pool mints LP-token to
            TOKEN_SWAP_PROGRAM_ID, // address of the Token Swap Program
            token.TOKEN_PROGRAM_ID, // address of the Token Program
            poolTokenAmount * 10 ** poolMintInfo.decimals, // amount of LP-token the depositor expects to receive
            100e9, // maximum amount of token A allowed to deposit (prevent slippage)
            100e9 // maximum amount of token B allowed to deposit (prevent slippage)
        )

        transaction.add(instruction)
        try {
            let txid = await sendTransaction(transaction, connection)
            console.log(
                `Transaction submitted: https://solscan.io/tx/${txid}?cluster=devnet`
            )
            toast({
                title: "Transaction submitted",
                description: 
                    <Link href={`https://solscan.io/tx/${txid}?cluster=devnet`} isExternal>
                        <HStack>
                            <Text>View transaction</Text>
                            <ExternalLinkIcon />
                        </HStack>
                    </Link>,
                position: "bottom-right",
                isClosable: true,
                duration: 8000,
                status: 'success',
                containerStyle: { marginBottom: '25px'},
            })
        } catch (e) {
            toast({
                title: 'Transaction failed',
                description: JSON.stringify(e.message),
                position: "bottom-right",
                isClosable: true,
                duration: 8000,
                status: 'error',
                containerStyle: { marginBottom: '25px'},
            })
            console.log(JSON.stringify(e))
        }
    }

    return (
        <Box>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <NumberInput onChange={(valueString) => setAmount(parseInt(valueString))}>
                        <NumberInputField id="amount" value={formik.values.depositAmount}
                            fontWeight={'medium'} 
                            placeholder="Enter amount to deposit" 
                            fontSize={'sm'}
                        />
                    </NumberInput>

                    <MarketLiquidityInfo 
                        connection={connection}
                        poolAccountA={poolKryptAccount} 
                        poolAccountB={poolScroogeAccount}
                        tokenAccountPool={tokenAccountPool}
                        TOKEN_SWAP_PROGRAM_ID={TOKEN_SWAP_PROGRAM_ID}
                    />
                    
                    <Alert bg={mode('blue.50', 'blue.900')} fontSize={'xs'} rounded={'md'} 
                        px={4} flexDirection={'column'}>
                        <WarningTwoIcon alignSelf={'start'} mb={2}/>
                        Providing liquidity is risky. 
                        It is important to withdraw liquidity before the event occurs.
                    </Alert>

                    <PoolTooltip publicKey={publicKey} label={'Connect wallet to deposit'}>
                        <Button type={'submit'} isLoading={formik.isSubmitting} isDisabled={!publicKey}
                            className={
                                mode(styles.wallet_adapter_button_trigger_light_mode, 
                                    styles.wallet_adapter_button_trigger_dark_mode
                                )
                            } 
                            size="lg" mt={5} textColor={mode('white', '#353535')} bg={mode('#353535', 'gray.50')} 
                            width={'full'}
                            boxShadow={'xl'}
                        >
                            Add liquidity
                        </Button>
                    </PoolTooltip>
                </FormControl>
            </form>
        </Box>
    )
}
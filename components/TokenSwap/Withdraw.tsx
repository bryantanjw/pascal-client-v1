import {
    Box,
    Button,
    FormControl,
    NumberInput, NumberInputField,
    Stack,
    useColorModeValue as mode,
    useToast,
    Alert,
} from "@chakra-ui/react"
import { WarningTwoIcon } from "@chakra-ui/icons"
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
    feeAccount,
} from "../../utils/constants"
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap"
import * as token from "@solana/spl-token"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { LiquidityInfo } from "./Deposit"
import styles from '../../styles/Home.module.css'

export const WithdrawSingleTokenType: FC = (props: {
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
            withdrawAmount: '',
        },
        onSubmit: values => {
            handleTransactionSubmit();
            setAmount(parseInt(values.withdrawAmount))
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

        const instruction = TokenSwap.withdrawAllTokenTypesInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            publicKey, // userTransferAuthority
            poolMint, // LP-token mint address
            feeAccount, // token account which receives the owner withdraw fees
            tokenAccountPool, // user LP-token account to burn pool tokens LP-token from
            poolKryptAccount, // swap pool token A account to withdraw from
            poolScroogeAccount, // swap pool token B account to withdraw from
            kryptATA, // user token A account to receive tokens withdrawn from swap pool token A account
            scroogeATA, // user token B account to receive tokens withdrawn from swap pool token B account
            TOKEN_SWAP_PROGRAM_ID, // address of the Token Swap Program
            TOKEN_PROGRAM_ID, // address of the Token Program
            poolTokenAmount * 10 ** poolMintInfo.decimals, // amount of LP-tokens the user expects to burn on withdraw
            0, // minimum amount of token A to withdraw (prevent slippage)
            0 // minimum amount of token A to withdraw (prevent slippage)
        )

        transaction.add(instruction)
        try {
            let txid = await sendTransaction(transaction, connection)
            toast({
                title: `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
                position: "bottom-right",
                isClosable: true,
                duration: 8000,
                status: 'success',
            })
            console.log(
                `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
            )
        } catch (e) {
            toast({
                title: 'Transaction failed',
                description: JSON.stringify(e),
                position: "bottom-right",
                isClosable: true,
                duration: 8000,
                status: 'error',
            })
            console.log(JSON.stringify(e))
        }
    }

    return (
        <Box>
            <form onSubmit={formik.handleSubmit}>
                <NumberInput>
                    <NumberInputField id="amount" fontWeight={'medium'} 
                        placeholder="Enter amount to withdraw" fontSize={'sm'}
                        onChange={formik.handleChange}
                        value={formik.values.withdrawAmount}
                    />
                </NumberInput>


                <Stack my={3} spacing={3} p={4} borderWidth={"1px"} rounded={'md'}>
                    <LiquidityInfo label={'Pool Liquidity (YES)'} value={'#'} />
                    <LiquidityInfo label={'Pool Liquidity (NO)'} value={'#'} />
                    <LiquidityInfo label={'LP Supply'} value={'#'} />
                    <LiquidityInfo label={'Slippage'} value={'1%'} />
                </Stack>

                <Button type={"submit"}
                    className={
                        mode(styles.wallet_adapter_button_trigger_light_mode, 
                            styles.wallet_adapter_button_trigger_dark_mode
                        )
                    } 
                    size="lg" mt={3} textColor={mode('white', '#353535')} bg={mode('#353535', 'gray.50')} 
                    width={'full'}
                    boxShadow={'xl'}
                >
                    Remove liquidity
                </Button>
            </form>
        </Box>
    )
}
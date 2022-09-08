import {
    Box,
    Button,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
} from "@chakra-ui/react"
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
} from "../../utils/constants"
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap"
import * as token from "@solana/spl-token"

export const DepositSingleTokenType: FC = (props: {
    onInputChange?: (val: number) => void
    onMintChange?: (account: string) => void
}) => {
    const [poolTokenAmount, setAmount] = useState(0)

    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    const handleSubmit = (event: any) => {
        event.preventDefault()
        handleTransactionSubmit()
    }

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
            alert(
                `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
            )
            console.log(
                `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
            )
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }

    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            margin={2}
            justifyContent="center"
        >
            <form onSubmit={handleSubmit}>
                <div style={{ padding: "0px 10px 5px 7px" }}>
                    <FormControl isRequired>
                        <FormLabel color="gray.200">
                            LP-Tokens to receive for deposit to Liquidity Pool
                        </FormLabel>
                        <NumberInput
                            onChange={(valueString) =>
                                setAmount(parseInt(valueString))
                            }
                            style={{
                                fontSize: 20,
                            }}
                            placeholder="0.00"
                        >
                            <NumberInputField id="amount" color="gray.400" />
                        </NumberInput>
                        <Button width="full" mt={4} type="submit">
                            Deposit
                        </Button>
                    </FormControl>
                </div>
            </form>
        </Box>
    )
}
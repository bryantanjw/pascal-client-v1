import {
    Box,
    Button,
    FormControl,
    NumberInput, NumberInputField,
    Stack,
    Flex,
    Text,
    useColorModeValue as mode,
    Alert,
    HStack,
    Code,
    Link,
    Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody,
    useClipboard,
    useToast,
} from "@chakra-ui/react"
import { InfoOutlineIcon, WarningTwoIcon, ExternalLinkIcon } from "@chakra-ui/icons"
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
import styles from '../../styles/Home.module.css'

export const LiquidityInfo = (props) => {
    const { label, value, children } = props
    return (
      <Flex justify="space-between" fontSize="xs">
        <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
            {label}
        </Text>
            {value ? <Text fontWeight="medium">{value}</Text> : children}
      </Flex>
    )
}

const AddressesInfo = (props) => {
    const toast = useToast()
    const { label, value, link } = props
    const { hasCopied, onCopy } = useClipboard(value)

    return (
        <Stack>
            <HStack spacing={3}>
                <Text>{label}</Text>
                <Code onClick={() => {
                    onCopy
                    toast({
                        title: 'Address copied to clipboard.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    })              
                }} cursor={'pointer'}>{value}</Code>
                <Link href={link} isExternal><ExternalLinkIcon /></Link>
            </HStack>
        </Stack>
    )
}

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
        <Box>
            <FormControl onSubmit={handleSubmit}>
                <NumberInput
                    onChange={(valueString) =>
                        setAmount(parseInt(valueString))
                    }
                >
                    <NumberInputField id="amount" fontWeight={'medium'} 
                        placeholder="Enter amount to deposit" fontSize={'sm'} 
                    />
                </NumberInput>

                <Stack my={3} spacing={3} p={4} borderWidth={"1px"} rounded={'md'}>
                    <LiquidityInfo label={'Pool Liquidity (YES)'} value={'#'} />
                    <LiquidityInfo label={'Pool Liquidity (NO)'} value={'#'} />
                    <LiquidityInfo label={'LP Supply'} value={'#'} />
                    <LiquidityInfo label={'Addresses'}>
                        <Popover placement="bottom-end" isLazy>
                            <PopoverTrigger><InfoOutlineIcon cursor={'help'} /></PopoverTrigger>
                            <PopoverContent width={'full'}>
                                <PopoverHeader fontSize={'sm'}>Addresses</PopoverHeader>
                                <PopoverBody>
                                    <Stack p={2}>
                                        <AddressesInfo label={"YES"} value={'#'} link={'#'} />
                                        <AddressesInfo label={"NO"} value={'#'} link={'#'} />
                                        <AddressesInfo label={"LP"} value={"#"} link={"#"} />
                                        <AddressesInfo label={"AMM ID"} value={"#"} link={"#"} />
                                        <AddressesInfo label={"Market ID"} value={"#"} link={"#"} />
                                    </Stack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </LiquidityInfo>
                    <LiquidityInfo label={'Slippage'} value={'1%'} />
                </Stack>

                <Alert bg={mode('blue.50', 'blue.900')} fontSize={'xs'} rounded={'md'} 
                    px={4} flexDirection={'column'}>
                    <WarningTwoIcon alignSelf={'start'} mb={2}/>
                    Providing liquidity is risky. 
                    It is important to withdraw liquidity before the event occurs.
                </Alert>

                <Button 
                    className={
                        mode(styles.wallet_adapter_button_trigger_light_mode, 
                            styles.wallet_adapter_button_trigger_dark_mode
                        )
                    } 
                    size="lg" 
                    mt={5} 
                    textColor={mode('white', '#353535')} 
                    bg={mode('#353535', 'gray.50')} 
                    width={'full'}
                >
                    Add liquidity
                </Button>
            </FormControl>
        </Box>
    )
}
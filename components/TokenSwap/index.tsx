import { 
    Stack,
    Heading,
} from "@chakra-ui/react"
import { Airdrop } from "./AirdropForm"
import { DepositSingleTokenType } from "./Deposit"
import { WithdrawSingleTokenType } from "./Withdraw"
import { SwapToken } from "./Swap"

const TokenSwapForm = () => {
    return (
        <Stack mt={8} spacing="8" borderWidth="1px" rounded="lg" padding="6" 
            width={{'base': 's', 'md': 'xs'}}
        >
            <Heading fontSize={'xl'}>Token Swap Form</Heading>
            {/* <Airdrop />
            <DepositSingleTokenType />
            <WithdrawSingleTokenType />
            <SwapToken /> */}
        </Stack>
    
    )
}

export default TokenSwapForm
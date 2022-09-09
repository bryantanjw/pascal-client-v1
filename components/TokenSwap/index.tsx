import { Stack } from "@chakra-ui/react"
import { DepositSingleTokenType } from "./Deposit"
import { WithdrawSingleTokenType } from "./Withdraw"

export const TokenSwapForm = () => {
    return (
        <Stack spacing={8}>
            <DepositSingleTokenType />
        </Stack>
    )
}
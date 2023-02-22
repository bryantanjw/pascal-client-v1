import {
  Box,
  Button,
  Input,
  ScaleFade,
  HStack,
  useColorModeValue as mode,
  useToast,
  Link,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CheckIcon } from "@chakra-ui/icons";
import { Formik } from "formik";
import { FC, useState } from "react";
import * as Web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  kryptMint,
  ScroogeCoinMint,
  tokenSwapStateAccount,
  swapAuthority,
  poolKryptAccount,
  poolScroogeAccount,
  poolMint,
  feeAccount,
  tokenAccountPool,
} from "../../../../utils/constants";
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { MarketLiquidityInfo, LiquidityTooltip } from "./LiquidityInfo";
import styles from "@/styles/Home.module.css";

export const WithdrawSingleTokenType: FC = (props: {
  onInputChange?: (val: number) => void;
  onMintChange?: (account: string) => void;
}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  // Handle withdraw form submit
  const toast = useToast();

  const handleTransactionSubmit = async (withdrawPoolTokenAmount) => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const poolMintInfo = await token.getMint(connection, poolMint);

    const kryptATA = await token.getAssociatedTokenAddress(
      kryptMint,
      publicKey
    );
    const scroogeATA = await token.getAssociatedTokenAddress(
      ScroogeCoinMint,
      publicKey
    );
    const tokenAccountPool = await token.getAssociatedTokenAddress(
      poolMint,
      publicKey
    );

    const transaction = new Web3.Transaction();

    let account = await connection.getAccountInfo(tokenAccountPool);

    if (account == null) {
      const createATAInstruction =
        token.createAssociatedTokenAccountInstruction(
          publicKey,
          tokenAccountPool,
          publicKey,
          poolMint
        );
      transaction.add(createATAInstruction);
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
      withdrawPoolTokenAmount * 10 ** poolMintInfo.decimals, // amount of LP-tokens the user expects to burn on withdraw
      0, // minimum amount of token A to withdraw (prevent slippage)
      0 // minimum amount of token A to withdraw (prevent slippage)
    );

    transaction.add(instruction);
    try {
      setLoading(true);
      let txid = await sendTransaction(transaction, connection);
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      toast({
        title: "Transaction submitted",
        description: (
          <Link
            href={`https://solscan.io/tx/${txid}?cluster=devnet`}
            isExternal
          >
            <HStack>
              <Text>View transaction</Text>
              <ExternalLinkIcon />
            </HStack>
          </Link>
        ),
        position: "top",
        isClosable: true,
        duration: 8000,
        status: "success",
        containerStyle: { marginBottom: "50px" },
      });
      setSuccess(true);
    } catch (e) {
      toast({
        title: "Transaction failed",
        description: JSON.stringify(e.message),
        position: "top",
        isClosable: true,
        duration: 8000,
        status: "error",
        containerStyle: { marginBottom: "50px" },
      });
      setSuccess(false);
      console.log(JSON.stringify(e));
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <Box>
      <Formik
        initialValues={{ withdrawAmount: "" }}
        onSubmit={(values) => {
          handleTransactionSubmit(values.withdrawAmount);
          setTimeout(() => {
            setSuccess(false);
          }, 6000);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Input
              type="number"
              name="withdrawAmount"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.withdrawAmount}
              boxShadow="sm"
              placeholder="Enter amount to withdraw"
              autoComplete="off"
              rounded={"xl"}
              bg={mode("rgba(236, 240, 241, 0.2)", "rgba(33, 47, 61, 0.2)")}
            />

            <MarketLiquidityInfo
              connection={connection}
              poolAccountA={poolKryptAccount}
              poolAccountB={poolScroogeAccount}
              tokenAccountPool={tokenAccountPool}
              TOKEN_SWAP_PROGRAM_ID={TOKEN_SWAP_PROGRAM_ID}
            />

            <LiquidityTooltip
              publicKey={publicKey}
              label={"Connect wallet to withdraw"}
            >
              <Button
                type={"submit"}
                isLoading={isLoading}
                isDisabled={!publicKey || !values.withdrawAmount}
                className={mode(
                  styles.wallet_adapter_button_trigger_light_mode,
                  styles.wallet_adapter_button_trigger_dark_mode
                )}
                size="lg"
                mt={5}
                textColor={mode("white", "#353535")}
                bg={mode("#353535", "gray.50")}
                width={"full"}
                boxShadow={"xl"}
                rounded={"xl"}
              >
                <ScaleFade initialScale={0.5} in={true}>
                  {isSuccess ? (
                    <CheckIcon />
                  ) : (
                    <ScaleFade initialScale={0.5} in={true}>
                      Remove liquidity
                    </ScaleFade>
                  )}
                </ScaleFade>
              </Button>
            </LiquidityTooltip>
          </form>
        )}
      </Formik>
    </Box>
  );
};

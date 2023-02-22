import {
  Box,
  Button,
  Text,
  useColorModeValue as mode,
  Alert,
  HStack,
  Link,
  useToast,
  Input,
  ScaleFade,
} from "@chakra-ui/react";
import { WarningTwoIcon, ExternalLinkIcon, CheckIcon } from "@chakra-ui/icons";
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
  tokenAccountPool,
} from "../../../../utils/constants";
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
import { MarketLiquidityInfo, LiquidityTooltip } from "./LiquidityInfo";
import styles from "@/styles/Home.module.css";

export const DepositSingleTokenType: FC = (props: {
  onInputChange?: (val: number) => void;
  onMintChange?: (account: string) => void;
}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  const toast = useToast();

  const handleTransactionSubmit = async (depositPoolTokenAmount) => {
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
      depositPoolTokenAmount * 10 ** poolMintInfo.decimals, // amount of LP-token the depositor expects to receive
      100e9, // maximum amount of token A allowed to deposit (prevent slippage)
      100e9 // maximum amount of token B allowed to deposit (prevent slippage)
    );
    transaction.add(instruction);

    try {
      setLoading(true);
      let txid = await sendTransaction(transaction, connection);

      console.log(
        `Transaction submitted: https://solscan.io/tx/${txid}?cluster=devnet`
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
        variant: "subtle",
        containerStyle: { marginTop: "75px", marginBottom: "-65px" },
      });
      setSuccess(true);
    } catch (e) {
      setSuccess(false);
      toast({
        title: "Transaction failed",
        description: JSON.stringify(e.message).replace(/^"(.*)"$/, "$1"),
        position: "top",
        isClosable: true,
        duration: 8000,
        status: "error",
        variant: "subtle",
        containerStyle: { marginTop: "75px", marginBottom: "-65px" },
      });
      console.log(JSON.stringify(e));
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <Box>
      <Formik
        initialValues={{ depositAmount: "" }}
        onSubmit={(values) => {
          handleTransactionSubmit(values.depositAmount);
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
              name="depositAmount"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.depositAmount}
              boxShadow="sm"
              placeholder="Enter amount to deposit"
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
              isSubmitted={isSubmitted}
            />

            <Alert
              bg={mode("blue.50", "blue.900")}
              fontSize={"xs"}
              rounded={"xl"}
              px={4}
              flexDirection={{ base: "row", lg: "column" }}
            >
              <WarningTwoIcon alignSelf={"start"} mb={2} mr={4} />
              Providing liquidity is risky. It is important to withdraw
              liquidity before the event occurs.
            </Alert>

            <LiquidityTooltip
              publicKey={publicKey}
              label={"Connect wallet to deposit"}
            >
              <Button
                type={"submit"}
                isLoading={isLoading}
                isDisabled={!publicKey || !values.depositAmount}
                className={mode(
                  styles.wallet_adapter_button_trigger_light_mode,
                  styles.wallet_adapter_button_trigger_dark_mode
                )}
                size="lg"
                mt={5}
                textColor={mode("white", "#353535")}
                bg={mode("#353535", "gray.50")}
                width={"100%"}
                boxShadow={"xl"}
                rounded={"xl"}
              >
                <ScaleFade initialScale={0.5} in={true}>
                  {isSuccess ? (
                    <CheckIcon />
                  ) : (
                    <ScaleFade initialScale={0.5} in={true}>
                      Add liquidity
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

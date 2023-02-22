import {
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Flex,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { DepositSingleTokenType } from "./Deposit";
import { WithdrawSingleTokenType } from "./Withdraw";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { poolMint } from "utils/constants";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { LiquidityTooltip } from "./LiquidityInfo";

//  derive the wallet's associated token address.
export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  const associatedAddress = (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];

  return associatedAddress;
}

export const TokenSwapForm = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [accountLiquidity, setAccountLiquidity] = useState<any>(0);

  // Style config //
  const tabStyle = {
    flex: 1,
    color: "gray.500",
    rounded: "xl",
    fontSize: "sm",
    mx: "2px",
    fontWeight: "semibold",
    transition: "all .2s ease",
    _hover: { bg: mode("blackAlpha.50", "whiteAlpha.50") },
    _selected: {
      bg: mode("white", "gray.600"),
      textColor: mode("gray.700", "white"),
      boxShadow: mode("0px 2px 8px 0px #0000001a", "1px 2px 8px 5px #0000001a"),
    },
  };
  const textStyle = {
    fontWeight: "medium",
    fontSize: "sm",
  };
  // Style config //

  useEffect(() => {
    if (!publicKey) {
      setAccountLiquidity(0);
      return;
    }
    const fetchUserPoolBalance = async () => {
      try {
        const address = await findAssociatedTokenAddress(publicKey, poolMint);
        const balance = (await connection.getTokenAccountBalance(address)).value
          .uiAmount;

        setAccountLiquidity(balance?.toLocaleString());
      } catch (err) {
        setAccountLiquidity(0);
      }
    };

    fetchUserPoolBalance();

    const interval = setInterval(() => {
      fetchUserPoolBalance();
    }, 15000);
    return () => clearInterval(interval);
  }, [connection, publicKey]);

  return (
    <Stack spacing={5}>
      <LiquidityTooltip
        publicKey={publicKey}
        label={"Connect wallet to view liquidity"}
      >
        <Stack
          spacing={2}
          transition={"all .2s ease"}
          cursor={publicKey ? "auto" : "not-allowed"}
        >
          <Flex justify={"space-between"}>
            <Text sx={textStyle} color={mode("gray.600", "gray.400")}>
              Your Liquidity
            </Text>
            <Text sx={textStyle}>{accountLiquidity} LP</Text>
          </Flex>

          <Flex justify={"space-between"}>
            <Text sx={textStyle} color={mode("gray.600", "gray.400")}>
              Your Earnings
            </Text>
            <Text sx={textStyle}>0 USD</Text>
          </Flex>
        </Stack>
      </LiquidityTooltip>

      <Tabs variant={"unstyled"}>
        <TabList
          bg={mode("#EFEEEE", "rgb(26,32,44, 0.7)")}
          py={"2px"}
          borderRadius={"xl"}
          borderWidth={1}
          borderColor={"transparent"}
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
  );
};

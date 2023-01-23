import {
  Box,
  Select,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
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
} from "@/utils/constants";
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const SwapToken: FC = () => {
  const [amount, setAmount] = useState(0);
  const [mint, setMint] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSwapSubmit = (event: any) => {
    event.preventDefault();
    handleTransactionSubmit();
  };

  const handleTransactionSubmit = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const kryptMintInfo = await token.getMint(connection, kryptMint);
    const ScroogeCoinMintInfo = await token.getMint(
      connection,
      ScroogeCoinMint
    );

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

    if (mint == "option1") {
      const instruction = TokenSwap.swapInstruction(
        tokenSwapStateAccount,
        swapAuthority,
        publicKey, // userTransferAuthority
        kryptATA, // user token account to transfer tokens into the swap
        poolKryptAccount, // swap pool token account to receive tokens transferred from the user
        poolScroogeAccount, // swap pool token account to send tokens to the user
        scroogeATA, // user token account to receive tokens sent from the swap pool
        poolMint, // LP-token mint address
        feeAccount, // token account which receives the owner trade fees
        null, // the token account which receives the host trade fees (optional)
        TOKEN_SWAP_PROGRAM_ID, // address of the Token Swap Program
        TOKEN_PROGRAM_ID, // address of the Token Program
        amount * 10 ** kryptMintInfo.decimals, // amount of tokens the user wants to transfer to the swap pool
        0 // minimum amount of tokens send to the user token account.
        // This parameter is used to account for slippage. The lower the number, the more slippage can possible occur without the transaction failing.
        // In a production app, it's important to let users specify the amount of slippage they're comfortable with.
      );

      transaction.add(instruction);
    } else if (mint == "option2") {
      const instruction = TokenSwap.swapInstruction(
        tokenSwapStateAccount,
        swapAuthority,
        publicKey,
        scroogeATA,
        poolScroogeAccount,
        poolKryptAccount,
        kryptATA,
        poolMint,
        feeAccount,
        null,
        TOKEN_SWAP_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        amount * 10 ** ScroogeCoinMintInfo.decimals,
        0
      );

      transaction.add(instruction);
    }

    try {
      let txid = await sendTransaction(transaction, connection);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (e) {
      console.log(JSON.stringify(e));
      alert(JSON.stringify(e));
    }
  };

  return (
    <Box>
      <form onSubmit={handleSwapSubmit}>
        <FormControl isRequired>
          <FormLabel>Swap Amount</FormLabel>
          <NumberInput
            max={1000}
            min={1}
            onChange={(valueString) => setAmount(parseInt(valueString))}
          >
            <NumberInputField id="amount" />
          </NumberInput>
          <div style={{ display: "felx" }}>
            <Select
              display={{ md: "flex" }}
              justifyContent="center"
              placeholder="Token to Swap"
              variant="outline"
              dropShadow="#282c34"
              onChange={(item) => setMint(item.currentTarget.value)}
            >
              <option value="option1"> Krypt </option>
              <option value="option2"> Scrooge </option>
            </Select>
          </div>
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Swap ⇅
        </Button>
      </form>
    </Box>
  );
};

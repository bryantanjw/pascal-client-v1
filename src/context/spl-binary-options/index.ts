import assert from "assert";
import { splBinaryOptionProgram } from "./program";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Connection,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  createMint,
} from "@solana/spl-token";
import { BN } from "@project-serum/anchor";

import { splTokenProgram } from "../spl-token";
import { SPL_BINARY_OPTION_PROGRAM_ID } from "@/utils/constants";

import { getProvider, loadKp, test } from "@/utils/solana";

let poolPk: PublicKey;
let escrowPk: PublicKey;
let escrowMintPk: PublicKey;
let longTokenMintPk: PublicKey;
let shortTokenMintPk: PublicKey;
let escrowAuthorityPk: PublicKey;
let buyerPk: PublicKey;
let sellerPk: PublicKey;
let buyerAccountPk: PublicKey;
let sellerAccountPk: PublicKey;
let buyerLongTokenAccountPk: PublicKey;
let buyerShortTokenAccountPk: PublicKey;
let sellerLongTokenAccountPk: PublicKey;
let sellerShortTokenAccountPk: PublicKey;

export async function initializeBinaryOption(provider, kp) {
  const binaryOptionProgram = splBinaryOptionProgram({
    provider,
    programId: SPL_BINARY_OPTION_PROGRAM_ID,
  });
  const tokenProgram = splTokenProgram({
    provider,
    programId: TOKEN_PROGRAM_ID,
  });

  const poolKp = new Keypair();
  const longEscrowKp = new Keypair();
  const longMintKp = new Keypair();
  const shortMintKp = new Keypair();

  poolPk = poolKp.publicKey;
  escrowPk = longEscrowKp.publicKey;
  escrowMintPk = await createMint(
    provider.connection,
    kp,
    kp.publicKey,
    kp.publicKey,
    0
  );
  console.log("Escrow Mint created: ", escrowMintPk.toBase58());
  longTokenMintPk = longMintKp.publicKey;
  shortTokenMintPk = shortMintKp.publicKey;

  escrowAuthorityPk = (
    await PublicKey.findProgramAddress(
      [
        longTokenMintPk.toBuffer(),
        shortTokenMintPk.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        SPL_BINARY_OPTION_PROGRAM_ID.toBuffer(),
      ],
      SPL_BINARY_OPTION_PROGRAM_ID
    )
  )[0];

  await binaryOptionProgram.methods
    .initializeBinaryOption(2)
    .accounts({
      poolAccount: poolPk,
      escrowMint: escrowMintPk,
      escrowAccount: escrowPk,
      longTokenMint: longTokenMintPk,
      shortTokenMint: shortTokenMintPk,
      mintAuthority: kp.publicKey,
      updateAuthority: kp.publicKey,
      tokenProgram: tokenProgram.programId,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .signers([kp, poolKp, longEscrowKp, longMintKp, shortMintKp])
    .rpc();
}

export async function trade(provider, kp) {
  const binaryOptionProgram = splBinaryOptionProgram({
    provider,
    programId: SPL_BINARY_OPTION_PROGRAM_ID,
  });
  const tokenProgram = splTokenProgram({
    provider,
    programId: TOKEN_PROGRAM_ID,
  });

  const buyerKp = new Keypair();
  const sellerKp = new Keypair();

  buyerPk = buyerKp.publicKey;
  sellerPk = sellerKp.publicKey;

  buyerAccountPk = (
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      kp,
      escrowMintPk,
      buyerPk
    )
  ).address;
  sellerAccountPk = (
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      kp,
      escrowMintPk,
      sellerPk
    )
  ).address;
  buyerLongTokenAccountPk = (
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      kp,
      longTokenMintPk,
      buyerPk
    )
  ).address;
  buyerShortTokenAccountPk = (
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      kp,
      shortTokenMintPk,
      buyerPk
    )
  ).address;
  sellerLongTokenAccountPk = (
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      kp,
      longTokenMintPk,
      sellerPk
    )
  ).address;
  sellerShortTokenAccountPk = (
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      kp,
      shortTokenMintPk,
      sellerPk
    )
  ).address;

  const size = 10;
  const buyPrice = 30;
  const sellPrice = 70;
  const buyAmount = size * buyPrice;
  const sellAmount = size * sellPrice;
  const transaction = new Transaction();

  const mintBuyerIx = await tokenProgram.methods
    .mintTo(new BN(buyAmount))
    .accounts({
      account: buyerAccountPk,
      mint: escrowMintPk,
      owner: kp.publicKey,
    })
    .instruction();
  transaction.add(mintBuyerIx);

  const mintSellerIx = await tokenProgram.methods
    .mintTo(new BN(sellAmount))
    .accounts({
      account: sellerAccountPk,
      mint: escrowMintPk,
      owner: kp.publicKey,
    })
    .instruction();
  transaction.add(mintSellerIx);

  const tradeIx = await binaryOptionProgram.methods
    .trade(new BN(size), new BN(buyPrice), new BN(sellPrice))
    .accounts({
      poolAccount: poolPk,
      escrowAccount: escrowPk,
      longTokenMint: longTokenMintPk,
      shortTokenMint: shortTokenMintPk,
      buyer: buyerPk,
      seller: sellerPk,
      buyerAccount: buyerAccountPk,
      sellerAccount: sellerAccountPk,
      buyerLongTokenAccount: buyerLongTokenAccountPk,
      buyerShortTokenAccount: buyerShortTokenAccountPk,
      sellerLongTokenAccount: sellerLongTokenAccountPk,
      sellerShortTokenAccount: sellerShortTokenAccountPk,
      escrowAuthority: escrowAuthorityPk,
      tokenProgram: tokenProgram.programId,
    })
    .signers([kp, buyerKp, sellerKp])
    .instruction();
  transaction.add(tradeIx);

  const signature = await sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [kp, buyerKp, sellerKp]
  );
  console.log("Trade tx: ", signature);
}

export async function settle(provider, kp) {
  const binaryOptionProgram = splBinaryOptionProgram({
    provider,
    programId: SPL_BINARY_OPTION_PROGRAM_ID,
  });
  await binaryOptionProgram.methods
    .settle()
    .accounts({
      poolAccount: poolPk,
      winningMint: longTokenMintPk,
      poolAuthority: kp.publicKey,
    })
    .rpc();
}

export async function collect(provider) {
  const binaryOptionProgram = splBinaryOptionProgram({
    provider,
    programId: SPL_BINARY_OPTION_PROGRAM_ID,
  });
  const tokenProgram = splTokenProgram({
    provider,
    programId: TOKEN_PROGRAM_ID,
  });

  await binaryOptionProgram.methods
    .collect()
    .accounts({
      poolAccount: poolPk,
      collectorAccount: buyerPk,
      collectorLongTokenAccount: buyerLongTokenAccountPk,
      collectorShortTokenAccount: buyerShortTokenAccountPk,
      collectorCollateralAccount: buyerAccountPk,
      longTokenMintAccount: longTokenMintPk,
      shortTokenMintAccount: shortTokenMintPk,
      escrowAccount: escrowPk,
      escrowAuthorityAccount: escrowAuthorityPk,
      tokenProgram: tokenProgram.programId,
    })
    .rpc();
}

export async function fetchBinaryOption(provider) {
  const binaryOptionProgram = splBinaryOptionProgram({
    provider,
    programId: SPL_BINARY_OPTION_PROGRAM_ID,
  });

  const binaryAccount = await binaryOptionProgram.account.binaryOption.fetch(
    poolPk
  );
  assert(binaryAccount.settled === true);
}

async function main() {
  const provider = await getProvider();
  const binaryOptionProgram = splBinaryOptionProgram({
    provider,
    programId: SPL_BINARY_OPTION_PROGRAM_ID,
  });
  const tokenProgram = splTokenProgram({
    provider,
    programId: TOKEN_PROGRAM_ID,
  });
  const kp = await loadKp();

  // await test(initializeBinaryOption);
  // await test(trade);
  // await test(settle);
  // await test(collect);
  // await test(fetchBinaryOption);
}

import assert from "assert";
import { splBinaryOptionProgram } from "@/context/spl-binary-options/program";
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

import { splTokenProgram } from "@/context/spl-token";
import { SPL_BINARY_OPTION_PROGRAM_ID } from "@/utils/constants";
import { getProcessArgs, getProvider } from "@/utils/solana";
import { getProgram } from "@/utils/monaco";

let poolPk: PublicKey;
let escrowPk: PublicKey;
let escrowMintPk: PublicKey;
let longTokenMintPk: PublicKey;
let shortTokenMintPk: PublicKey;
let escrowAuthorityPk: PublicKey;

async function initializeBinaryOption(provider, kp) {
  const program = await getProgram();
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

// getProcessArgs([], "npm run initializeBinaryOption");
// initializeBinaryOption();

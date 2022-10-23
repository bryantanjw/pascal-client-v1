import * as fs from "fs/promises"
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Signer,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js"
import { AnchorProvider, Wallet } from "@project-serum/anchor"
const KEYPAIR_PATH = "test-keypair.json"

export async function loadKp() {
    try {
      const kpBytes = await fs.readFile(KEYPAIR_PATH)
      const kp = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(kpBytes.toString()))
      )
  
      return kp
    } catch {
      console.log("Creating test keypair file...")
      const randomKp = new Keypair()
      await fs.writeFile(
        KEYPAIR_PATH,
        JSON.stringify(Array.from(randomKp.secretKey))
      )
      return randomKp
    }
}

let hasBalance = false
export async function getProvider() {
  const kp = await loadKp()
  const ENDPOINT = "https://api.devnet.solana.com"
  const connection = new Connection(ENDPOINT, {
    commitment: "confirmed",
  })
  const wallet = new Wallet(kp)

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  )

  if (!hasBalance && !(await provider.connection.getBalance(kp.publicKey))) {
    const txHash = await provider.connection.requestAirdrop(
      kp.publicKey,
      1000 * LAMPORTS_PER_SOL
    )
    await confirmTx(txHash)
    hasBalance = true
  }

  return provider
}

export async function confirmTx(txHash: string) {
  const provider = await getProvider()
  const blockhashInfo = await provider.connection.getLatestBlockhash()
  await provider.connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  })
}

export async function sendAndConfirmTx(
  ixs: TransactionInstruction[],
  signers: Signer[]
) {
  const provider = await getProvider()
  const blockhashInfo = await provider.connection.getLatestBlockhash()
  const tx = new Transaction().add(...ixs)
  tx.feePayer = provider.publicKey
  tx.recentBlockhash = blockhashInfo.blockhash
  tx.sign(...signers)
  const txHash = await provider.connection.sendRawTransaction(tx.serialize())
  await confirmTx(txHash)

  return txHash
}
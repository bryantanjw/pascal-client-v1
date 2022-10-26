import * as fs from "fs/promises"
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL
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
      2 * LAMPORTS_PER_SOL
    )
    await confirmTx(provider, txHash)
    console.log("Wallet pubKey", kp.publicKey.toBase58())
    console.log("Airdrop confirmed. Balance:", await provider.connection.getBalance(kp.publicKey))
    hasBalance = true
  }

  return provider
}

export async function confirmTx(provider: AnchorProvider, txHash: string) {
  const blockhashInfo = await provider.connection.getLatestBlockhash()
  await provider.connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  })
}

export async function test(cb: () => Promise<void>) {
  let testCount = 0
  let errorCount = 0

  const info = (s: string) => {
      console.log(`\x1b[1;36m${s}\x1b[0m`)
  };
    
  const success = (s: string) => {
      console.log(`\x1b[1;32m${s}\x1b[0m`)
  };
    
  const error = (s: string) => {
      console.log(`\x1b[1;31m${s}\x1b[0m`)
  };
  const tab = "      "
  console.log(`${tab}Running test '\x1b[1m${cb.name}\x1b[0m'`)

  try {
    await cb()
    success(`${tab}Test '${cb.name}' passed.`)
  } catch (e) {
    error(`${tab}Test '${cb.name}' failed. Reason: ${e}`)
    errorCount++;
  } finally {
    testCount++;
  }
}
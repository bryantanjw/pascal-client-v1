import { Keypair } from "@solana/web3.js"

const MockWallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
}

export default MockWallet
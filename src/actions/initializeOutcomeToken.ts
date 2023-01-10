import { initializeKeypair } from "./initializeKeypair";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  findMetadataPda,
} from "@metaplex-foundation/js";
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import * as fs from "fs";

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const user = await initializeKeypair(connection);

  console.log("PublicKey:", user.publicKey.toBase58());

  const mint = await createNewMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    6
  );

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  await createMetadata(
    connection,
    metaplex,
    mint,
    user,
    "CPI-22OCT30-0.4 (YES)",
    "CPI-OCT-2",
    "An outcome token",
    "public/tokenSymbol.png",
    "tokenSymbol.png"
  );

  const tokenAccount = await createTokenAccount(
    connection,
    user,
    mint,
    user.publicKey
  );

  await mintTokens(connection, user, mint, tokenAccount.address, user, 1000);

  // Update token meta data //

  // const mint = new web3.PublicKey(
  //   "2ai3sr8eQWZct9KGJyMb9mJsXt49ov1jD8HirxQdWjsk"
  // )
  // await updateTokenMetadata(
  //   connection,
  //   metaplex,
  //   mint,
  //   user,
  //   "Outcome Token",
  //   "SPM",
  //   "A sticky token",
  //   "assets/eye.png",
  //   "eye.png"
  // )

  // Updata token meta data //
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

async function createMetadata(
  connection: web3.Connection,
  metaplex: Metaplex,
  mint: web3.PublicKey,
  user: web3.Keypair,
  name: string,
  symbol: string,
  description: string,
  filePath: string,
  fileName: string
) {
  // read our image from file
  const buffer = fs.readFileSync(filePath);

  const file = toMetaplexFile(buffer, fileName);

  const imageUri = await metaplex.storage().upload(file);
  console.log(imageUri);

  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: name,
      description,
      image: imageUri,
    })
    .run();
  console.log("metadata uri", uri);

  const metadataPDA = await findMetadataPda(mint);

  const tokenMetadata = {
    name: name,
    symbol: symbol,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  const instruction = createCreateMetadataAccountV2Instruction(
    {
      metadata: metadataPDA,
      mint: mint,
      mintAuthority: user.publicKey,
      payer: user.publicKey,
      updateAuthority: user.publicKey,
    },
    {
      createMetadataAccountArgsV2: {
        data: tokenMetadata,
        isMutable: true,
      },
    }
  );

  const transaction = new web3.Transaction();
  transaction.add(instruction);

  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );
  console.log(
    `Create Metadata Account: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana \n`
  );
}

async function createNewMint(
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number
) {
  const tokenMint = await token.createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals
  );

  console.log(
    `Token Mint: https://solana.fm/address/${tokenMint}?cluster=devnet-solana \n`
  );

  return tokenMint;
}

export async function createTokenAccount(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner
  );

  console.log(
    `Token Account: https://solana.fm/address/${tokenAccount.address}?cluster=devnet-solana \n`
  );

  return tokenAccount;
}

export async function mintTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const mintInfo = await token.getMint(connection, mint);

  const transactionSignature = await token.mintTo(
    connection,
    payer,
    mint,
    destination,
    authority,
    amount * 10 ** mintInfo.decimals
  );

  console.log(
    `Mint Token Transaction: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana \n`
  );
}

async function updateTokenMetadata(
  connection: web3.Connection,
  metaplex: Metaplex,
  mint: web3.PublicKey,
  user: web3.Keypair,
  name: string,
  symbol: string,
  description: string,
  filePath: string,
  fileName: string
) {
  const buffer = fs.readFileSync(filePath);

  const file = toMetaplexFile(buffer, fileName);

  const imageUri = await metaplex.storage().upload(file);

  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: name,
      description: description,
      image: imageUri,
    })
    .run();
  console.log("metadata uri", uri, "\n");

  const metadataPDA = await findMetadataPda(mint);

  const tokenMetadata = {
    name: name,
    symbol: symbol,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  const instruction = createUpdateMetadataAccountV2Instruction(
    {
      metadata: metadataPDA,
      updateAuthority: user.publicKey,
    },
    {
      updateMetadataAccountArgsV2: {
        data: tokenMetadata,
        updateAuthority: user.publicKey,
        primarySaleHappened: true,
        isMutable: true,
      },
    }
  );

  const transaction = new web3.Transaction();
  transaction.add(instruction);

  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );
  console.log(
    `Update Metadata Account: https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana \n`
  );
}

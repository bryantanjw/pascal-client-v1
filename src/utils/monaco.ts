import { AnchorProvider, setProvider, Program } from "@project-serum/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { ProtocolAddresses } from "@monaco-protocol/client";
import {
  createMarket,
  MarketType,
  DEFAULT_PRICE_LADDER,
  initialiseOutcomes,
  batchAddPricesToAllOutcomePools,
  ClientResponse,
} from "@monaco-protocol/admin-client";

export async function getProgram() {
  const provider = AnchorProvider.env();
  setProvider(provider);
  const protocol = process.env.PROTOCOL_TYPE;

  let protocolAddress: PublicKey;
  switch (protocol) {
    case "stable":
      protocolAddress = new PublicKey(ProtocolAddresses.DEVNET_STABLE);
      break;
    case "release":
      protocolAddress = new PublicKey(ProtocolAddresses.RELEASE);
      break;
    default:
      console.log(
        "⚠️  PROTOCOL_TYPE env variable not set ⚠️\n\nSet with:\n\nexport PROTOCOL_TYPE=stable\nexport PROTOCOL_TYPE=release"
      );
      process.exit(1);
  }

  const program = await Program.at(protocolAddress, provider);

  console.log(`Protocol type: ${protocol}`);
  console.log(`RPC node: ${program.provider.connection.rpcEndpoint}`);
  console.log(`Wallet PublicKey: ${program.provider.publicKey}`);

  return program;
}

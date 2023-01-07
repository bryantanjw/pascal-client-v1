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

export async function createVerboseMarket(program, marketName, lockTimestamp) {
  const mintToken = new PublicKey(
    "So11111111111111111111111111111111111111112"
  ); // <-- Wrapped SOL token address
  // Generate a publicKey to represent the event
  const eventAccountKeyPair = Keypair.generate();
  const eventPk = eventAccountKeyPair.publicKey;

  const marketLock = new Date(lockTimestamp).getTime(); // <-- lockTimestamp in seconds
  const type = MarketType.EventResultWinner;
  const outcomes = ["Yes", "No"];
  const priceLadder = Array.from({ length: 50 }, (_, i) => i + 1); // <-- 1 - 100 price ladder
  const batchSize = 50;

  function logResponse(response: ClientResponse<{}>) {
    function logJson(json: object) {
      console.log(JSON.stringify(json, null, 2));
    }

    if (!response.success) {
      console.log(response.errors);
    } else {
      logJson(response);
    }
  }

  console.log(`Creating market ⏱`);
  console.log("program", program);
  const marketResponse = await createMarket(
    program,
    marketName,
    type,
    mintToken,
    marketLock,
    eventPk
  );
  // returns CreateMarketResponse: market account public key, creation transaction id, and market account
  logResponse(marketResponse);
  if (marketResponse.success) {
    console.log(
      `MarketAccount ${marketResponse.data.marketPk.toString()} created ✅`
    );
    console.log(`TransactionId: ${marketResponse.data.tnxId}`);
  } else {
    console.log("Error creating market");
    return;
  }

  const marketPk = marketResponse.data.marketPk;

  console.log(`Initialising market outcomes ⏱`);
  const initialiseOutcomePoolsResponse = await initialiseOutcomes(
    program,
    marketPk,
    outcomes
  );
  // returns OutcomeInitialisationsResponse: list of outcomes, their pdas, and transaction id
  logResponse(initialiseOutcomePoolsResponse);
  if (initialiseOutcomePoolsResponse.success)
    console.log(`Outcomes added to market ✅`);
  else {
    console.log("Error initialising outcomes");
    return;
  }

  console.log(`Adding prices to outcomes ⏱`);
  const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
    program,
    marketPk,
    priceLadder,
    batchSize
  );
  // returns BatchAddPricesToOutcomeResponse: transaction id, and confirmation
  logResponse(addPriceLaddersResponse);
  if (addPriceLaddersResponse.success)
    console.log(`Prices added to outcomes ✅`);
  else {
    console.log("Error adding prices to outcomes");
    return;
  }

  console.log(`Market ${marketPk.toString()} creation complete ✨`);
  // return marketAccount
  return marketResponse;
}

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

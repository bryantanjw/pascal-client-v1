import { PublicKey, Keypair } from '@solana/web3.js'
import { createMarket, MarketType, DEFAULT_PRICE_LADDER, initialiseOutcomes, batchAddPricesToAllOutcomePools, addPricesToOutcome } from "@monaco-protocol/admin-client"
import { getProgram, getProcessArgs } from "@/utils/monaco"

async function createVerboseMarket(mintToken: PublicKey){
    const program = await getProgram()
    // Generate a publicKey to represent the event
    const eventAccountKeyPair = Keypair.generate();
    const eventPk = eventAccountKeyPair.publicKey;
    
    const marketName = "Example Market";
    const type = MarketType.EventResultWinner;
    const marketLock = 32503680000;
    const outcomes = ["Red", "Blue"];
    const priceLadder = DEFAULT_PRICE_LADDER;
    const batchSize = 40;

    console.log(`Creating market ⏱`)
    const marketResponse = await createMarket(
        program,
        marketName,
        type,
        mintToken,
        marketLock,
        eventPk
    )
    console.log(marketResponse)
    if (marketResponse.success) console.log(`Market ${marketResponse.data.marketPk.toString()} created ✅`)
    else return

    const marketPk = marketResponse.data.marketPk

    console.log(`Initialising market outcomes ⏱`)
    const initialiseOutcomePoolsResponse = await initialiseOutcomes(
        program,
        marketPk,
        outcomes
    )

    console.log(initialiseOutcomePoolsResponse)
    if (initialiseOutcomePoolsResponse.success) console.log(`Outcomes added to market ✅`)
    else return

    console.log(`Adding prices to outcomes ⏱`)
    const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
        program,
        marketPk,
        priceLadder,
        batchSize
    )

    console.log(addPriceLaddersResponse)
    if (addPriceLaddersResponse.success) console.log(`Prices added to outcomes ✅`)
    else return

    console.log(`Market ${marketPk.toString()} creation complete ✨`)
}

const processArgs = getProcessArgs(["mintToken"], "npm run createMarketVerbose")
const mintToken = new PublicKey(processArgs.mintToken)
createVerboseMarket(mintToken)

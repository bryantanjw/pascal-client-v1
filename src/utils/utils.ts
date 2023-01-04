import { PublicKey, Keypair } from "@solana/web3.js"
import { 
    createMarket,
    MarketType,
    DEFAULT_PRICE_LADDER, 
    initialiseOutcomes,
    batchAddPricesToAllOutcomePools,
    ClientResponse,
} from "@monaco-protocol/admin-client"
import { getProgram } from "@/utils/solana"

function logResponse(response: ClientResponse<{}>){
    function logJson(json: object){
        console.log(JSON.stringify(json, null, 2))
    }

    if (!response.success){
        console.log(response.errors)
    }
    else{
        logJson(response)
    }
}

export async function createVerboseMarket({ ...values }) {
    const { marketName, marketLock } = values
    const mintToken = new PublicKey("")
    const program = await getProgram()
    // Generate a publicKey to represent the event
    const eventAccountKeyPair = Keypair.generate();
    const eventPk = eventAccountKeyPair.publicKey;
    
    const type = MarketType.EventResultWinner;
    const outcomes = ["Yes", "No"];
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
    logResponse(marketResponse)
    if (marketResponse.success) {
        console.log(`MarketAccount ${marketResponse.data.marketPk.toString()} created ✅`)
        console.log(`TransactionId: ${marketResponse.data.tnxId}`)
    }
    else return

    const marketPk = marketResponse.data.marketPk

    console.log(`Initialising market outcomes ⏱`)
    const initialiseOutcomePoolsResponse = await initialiseOutcomes(
        program,
        marketPk,
        outcomes
    )

    logResponse(initialiseOutcomePoolsResponse)
    if (initialiseOutcomePoolsResponse.success) console.log(`Outcomes added to market ✅`)
    else return

    console.log(`Adding prices to outcomes ⏱`)
    const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
        program,
        marketPk,
        priceLadder,
        batchSize
    )

    logResponse(addPriceLaddersResponse)
    if (addPriceLaddersResponse.success) console.log(`Prices added to outcomes ✅`)
    else return

    console.log(`Market ${marketPk.toString()} creation complete ✨`)
}

export function truncate (fullStr, strLen, separator?) {
    if (fullStr.length <= strLen) return fullStr;
    
    separator = separator || '...';
    
    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow),
        backChars = Math.floor(charsToShow);
    
    return fullStr.substr(0, frontChars) + 
        separator + 
        fullStr.substr(fullStr.length - backChars);
}
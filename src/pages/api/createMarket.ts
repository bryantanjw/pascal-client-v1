import { PublicKey, Keypair } from "@solana/web3.js"
import { 
    createMarket,
    MarketType,
    DEFAULT_PRICE_LADDER, 
    initialiseOutcomes,
    batchAddPricesToAllOutcomePools,
    ClientResponse,
} from "@monaco-protocol/admin-client"
import { getMarketOutcomesByMarket } from "@monaco-protocol/client"
import { getProgram } from "@/utils/solana"
import clientPromise from "@/lib/mongodb"

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            console.log("body is", req.body)
            const { title, category, lockTimestamp, description } = req.body

            // Create market on chain
            const program = await getProgram()
            const marketResponseData = await createVerboseMarket(program, title, lockTimestamp)
            // Get accounts
            const marketAccount = marketResponseData?.market
            const marketOutcomeResponse = await getMarketOutcomesByMarket(program, marketResponseData!.marketPk)
            const marketOutcomeAccounts = marketOutcomeResponse?.data.marketOutcomeAccounts

            // Add market to db
            const client = await clientPromise
            const markets = client.db("pascal").collection("markets")
            const market = await markets.insertOne({
                marketAccount,
                marketOutcomeAccounts,
            })
            console.log(`A document is inserted with the _id: ${market.insertedId}`)

            // Update market data in db
            await markets.updateOne(
                { _id: market.insertedId },
                { $set: { 
                    category: category,
                    description: description,
                } },
                { upsert: true }
            );

            res.status(200).send({ status: "success", market: market })
        } catch (e) {
            console.error("createMarket api error", e)
            res.status(500).send({ status: "error creating market" })
            return
        }
    } else {
        res.status(405).send(`Method ${req.method} not allowed`)
    }
}

async function createVerboseMarket(program, marketName, lockTimestamp) {
    const mintToken = new PublicKey("So11111111111111111111111111111111111111112") // <-- Wrapped SOL token address
    // Generate a publicKey to represent the event
    const eventAccountKeyPair = Keypair.generate();
    const eventPk = eventAccountKeyPair.publicKey;
    
    const marketLock = lockTimestamp.getTime(); // <-- lockTimestamp in seconds
    const type = MarketType.EventResultWinner;
    const outcomes = ["Yes", "No"];
    const priceLadder = DEFAULT_PRICE_LADDER;
    const batchSize = 40;

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

    console.log(`Creating market ⏱`)
    const marketResponse = await createMarket(
        program, 
        marketName,
        type,
        mintToken,
        marketLock,
        eventPk
    )
    // returns CreateMarketResponse: market account public key, creation transaction id, and market account
    logResponse(marketResponse)
    if (marketResponse.success) {
        console.log(`MarketAccount ${marketResponse.data.marketPk.toString()} created ✅`)
        console.log(`TransactionId: ${marketResponse.data.tnxId}`)
    }
    else {
        console.log("Error creating market")
        return
    }

    const marketPk = marketResponse.data.marketPk

    console.log(`Initialising market outcomes ⏱`)
    const initialiseOutcomePoolsResponse = await initialiseOutcomes(
        program,
        marketPk,
        outcomes
    )
    // returns OutcomeInitialisationsResponse: list of outcomes, their pdas, and transaction id
    logResponse(initialiseOutcomePoolsResponse)
    if (initialiseOutcomePoolsResponse.success) console.log(`Outcomes added to market ✅`)
    else {
        console.log("Error initialising outcomes")
        return
    }

    console.log(`Adding prices to outcomes ⏱`)
    const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
        program,
        marketPk,
        priceLadder,
        batchSize
    )
    // returns BatchAddPricesToOutcomeResponse: transaction id, and confirmation
    logResponse(addPriceLaddersResponse)
    if (addPriceLaddersResponse.success) console.log(`Prices added to outcomes ✅`)
    else {
        console.log("Error adding prices to outcomes")
        return
    }

    console.log(`Market ${marketPk.toString()} creation complete ✨`)
    // return marketAccount
    return marketResponse.data
}
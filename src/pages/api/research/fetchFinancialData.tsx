import { NextApiRequest, NextApiResponse } from "next"
import nc from "next-connect"
import cors from "cors"

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(cors())
    .get(async (req, res) => {
        try {
            const ticker = req.query.ticker || ""
            const response = await(await fetch(
                // Doc: https://syncwith.com/yahoo-finance/yahoo-finance-api
                `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?metrics=high?&interval=5m&range=5d`
            )).json()
            const { chart } = response
            res.status(200).json(chart.result[0])
        } catch (e) {
            console.log("fetchFinancialData error", e)
        }
    })

export default handler
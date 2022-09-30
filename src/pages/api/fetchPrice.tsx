import { NextApiRequest, NextApiResponse } from "next"
import nc from "next-connect"
import cors from "cors"

// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '1553c27563msheb6fe212a68fa57p1ed6b5jsn460d11bee52a',
// 		'X-RapidAPI-Host': 'yahoofinance-stocks1.p.rapidapi.com'
// 	}
// }
// export default async function handler(req, res) {
//     if (req.method === "GET") {
//         const response = await fetch('https://yahoofinance-stocks1.p.rapidapi.com/stock-prices?EndDateInclusive=2020-04-01&StartDateInclusive=2020-01-01&Symbol=MSFT&OrderBy=Ascending', 
//             options
//         )
//         res.status(200).json(response)
//     }
//     else {
//         res.status(405).send(`Method ${req.method} not allowed`);
//     }
// }

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(cors())
    .get(async (req, res) => {
        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/aapl?metrics=high?&interval=1d&range=5d`
        )
        res.status(200).json(response)
    })

export default handler
// This API endpoint will let users POST data to add records and GET to retrieve
import users from "./users.json"

function get(req, res) {
    const { pubKey } = req.query

    // Check if this address exists
    const account = users.filter((users) => users.pubKey === pubKey)
    if (account.length === 0) {
        // 204 = successfully processed the request, but not returning any content
        res.status(204).send();
    } else {
        res.status(200).json(account)
    }
}

async function post(req, res) {
    console.log("Received post request", req.body)
}

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            get(req, res);
            break;
        case "POST":
            await post(req, res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
    }
}
import markets from "./markets.json";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { slug } = req.body;
        console.log(slug)

        if (!slug) {
            res.status(400).send("Missing marketId");
        }

        const event = markets.find((p) => p.marketId == slug)
        
        if (event) {
            const { ...props } = event
            console.log("Event found.", props)
            return res.status(200).send({ props });
        } else {
            console.log("Event not found")
            return res.status(404).send("Event not found");
        }
    } else {
        res.status(405).send(`Method ${req.method} not allowed`);
    }
}
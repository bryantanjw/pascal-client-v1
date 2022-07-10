import products from "./products.json";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { slug } = req.body;
        console.log(slug)

        if (!slug) {
            res.status(400).send("Missing questionId");
        }

        const product = products.find((p) => p.questionId == slug)
        
        if (product) {
            const { ...props } = product
            console.log("Item found.", props)
            return res.status(200).send({ props });
        } else {
            console.log("Item not found")
            return res.status(404).send("Item not found");
        }
    } else {
        res.status(405).send(`Method ${req.method} not allowed`);
    }
    
}